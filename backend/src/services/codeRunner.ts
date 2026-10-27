import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSandboxDir(): string {
  if (process.env.SANDBOX_DIR) {
    try {
      if (!fs.existsSync(process.env.SANDBOX_DIR)) {
        fs.mkdirSync(process.env.SANDBOX_DIR, { recursive: true });
      }
      return process.env.SANDBOX_DIR;
    } catch {
      // Fall through to os.tmpdir()
    }
  }

  if (process.env.VERCEL) {
    const dir = path.join(os.tmpdir(), 'algovortex_sandbox');
    if (!fs.existsSync(dir)) {
      try { fs.mkdirSync(dir, { recursive: true }); } catch {}
    }
    return dir;
  }

  const defaultDir = path.resolve(__dirname, '../../sandbox_temp');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    // Write package.json with type commonjs so require('fs') works seamlessly
    try {
      fs.writeFileSync(path.join(defaultDir, 'package.json'), JSON.stringify({ type: 'commonjs' }), 'utf8');
    } catch {}
    return defaultDir;
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'algovortex_sandbox');
    if (!fs.existsSync(tmpDir)) {
      try { fs.mkdirSync(tmpDir, { recursive: true }); } catch {}
    }
    try {
      fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ type: 'commonjs' }), 'utf8');
    } catch {}
    return tmpDir;
  }
}

const sandboxDir = getSandboxDir();

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

function sanitizeDiagnostics(text: string, filePath: string, ext: string): string {
  if (!text) return text;
  let sanitized = text;
  if (filePath) {
    sanitized = sanitized.split(filePath).join(`Solution.${ext}`);
    try {
      const forwardPath = filePath.replace(/\\/g, '/');
      sanitized = sanitized.split(forwardPath).join(`Solution.${ext}`);
      sanitized = sanitized.split(`file:///${forwardPath}`).join(`Solution.${ext}`);
      sanitized = sanitized.split(`file://${forwardPath}`).join(`Solution.${ext}`);
    } catch {}
  }
  sanitized = sanitized.replace(/runner_[a-f0-9]+_\d+\.(py|js|cjs|ts|java|c|cpp|rs|rb)/gi, 'Solution.$1');
  sanitized = sanitized.replace(/runner_[a-f0-9]+\.(py|js|cjs|ts|java|c|cpp|rs|rb)/gi, 'Solution.$1');
  if (sandboxDir) {
    sanitized = sanitized.split(sandboxDir).join('.');
    const forwardSandbox = sandboxDir.replace(/\\/g, '/');
    sanitized = sanitized.split(forwardSandbox).join('.');
  }
  return sanitized;
}

function checkCommandAvailable(cmd: string): boolean {
  try {
    const res = spawnSync(cmd, ['--version'], { encoding: 'utf8', timeout: 3000, windowsHide: true });
    return res.status === 0;
  } catch {
    return false;
  }
}

function getPythonCommand(): string {
  if (process.env.PYTHON_CMD) return process.env.PYTHON_CMD;
  return process.platform === 'win32' ? 'py' : 'python3';
}

/**
 * Compile Java code synchronously in an isolated subfolder.
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
      try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch {}
      const rawMsg = compileResult.stderr || compileResult.stdout || 'Compilation failed with no output.';
      return {
        success: false,
        errorMsg: sanitizeDiagnostics(rawMsg, javaDir, 'java'),
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
 * Compile C code if gcc/clang is available.
 */
function compileC(code: string, fileId: string): { success: boolean; errorMsg: string; binDir: string; binFile: string } {
  const binDir = path.join(sandboxDir, `c_${fileId}`);
  try {
    fs.mkdirSync(binDir, { recursive: true });
    const cFile = path.join(binDir, 'Solution.c');
    const binFile = path.join(binDir, process.platform === 'win32' ? 'Solution.exe' : 'Solution');
    fs.writeFileSync(cFile, code, 'utf8');

    const compiler = checkCommandAvailable('gcc') ? 'gcc' : 'clang';
    const compileResult = spawnSync(compiler, ['-O2', 'Solution.c', '-o', binFile], {
      cwd: binDir,
      encoding: 'utf8',
      timeout: 12000,
      windowsHide: true,
    });

    if (compileResult.status !== 0) {
      try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
      const rawMsg = compileResult.stderr || compileResult.stdout || 'Compilation failed.';
      return { success: false, errorMsg: sanitizeDiagnostics(rawMsg, binDir, 'c'), binDir, binFile };
    }

    return { success: true, errorMsg: '', binDir, binFile };
  } catch (err: any) {
    try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
    return { success: false, errorMsg: err.message || 'C compilation error', binDir, binFile: '' };
  }
}

