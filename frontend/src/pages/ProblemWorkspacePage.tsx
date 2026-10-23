import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Problem, ExecutionResult } from '../types';
import {
  Play,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  History,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const ProblemWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints' | 'solution' | 'submissions'>('description');
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [bottomPanelOpen, setBottomPanelOpen] = useState<boolean>(true);

  // AI Tutor Modal
  const [aiTutorOpen, setAiTutorOpen] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<'hint' | 'debug' | 'complexity' | 'explain'>('hint');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadProblem() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProblem(slug);
        setProblem(res.problem);

        // Load starter code
        const starters = res.problem.starterCode || {};
        const initialCode = starters[language] || starters['python'] || starters['javascript'] || '# Write your solution here\n';
        setCode(initialCode);
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  // Update starter code when language changes
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (problem?.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    }
  };

  const handleToggleBookmark = async () => {
    if (!problem || !user) {
      alert('Please log in to bookmark problems.');
      return;
    }
    try {
      const res = await api.toggleBookmark(problem.id);
      setProblem((prev) => (prev ? { ...prev, isBookmarked: res.isBookmarked } : null));
    } catch {
      // Ignored
    }
  };

  // Run Code (Sample Test Cases)
  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setBottomPanelOpen(true);
    setExecutionResult(null);

    try {
      const res = await api.runCode(problem.id, language, code);
      setExecutionResult(res.result);
      if (res.result.verdict === 'Accepted') {
        setSelectedTestCaseIdx(0);
      }
    } catch (err: any) {
      setExecutionResult({
        verdict: 'Runtime Error',
        totalTestCases: 0,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: err.message || 'Execution failed',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (All Test Cases)
  const handleSubmitCode = async () => {
    if (!problem) return;
    if (!user) {
      alert('Please log in to officially submit code.');
      return;
    }
    setIsSubmitting(true);
    setBottomPanelOpen(true);
    setExecutionResult(null);

    try {
      const res = await api.submitCode(problem.id, language, code);
      setExecutionResult(res.result);

      if (res.result.verdict === 'Accepted') {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f97316', '#fbbf24', '#ffffff'],
        });
        setProblem((prev) => (prev ? { ...prev, isSolved: true } : null));
      }
    } catch (err: any) {
      setExecutionResult({
        verdict: 'Runtime Error',
        totalTestCases: 0,
        passedCount: 0,
        executionTimeMs: 0,
        memoryKb: 0,
        testResults: [],
        outputLog: err.message || 'Submission evaluation failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Tutor Query
  const handleAskAi = async (customMode?: 'hint' | 'debug' | 'complexity' | 'explain') => {
    if (!problem) return;
    const mode = customMode || aiMode;
    const userMsg = aiPrompt.trim() || `Help me with ${mode} for ${problem.title}`;

    const newMessages = [...aiChatMessages, { role: 'user' as const, text: userMsg }];
    setAiChatMessages(newMessages);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const res = await api.chatWithTutor({
        problemTitle: problem.title,
        problemTopic: problem.topic_name || problem.topic_slug,
        problemDescription: problem.description,
        currentCode: code,
        language,
        mode,
        message: userMsg,
      });

      setAiChatMessages([...newMessages, { role: 'assistant' as const, text: res.reply }]);
    } catch {
      setAiChatMessages([
        ...newMessages,
        {
          role: 'assistant' as const,
          text: 'Unable to reach the AI Tutor service. Please ensure your backend is active.',
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white">
        <Navbar />
        <div className="flex h-[75vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const sampleCases = problem.sampleTestCases || [];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#07070a] text-gray-200">
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Problem Description, Hints, Solutions, Submissions */}
        <div className="flex w-full flex-col border-r border-orange-500/20 bg-[#0c0c12] lg:w-1/2">
          {/* Top Panel Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#101018] px-4 py-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveLeftTab('description')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeLeftTab === 'description'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('hints')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeLeftTab === 'hints'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Hints ({problem.hints?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('solution')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeLeftTab === 'solution'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Editorial</span>
              </button>

              <button
                onClick={() => setActiveLeftTab('submissions')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeLeftTab === 'submissions'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>Submissions</span>
              </button>
            </div>

            {/* Bookmark & Solved Status */}
            <div className="flex items-center space-x-3 text-xs">
              {problem.isSolved && (
                <span className="flex items-center space-x-1 text-emerald-400 font-semibold font-mono text-[11px]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Solved</span>
                </span>
              )}
              <button
                onClick={handleToggleBookmark}
                className="text-gray-400 hover:text-orange-400 transition-colors"
                title="Bookmark problem"
              >
                {problem.isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-orange-400" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-300">
            {activeLeftTab === 'description' && (
              <div className="space-y-6">
                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="font-brand text-2xl font-bold text-white">
                      {problem.id}. {problem.title}
                    </h1>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                          : 'bg-red-950/60 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center space-x-3 text-xs text-gray-400">
                    <span className="rounded bg-[#161622] px-2 py-0.5 font-medium text-gray-300">
                      {problem.topic_name || problem.topic_slug}
                    </span>
                    <span>Acceptance: {problem.acceptance_rate}%</span>
                    <span>Time: {problem.time_complexity || 'O(N)'}</span>
                    <span>Space: {problem.space_complexity || 'O(1)'}</span>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="leading-relaxed whitespace-pre-line text-gray-200">
                  {problem.description}
                </div>

                {/* Input & Output Format */}
                {problem.input_format && (
                  <div className="rounded-xl border border-white/5 bg-[#12121a] p-4 text-xs">
                    <h4 className="font-bold text-orange-400 uppercase tracking-wider">Input Format</h4>
                    <p className="mt-1 text-gray-300">{problem.input_format}</p>
                    <h4 className="mt-3 font-bold text-orange-400 uppercase tracking-wider">Output Format</h4>
                    <p className="mt-1 text-gray-300">{problem.output_format}</p>
                  </div>
                )}

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                      Examples
                    </h3>
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="rounded-xl border border-white/5 bg-[#12121a] p-4 text-xs font-mono">
                        <div className="text-gray-400 font-bold mb-1">Example {idx + 1}:</div>
                        <div>
                          <span className="text-orange-400 font-semibold">Input:</span> {ex.input}
                        </div>
                        <div className="mt-1">
                          <span className="text-emerald-400 font-semibold">Output:</span> {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="mt-2 text-gray-400 font-sans text-[11px] leading-normal border-t border-white/5 pt-2">
                            <span className="text-gray-300 font-semibold">Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-2">
                    <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="list-disc pl-5 text-xs text-gray-400 space-y-1 font-mono">
                      {problem.constraints.split('\n').map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Hints Tab */}
            {activeLeftTab === 'hints' && (
              <div className="space-y-4">
                <h3 className="font-brand text-base font-bold text-white">Progressive Hints</h3>
                <p className="text-xs text-gray-400">
                  Read hints sequentially to develop algorithmic intuition without spoiling the full solution.
                </p>
                {(problem.hints || []).map((hint, idx) => (
                  <div key={idx} className="rounded-xl border border-orange-500/20 bg-[#12121c] p-4 text-xs">
                    <div className="font-bold text-orange-400 mb-1">Hint {idx + 1}:</div>
                    <div className="text-gray-200 leading-relaxed">{hint}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Editorial Tab */}
            {activeLeftTab === 'solution' && (
              <div className="space-y-4">
                <h3 className="font-brand text-base font-bold text-white">Official Editorial</h3>
                <div className="rounded-xl border border-white/5 bg-[#12121c] p-4 text-xs leading-relaxed whitespace-pre-line text-gray-200">
                  {problem.editorial_markdown || 'Official editorial explanation in progress.'}
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeLeftTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="font-brand text-base font-bold text-white">Your Submission History</h3>
                {(!problem.userSubmissions || problem.userSubmissions.length === 0) ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No submissions recorded yet for this problem.
                  </div>
                ) : (
                  problem.userSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-[#12121c] p-3 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            sub.verdict === 'Accepted' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="font-bold text-white">{sub.verdict}</span>
                        <span className="font-mono text-gray-400 uppercase text-[10px]">
                          {sub.language}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-gray-400">
                        {sub.execution_time_ms}ms &bull; {new Date(sub.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Monaco Editor & Bottom Runner Panel */}
        <div className="flex w-full flex-col bg-[#08080c] lg:w-1/2">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#101018] px-4 py-2">
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#161622] py-1.5 px-3 text-xs font-semibold text-orange-300 focus:border-orange-500 focus:outline-none"
              >
                <optgroup label="── Available ──">
                  <option value="python">Python 3.13</option>
                  <option value="javascript">JavaScript (Node.js 24)</option>
                  <option value="java">Java 24 (JDK)</option>
                </optgroup>
                <optgroup label="── Requires Compiler ──">
                  <option value="cpp">C++ 20 [No Compiler Installed]</option>
                </optgroup>
              </select>

              <button
                onClick={handleResetCode}
                title="Reset to starter template"
                className="flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* AI Tutor Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAiTutorOpen(true)}
                className="flex items-center space-x-1.5 rounded-lg border border-orange-500/40 bg-orange-950/30 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-900/50 transition-colors"
              >
                <Bot className="h-3.5 w-3.5 text-orange-400" />
                <span>AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : language === 'cpp' ? 'cpp' : 'java'}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
                tabSize: 4,
              }}
            />
          </div>

          {/* Bottom Execution & Output Panel */}
          <div className="border-t border-orange-500/20 bg-[#0d0d14]">
            {/* Panel Header & Run Buttons */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
                  className="flex items-center space-x-1 text-xs font-bold text-gray-300 hover:text-white"
                >
                  <span>Test Results & Console</span>
                  {bottomPanelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>

                {executionResult && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                      executionResult.verdict === 'Accepted'
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-950/70 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {executionResult.verdict} ({executionResult.passedCount}/{executionResult.totalTestCases} passed)
                  </span>
                )}
              </div>

              {/* Action Buttons: Run & Submit */}
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-[#181824] px-4 py-1.5 text-xs font-bold text-gray-200 hover:border-orange-500/50 hover:bg-[#202030] disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 text-orange-400" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="glow-btn-fire flex items-center space-x-1.5 rounded-xl px-5 py-1.5 text-xs font-bold text-white shadow-lg disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
                </button>
              </div>
            </div>

            {/* Test Case Details & Output */}
            {bottomPanelOpen && (
              <div className="h-48 overflow-y-auto p-4 text-xs font-mono">
                {/* Test case tabs */}
                <div className="flex space-x-2 border-b border-white/5 pb-2">
                  {sampleCases.map((tc, idx) => {
                    const testResult = executionResult?.testResults?.find(
                      (r) => r.testCaseIndex === idx + 1
                    );

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIdx(idx)}
                        className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-colors ${
                          selectedTestCaseIdx === idx
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-[#14141e] text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>Case {idx + 1}</span>
                        {testResult && (
                          testResult.passed ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-400" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Test Case Inspection */}
                {sampleCases[selectedTestCaseIdx] && (
                  <div className="mt-3 space-y-2 text-[11px]">
                    <div>
                      <div className="text-gray-400 font-bold">Input:</div>
                      <div className="mt-1 rounded bg-[#12121a] p-2 text-gray-200">
                        {sampleCases[selectedTestCaseIdx].input}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-gray-400 font-bold">Expected Output:</div>
                        <div className="mt-1 rounded bg-[#12121a] p-2 text-emerald-400">
                          {sampleCases[selectedTestCaseIdx].expected_output}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 font-bold">Your Output:</div>
                        <div className="mt-1 rounded bg-[#12121a] p-2 text-orange-300">
                          {executionResult?.testResults?.[selectedTestCaseIdx]?.userOutput ||
                            (isRunning ? 'Executing in sandbox...' : 'Run code to see output')}
                        </div>
                      </div>
                    </div>

                    {executionResult?.outputLog && (
                      <div className="mt-2 rounded bg-red-950/40 p-2 text-red-300 border border-red-500/30">
                        <div className="font-bold">Execution Error Log:</div>
                        <div className="mt-1 whitespace-pre-wrap">{executionResult.outputLog}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Floating Drawer / Modal */}
      {aiTutorOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-orange-500/30 bg-[#0d0d14]/95 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-orange-400" />
              <div>
                <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                  AlgoVortex AI Mentor
                </h3>
                <span className="text-[10px] text-gray-400">Pedagogical DSA Tutor</span>
              </div>
            </div>
            <button
              onClick={() => setAiTutorOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>

          {/* Mode Selector Buttons */}
          <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-[#14141e] p-1 text-[11px] font-semibold">
            <button
              onClick={() => {
                setAiMode('hint');
                handleAskAi('hint');
              }}
              className={`rounded-lg py-1.5 transition-colors ${
                aiMode === 'hint' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Hint
            </button>
            <button
              onClick={() => {
                setAiMode('complexity');
                handleAskAi('complexity');
              }}
              className={`rounded-lg py-1.5 transition-colors ${
                aiMode === 'complexity' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Big-O
            </button>
            <button
              onClick={() => {
                setAiMode('debug');
                handleAskAi('debug');
              }}
              className={`rounded-lg py-1.5 transition-colors ${
                aiMode === 'debug' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Debug
            </button>
            <button
              onClick={() => {
                setAiMode('explain');
                handleAskAi('explain');
              }}
              className={`rounded-lg py-1.5 transition-colors ${
                aiMode === 'explain' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Explain
            </button>
          </div>

          {/* Chat Messages */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {aiChatMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                <Bot className="h-10 w-10 text-orange-400/50 mb-2" />
                <p className="font-semibold text-gray-300">How can I assist your DSA grind?</p>
                <p className="mt-1 text-[11px]">
                  Click one of the mode buttons above or type a specific question about your code.
                </p>
              </div>
            ) : (
              aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-3.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-6 bg-orange-600/30 text-white border border-orange-500/40'
                      : 'mr-4 bg-[#14141e] text-gray-200 border border-white/5 whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
            {aiLoading && (
              <div className="flex items-center space-x-2 text-xs text-orange-400">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                <span>AI Tutor is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi();
            }}
            className="mt-4 flex space-x-2"
          >
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask about hints, invariants, or edge cases..."
              className="flex-1 rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="glow-btn-fire rounded-xl px-4 py-2 text-xs font-bold text-white shadow disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
