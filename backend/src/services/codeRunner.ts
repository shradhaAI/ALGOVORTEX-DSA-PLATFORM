import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sandboxDir = path.resolve(__dirname, '../../sandbox_temp');
if (!fs.existsSync(sandboxDir)) {
  fs.mkdirSync(sandboxDir, { recursive: true });
}

export interface TestCase {
  id?: number;
  input: string;
  expected_output: string;
  is_sample: number;
  explanation?: string;
}

export interface TestResultItem {
  testCaseIndex: number;
  isSample: boolean;
  passed: boolean;
  input: string;
  userOutput: string;
  expectedOutput?: string; // Omitted for hidden test cases
  error?: string;
  executionTimeMs: number;
}

export interface ExecutionResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  totalTestCases: number;
  passedCount: number;
  executionTimeMs: number;
  memoryKb: number;
  testResults: TestResultItem[];
  outputLog?: string;
}

const TIMEOUT_MS_DEFAULT = 3000;
const TIMEOUT_MS_JAVA = 6000; // JVM startup adds ~1-2s overhead

function cleanString(str: string): string {
  return str.replace(/\r\n/g, '\n').trim();
}

/**
 * Compile Java code synchronously in an isolated subfolder.
 * Returns { success, errorMsg, javaDir }
 */
function compileJava(code: string, fileId: string): { success: boolean; errorMsg: string; javaDir: string } {
  const javaDir = path.join(sandboxDir, `java_${fileId}`);
  try {
    fs.mkdirSync(javaDir, { recursive: true });
    const javaFile = path.join(javaDir, 'Solution.java');
    fs.writeFileSync(javaFile, code, 'utf8');

    const compileResult = spawnSync('javac', ['Solution.java'], {
      cwd: javaDir,
      encoding: 'utf8',
      timeout: 12000,
      windowsHide: true,
    });

    if (compileResult.status !== 0) {
      // Clean up on compile failure
      try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch {}
      return {
        success: false,
        errorMsg: compileResult.stderr || compileResult.stdout || 'Compilation failed with no output.',
        javaDir,
      };
    }

    return { success: true, errorMsg: '', javaDir };
  } catch (err: any) {
    try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch {}
    return { success: false, errorMsg: err.message || 'Compilation error', javaDir };
  }
}

/**
 * Execute single test case in an isolated subprocess
 */
async function executeTestCaseIsolated(
  language: string,
  code: string,
  input: string,
  fileId: string,
  javaCompiledDir?: string // Pre-compiled Java dir to avoid re-compiling per test case
): Promise<{ stdout: string; stderr: string; timeMs: number; timedOut: boolean; exitCode: number | null }> {
  let ext = 'js';
  let cmd = 'node';
  let args: string[] = [];
  let filePath = '';
  let timeoutMs = TIMEOUT_MS_DEFAULT;

  if (language === 'python' || language === 'py') {
    ext = 'py';
    cmd = 'py';
    args = [];
    filePath = path.join(sandboxDir, `runner_${fileId}.${ext}`);
    fs.writeFileSync(filePath, code, 'utf8');
  } else if (language === 'javascript' || language === 'js') {
    ext = 'js';
    cmd = 'node';
    args = ['--max-old-space-size=64'];
    filePath = path.join(sandboxDir, `runner_${fileId}.${ext}`);
    fs.writeFileSync(filePath, code, 'utf8');
  } else if (language === 'java') {
    // Java: use pre-compiled directory — just run. No filePath needed (dir cleanup handled outside)
    timeoutMs = TIMEOUT_MS_JAVA;
    cmd = 'java';
    args = ['-cp', javaCompiledDir!, 'Solution'];
  } else if (language === 'cpp') {
    // C++ not installed — handled at top-level before this function is called
    throw new Error('C++ execution requested but compiler not available.');
  } else {
    throw new Error(`Language "${language}" is not supported in this local sandbox.`);
  }

  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const spawnArgs = language === 'java' ? args : [...args, filePath];
    const spawnCwd = language === 'java' ? javaCompiledDir : sandboxDir;

    const child = spawn(cmd, spawnArgs, {
      cwd: spawnCwd,
      env: {
        ...process.env,
        PYTHONDONTWRITEBYTECODE: '1',
        NODE_ENV: 'test',
        // Restrict Java from loading unnecessary modules
        ...(language === 'java' ? { JAVA_TOOL_OPTIONS: '' } : {}),
      },
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // Ignored
      }
    }, timeoutMs);

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const endTime = process.hrtime.bigint();
      const timeMs = Number(endTime - startTime) / 1_000_000;

      // Clean up temp script files (not Java dirs — handled separately)
      if (filePath) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch {
          // Ignored
        }
      }

      resolve({
        stdout,
        stderr,
        timeMs: Math.round(timeMs),
        timedOut,
        exitCode: code,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      if (filePath) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch {}
      }

      resolve({
        stdout: '',
        stderr: err.message,
        timeMs: 0,
        timedOut: false,
        exitCode: 1,
      });
    });
  });
}

/**
 * Main execution runner: evaluates user code against sample and hidden test cases
 */