/**
 * Compile C++ code if g++/clang++ is available.
 */
function compileCpp(code: string, fileId: string): { success: boolean; errorMsg: string; binDir: string; binFile: string } {
  const binDir = path.join(sandboxDir, `cpp_${fileId}`);
  try {
    fs.mkdirSync(binDir, { recursive: true });
    const cppFile = path.join(binDir, 'Solution.cpp');
    const binFile = path.join(binDir, process.platform === 'win32' ? 'Solution.exe' : 'Solution');
    fs.writeFileSync(cppFile, code, 'utf8');

    const compiler = checkCommandAvailable('g++') ? 'g++' : 'clang++';
    const compileResult = spawnSync(compiler, ['-O2', '-std=c++20', 'Solution.cpp', '-o', binFile], {
      cwd: binDir,
      encoding: 'utf8',
      timeout: 12000,
      windowsHide: true,
    });

    if (compileResult.status !== 0) {
      try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
      const rawMsg = compileResult.stderr || compileResult.stdout || 'Compilation failed.';
      return { success: false, errorMsg: sanitizeDiagnostics(rawMsg, binDir, 'cpp'), binDir, binFile };
    }

    return { success: true, errorMsg: '', binDir, binFile };
  } catch (err: any) {
    try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
    return { success: false, errorMsg: err.message || 'C++ compilation error', binDir, binFile: '' };
  }
}

/**
 * Compile Rust code if rustc is available.
 */
