import {
  User,
  Problem,
  DashboardData,
  ExecutionResult,
  Roadmap,
  LeaderboardEntry,
  Topic,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('algovortex_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An unexpected API error occurred');
  }
  return data;
}

export const api = {
  // Auth
  async login(identifier: string, password: string):Promise<{ success: boolean; token: string; user: User; message: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  async register(formData: any): Promise<{ success: boolean; token: string; user: User; message: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async googleLogin(credential: string): Promise<{ success: boolean; token: string; user: User; message: string }> {
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    return request('/auth/me');
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string }> {
    return request('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Problems
  async getTopics(): Promise<{ success: boolean; topics: Topic[] }> {
    return request('/problems/topics');
  },

  async getProblems(params: {
    search?: string;
    topic?: string;
    difficulty?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; problems: Problem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.topic) q.set('topic', params.topic);
    if (params.difficulty) q.set('difficulty', params.difficulty);
    if (params.status) q.set('status', params.status);
    if (params.page) q.set('page', params.page.toString());
    if (params.limit) q.set('limit', params.limit.toString());
    return request(`/problems?${q.toString()}`);
  },

  async getProblem(slugOrId: string | number): Promise<{ success: boolean; problem: Problem }> {
    return request(`/problems/${slugOrId}`);
  },

  async toggleBookmark(problemId: number): Promise<{ success: boolean; isBookmarked: boolean; message: string }> {
    return request(`/problems/${problemId}/bookmark`, { method: 'POST' });
  },

  async getUserBookmarks(): Promise<{ success: boolean; bookmarks: Problem[] }> {
    return request('/problems/user/bookmarks');
  },

  // Code Execution
  async runCode(problemId: number, language: string, code: string): Promise<{ success: boolean; result: ExecutionResult }> {
    return request('/execute/run', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, code }),
    });
  },

  async submitCode(
    problemId: number,
    language: string,
    code: string
  ): Promise<{ success: boolean; submissionId: number; result: ExecutionResult }> {
    return request('/execute/submit', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, code }),
    });
  },

  // Dashboard
  async getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
    return request('/dashboard');
  },

  // Leaderboard
  async getLeaderboard(): Promise<{ success: boolean; leaderboard: LeaderboardEntry[] }> {
    return request('/leaderboard');
  },

  // Roadmaps
  async getRoadmaps(): Promise<{ success: boolean; roadmaps: Roadmap[] }> {
    return request('/roadmap');
  },

  async getRoadmap(slug: string): Promise<{ success: boolean; roadmap: Roadmap }> {
    return request(`/roadmap/${slug}`);
  },

  // AI Tutor
  async getAiStatus(): Promise<{ success: boolean; ollamaAvailable: boolean; models: string[]; fallbackEngine: string; activeEngine: string }> {
    return request('/ai/status');
  },

  async chatWithTutor(params: {
    problemTitle?: string;
    problemTopic?: string;
    problemDescription?: string;
    currentCode?: string;
    language?: string;
    mode?: 'hint' | 'debug' | 'explain' | 'complexity' | 'chat';
    message: string;
  }): Promise<{ success: boolean; reply: string; provider: string; modelUsed: string; suggestions?: string[] }> {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Admin
  async getAdminStats(): Promise<{ success: boolean; stats: any; recentUsers: User[] }> {
    return request('/admin/stats');
  },

  async createProblem(problemData: any): Promise<{ success: boolean; problemId: number; message: string }> {
    return request('/admin/problems', {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  },

  async deleteProblem(id: number): Promise<{ success: boolean; message: string }> {
    return request(`/admin/problems/${id}`, {
      method: 'DELETE',
    });
  },

  // Password Reset
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
