export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  bio?: string;
  github_username?: string;
  created_at?: string;
  solvedProblemsCount?: number;
}

export interface Topic {
  id: number;
  slug: string;
  name: string;
  icon: string;
  description: string;
  order_index: number;
  problem_count?: number;
}

export interface TestCase {
  id?: number;
  input: string;
  expected_output: string;
  is_sample: number;
  explanation?: string;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic_slug: string;
  topic_name?: string;
  description: string;
  input_format?: string;
  output_format?: string;
  constraints?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  hints?: string[];
  starterCode?: Record<string, string>;
  editorial_markdown?: string;
  time_complexity?: string;
  space_complexity?: string;
  acceptance_rate: number;
  total_submissions: number;
  total_accepted: number;
  isSolved?: boolean;
  is_solved?: number | boolean;
  isBookmarked?: boolean;
  is_bookmarked?: number | boolean;
  sampleTestCases?: TestCase[];
  userSubmissions?: Submission[];
}

export interface Submission {
  id: number;
  user_id?: number;
  problem_id: number;
  code?: string;
  language: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  execution_time_ms: number;
  memory_kb: number;
  test_cases_passed: number;
  total_test_cases: number;
  output_log?: string;
  created_at: string;
  problem_title?: string;
  problem_slug?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface ExecutionResultItem {
  testCaseIndex: number;
  isSample: boolean;
  passed: boolean;
  input: string;
  userOutput: string;
  expectedOutput?: string;
  error?: string;
  executionTimeMs: number;
}

export interface ExecutionResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  totalTestCases: number;
  passedCount: number;
  executionTimeMs: number;
  memoryKb: number;
  testResults: ExecutionResultItem[];
  outputLog?: string;
}

export interface DashboardData {
  stats: {
    totalProblems: number;
    totalSolved: number;
    easy: { total: number; solved: number };
    medium: { total: number; solved: number };
    hard: { total: number; solved: number };
  };
  acceptanceRate: number;
  totalSubmissionsCount: number;
  currentStreak: number;
  longestStreak: number;
  activityHeatmap: Array<{ date: string; count: number }>;
  topicProgress: Array<{
    slug: string;
    name: string;
    icon: string;
    total_problems: number;
    solved_problems: number;
  }>;
  recentSubmissions: Submission[];
  bookmarks: Problem[];
  recommended: Problem[];
}

export interface RoadmapItem {
  step: number;
  title: string;
  topic: string;
  problemSlug?: string;
  isCompleted?: boolean;
  status?: string;
}

export interface Roadmap {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  total_steps: number;
  estimated_hours: number;
  items: RoadmapItem[];
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_solved: number;
  score: number;
}