function compileRust(code: string, fileId: string): { success: boolean; errorMsg: string; binDir: string; binFile: string } {
  const binDir = path.join(sandboxDir, `rust_${fileId}`);
  try {
    fs.mkdirSync(binDir, { recursive: true });
    const rsFile = path.join(binDir, 'Solution.rs');
    const binFile = path.join(binDir, process.platform === 'win32' ? 'Solution.exe' : 'Solution');
    fs.writeFileSync(rsFile, code, 'utf8');

    const compileResult = spawnSync('rustc', ['-O', 'Solution.rs', '-o', binFile], {
      cwd: binDir,
      encoding: 'utf8',
      timeout: 15000,
      windowsHide: true,
    });

    if (compileResult.status !== 0) {
      try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
      const rawMsg = compileResult.stderr || compileResult.stdout || 'Rust compilation failed.';
      return { success: false, errorMsg: sanitizeDiagnostics(rawMsg, binDir, 'rs'), binDir, binFile };
    }

    return { success: true, errorMsg: '', binDir, binFile };
  } catch (err: any) {
    try { fs.rmSync(binDir, { recursive: true, force: true }); } catch {}
    return { success: false, errorMsg: err.message || 'Rust compilation error', binDir, binFile: '' };
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
  extraDir?: string,
  compiledBin?: string
): Promise<{ stdout: string; stderr: string; timeMs: number; timedOut: boolean; exitCode: number | null }> {
  let ext = 'js';
  let cmd = 'node';
  let args: string[] = [];
  let filePath = '';
  let timeoutMs = TIMEOUT_MS_DEFAULT;

  if (language === 'python' || language === 'py') {
    ext = 'py';
    cmd = getPythonCommand();
    args = [];
    filePath = path.join(sandboxDir, `runner_${fileId}.${ext}`);
    fs.writeFileSync(filePath, code, 'utf8');
  } else if (language === 'javascript' || language === 'js') {
    ext = 'cjs';
    cmd = 'node';
    args = ['--max-old-space-size=64'];
    filePath = path.join(sandboxDir, `runner_${fileId}.${ext}`);
    fs.writeFileSync(filePath, code, 'utf8');
  } else if (language === 'java') {
    timeoutMs = TIMEOUT_MS_JAVA;
    cmd = 'java';
    args = ['-cp', extraDir!, 'Solution'];
  } else if (language === 'c' || language === 'cpp' || language === 'rust') {
    cmd = compiledBin!;
    args = [];
  } else if (language === 'ruby' || language === 'rb') {
    ext = 'rb';
    cmd = 'ruby';
    args = [];
    filePath = path.join(sandboxDir, `runner_${fileId}.${ext}`);
    fs.writeFileSync(filePath, code, 'utf8');
  } else {
    throw new Error(`Language "${language}" is not supported in this local sandbox.`);
  }

  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const spawnArgs = (language === 'java' || language === 'c' || language === 'cpp' || language === 'rust')
      ? args
      : [...args, filePath];
    const spawnCwd = extraDir || sandboxDir;

    const child = spawn(cmd, spawnArgs, {
      cwd: spawnCwd,
      env: {
        ...process.env,
        PYTHONDONTWRITEBYTECODE: '1',
        NODE_ENV: 'test',
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

    child.stdout.on('data', (data: Buffer | string) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer | string) => {
      stderr += data.toString();
    });

    child.on('close', (closeCode: number | null) => {
      clearTimeout(timer);
      const endTime = process.hrtime.bigint();
      const timeMs = Number(endTime - startTime) / 1_000_000;

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
        stdout: sanitizeDiagnostics(stdout, filePath, ext),
        stderr: sanitizeDiagnostics(stderr, filePath, ext),
        timeMs: Math.round(timeMs),
        timedOut,
        exitCode: closeCode,
      });
    });

    child.on('error', (err: Error) => {
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

  // ── Language Support & Compiler Availability Checks ─────────────────────────
  const validLanguages = ['python', 'py', 'java', 'javascript', 'js', 'c', 'cpp', 'c++', 'rust', 'rs', 'ruby', 'rb'];
  if (!validLanguages.includes(normalizedLang)) {
    return {
      verdict: 'Compilation Error',
      totalTestCases: totalCount,
      passedCount: 0,
      executionTimeMs: 0,
      memoryKb: 0,
      testResults: [],
      outputLog: `Language "${language}" is not supported. Supported languages: Python, Java, JavaScript, C, C++, Rust, Ruby.`,
    };
  }

  // ── C: Check Compiler ────────────────────────────────────────────────────────
  let cBinDir: string | undefined;
  let cBinFile: string | undefined;
  if (normalizedLang === 'c') {
    const hasC = checkCommandAvailable('gcc') || checkCommandAvailable('clang');
    if (!hasC) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog:
          'C compiler (gcc or clang) is not installed on this server environment.\n\n' +
          'To run C code locally:\n' +
          '  • Windows: Install MinGW-w64 (https://winlibs.com/) or MSYS2\n' +
          '  • Linux: sudo apt install build-essential\n' +
          '  • macOS: xcode-select --install\n\n' +
          'Alternatively, configure JUDGE0_API_URL in backend environment for cloud execution.',
      };
    }
    const cResult = compileC(code, fileId);
    if (!cResult.success) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: `C Compilation Error:\n\n${cResult.errorMsg}`,
      };
    }
    cBinDir = cResult.binDir;
    cBinFile = cResult.binFile;
  }

  // ── C++: Check Compiler ──────────────────────────────────────────────────────
  let cppBinDir: string | undefined;
  let cppBinFile: string | undefined;
  if (normalizedLang === 'cpp' || normalizedLang === 'c++') {
    const hasCpp = checkCommandAvailable('g++') || checkCommandAvailable('clang++');
    if (!hasCpp) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog:
          'C++ compiler (g++ or clang++) is not installed on this server environment.\n\n' +
          'To run C++ code locally:\n' +
          '  • Windows: Install MinGW-w64 (https://winlibs.com/) or MSYS2\n' +
          '  • Linux: sudo apt install g++ build-essential\n' +
          '  • macOS: xcode-select --install\n\n' +
          'Alternatively, configure JUDGE0_API_URL in backend environment for cloud execution.',
      };
    }
    const cppResult = compileCpp(code, fileId);
    if (!cppResult.success) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: `C++ Compilation Error:\n\n${cppResult.errorMsg}`,
      };
    }
    cppBinDir = cppResult.binDir;
    cppBinFile = cppResult.binFile;
  }

  // ── Rust: Check Compiler ─────────────────────────────────────────────────────
  let rustBinDir: string | undefined;
  let rustBinFile: string | undefined;
  if (normalizedLang === 'rust' || normalizedLang === 'rs') {
    const hasRust = checkCommandAvailable('rustc');
    if (!hasRust) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog:
          'Rust compiler (rustc) is not installed on this server environment.\n\n' +
          'To run Rust code locally:\n' +
          '  • Install Rust via https://rustup.rs/\n' +
          '  • Verify with: rustc --version\n\n' +
          'Alternatively, configure JUDGE0_API_URL in backend environment for cloud execution.',
      };
    }
    const rustResult = compileRust(code, fileId);
    if (!rustResult.success) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: `Rust Compilation Error:\n\n${rustResult.errorMsg}`,
      };
    }
    rustBinDir = rustResult.binDir;
    rustBinFile = rustResult.binFile;
  }

  // ── Ruby: Check Interpreter ──────────────────────────────────────────────────
  if (normalizedLang === 'ruby' || normalizedLang === 'rb') {
    const hasRuby = checkCommandAvailable('ruby');
    if (!hasRuby) {
      return {
        verdict: 'Compilation Error',
        totalTestCases: totalCount,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog:
          'Ruby interpreter is not installed on this server environment.\n\n' +
          'To run Ruby code locally:\n' +
          '  • Windows: Install Ruby from https://rubyinstaller.org/\n' +
          '  • Linux: sudo apt install ruby\n' +
          '  • macOS: brew install ruby\n\n' +
          'Alternatively, configure JUDGE0_API_URL in backend environment for cloud execution.',
      };
    }
  }

  // ── Java: Compile once before running test cases ─────────────────────────────
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
  try {
    for (let i = 0; i < casesToRun.length; i++) {
      const tc = casesToRun[i];
      const execRes = await executeTestCaseIsolated(
        normalizedLang,
        code,
        tc.input,
        `${fileId}_${i}`,
        javaCompiledDir || cBinDir || cppBinDir || rustBinDir,
        cBinFile || cppBinFile || rustBinFile
      );

      maxTimeMs = Math.max(maxTimeMs, execRes.timeMs);

      if (execRes.timedOut) {
        overallVerdict = 'Time Limit Exceeded';
        logOutput += `\nTest case ${i + 1}: Time Limit Exceeded (>${normalizedLang === 'java' ? TIMEOUT_MS_JAVA : TIMEOUT_MS_DEFAULT}ms)\n`;
        testResults.push({
          testCaseIndex: i + 1,
          isSample: tc.is_sample === 1,
          passed: false,
          input: tc.input,
          userOutput: '',
          expectedOutput: tc.is_sample === 1 ? tc.expected_output : undefined,
          error: 'Time Limit Exceeded: Process terminated after timeout.',
          executionTimeMs: execRes.timeMs,
        });
        break;
      }

      if (execRes.exitCode !== 0 && execRes.stderr) {
        overallVerdict = 'Runtime Error';
        logOutput += `\nTest case ${i + 1} Runtime Error:\n${execRes.stderr}\n`;
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
        expectedOutput: tc.is_sample === 1 ? expected : undefined,
        executionTimeMs: execRes.timeMs,
      });

      if (!passed && evaluateAll) {
        break;
      }
    }
  } finally {
    // Cleanup compiled directories
    if (javaCompiledDir) {
      try { fs.rmSync(javaCompiledDir, { recursive: true, force: true }); } catch {}
    }
    if (cBinDir) {
      try { fs.rmSync(cBinDir, { recursive: true, force: true }); } catch {}
    }
    if (cppBinDir) {
      try { fs.rmSync(cppBinDir, { recursive: true, force: true }); } catch {}
    }
    if (rustBinDir) {
      try { fs.rmSync(rustBinDir, { recursive: true, force: true }); } catch {}
    }
  }

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