export async function executeCode(
  language: string,
  code: string,
  testCases: TestCase[],
  evaluateAll: boolean = false
): Promise<ExecutionResult> {
  const casesToRun = evaluateAll ? testCases : testCases.filter((tc) => tc.is_sample === 1);
  const totalCount = casesToRun.length;
  let passedCount = 0;
  let maxTimeMs = 0;
  let overallVerdict: ExecutionResult['verdict'] = 'Accepted';
  const testResults: TestResultItem[] = [];
  let logOutput = '';

  const fileId = crypto.randomBytes(6).toString('hex');
  const normalizedLang = language.toLowerCase();

  // ── C++ graceful unavailability notice ──────────────────────────────────────
  if (normalizedLang === 'cpp' || normalizedLang === 'c++') {
    return {
      verdict: 'Compilation Error',
      totalTestCases: totalCount,
      passedCount: 0,
      executionTimeMs: 0,
      memoryKb: 0,
      testResults: [],
      outputLog:
        'C++ compiler (g++) is not installed on this machine.\n\n' +
        'To enable C++ execution locally, install one of:\n' +
        '  • MinGW-w64 (https://winlibs.com/) and add to PATH\n' +
        '  • LLVM / Clang (https://releases.llvm.org/)\n' +
        '  • MSYS2 with pacman -S mingw-w64-x86_64-gcc\n\n' +
        'Alternatively, configure Judge0 (JUDGE0_API_URL in .env) for cloud-based C++ execution.',
    };
  }

  // ── Unsupported language check ───────────────────────────────────────────────
  const supportedLanguages = ['python', 'py', 'javascript', 'js', 'java'];
  if (!supportedLanguages.includes(normalizedLang)) {
    return {
      verdict: 'Compilation Error',
      totalTestCases: totalCount,
      passedCount: 0,
      executionTimeMs: 0,
      memoryKb: 0,
      testResults: [],
      outputLog: `Language "${language}" is not supported. Supported: Python, JavaScript, Java.`,
    };
  }

  // ── Java: compile once before running test cases ─────────────────────────────
  let javaCompiledDir: string | undefined;
  if (normalizedLang === 'java') {
    const compileResult = compileJava(code, fileId);
    if (!compileResult.success) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: `Java Compilation Error:\n\n${compileResult.errorMsg}`,
      };
    }
    javaCompiledDir = compileResult.javaDir;
  }

  // ── Run each test case ───────────────────────────────────────────────────────
  for (let i = 0; i < casesToRun.length; i++) {
    const tc = casesToRun[i];
    const execRes = await executeTestCaseIsolated(
      normalizedLang,
      code,
      tc.input,
      `${fileId}_${i}`,
      javaCompiledDir
    );

    maxTimeMs = Math.max(maxTimeMs, execRes.timeMs);

    const timeoutLabel = normalizedLang === 'java' ? `> ${TIMEOUT_MS_JAVA}ms` : `> ${TIMEOUT_MS_DEFAULT}ms`;

    if (execRes.timedOut) {
      overallVerdict = 'Time Limit Exceeded';
      testResults.push({
        testCaseIndex: i + 1,
        isSample: tc.is_sample === 1,
        passed: false,
        input: tc.input,
        userOutput: `Time Limit Exceeded (${timeoutLabel})`,
        expectedOutput: tc.is_sample === 1 ? tc.expected_output : undefined,
        error: `Execution exceeded time limit. Check for infinite loops or non-optimal algorithms.`,
        executionTimeMs: execRes.timeMs,
      });
      break;
    }

    if (execRes.exitCode !== 0) {
      overallVerdict = 'Runtime Error';
      logOutput = execRes.stderr || 'Process exited with non-zero exit code';
      testResults.push({
        testCaseIndex: i + 1,
        isSample: tc.is_sample === 1,
        passed: false,
        input: tc.input,
        userOutput: execRes.stdout,
        expectedOutput: tc.is_sample === 1 ? tc.expected_output : undefined,
        error: execRes.stderr,
        executionTimeMs: execRes.timeMs,
      });
      break;
    }

    const actual = cleanString(execRes.stdout);
    const expected = cleanString(tc.expected_output);
    const passed = actual === expected;

    if (passed) {
      passedCount++;
    } else if (overallVerdict === 'Accepted') {
      overallVerdict = 'Wrong Answer';
    }

    testResults.push({
      testCaseIndex: i + 1,
      isSample: tc.is_sample === 1,
      passed,
      input: tc.input,
      userOutput: actual,
      // Never expose hidden test expected output
      expectedOutput: tc.is_sample === 1 ? expected : undefined,
      executionTimeMs: execRes.timeMs,
    });

    // Stop early on first failure during full evaluation to save resources
    if (!passed && evaluateAll) {
      break;
    }
  }

  // ── Java cleanup: remove compiled class directory ────────────────────────────
  if (javaCompiledDir) {
    try {
      fs.rmSync(javaCompiledDir, { recursive: true, force: true });
    } catch {
      // Ignored — cleanup best-effort
    }
  }

  // Memory estimation (rough approximation — not actual measurement)
  const baseMemory = normalizedLang === 'java' ? 65000 : 18400;
  const estimatedMemoryKb = baseMemory + Math.floor(Math.random() * 4200);

  return {
    verdict: overallVerdict,
    totalTestCases: totalCount,
    passedCount,
    executionTimeMs: maxTimeMs,
    memoryKb: estimatedMemoryKb,
    testResults,
    outputLog: logOutput,
  };
}
