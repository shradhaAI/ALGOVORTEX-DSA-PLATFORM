export interface TutorRequest {
  problemTitle?: string;
  problemTopic?: string;
  problemDescription?: string;
  currentCode?: string;
  language?: string;
  mode?: 'hint' | 'debug' | 'explain' | 'complexity' | 'chat';
  message: string;
  chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface TutorResponse {
  reply: string;
  provider: 'ollama' | 'smart_dsa_engine';
  modelUsed: string;
  suggestions?: string[];
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

/**
 * Check if local Ollama daemon is reachable
 */
export async function checkOllamaHealth(): Promise<{ available: boolean; models: string[] }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as { models?: Array<{ name: string }> };
      const modelNames = data.models ? data.models.map((m) => m.name) : [];
      return { available: true, models: modelNames };
    }
    return { available: false, models: [] };
  } catch {
    return { available: false, models: [] };
  }
}

/**
 * Fallback Smart DSA Pedagogical Engine
 * Highly tuned for DSA learning without requiring heavy GPU or paid API
 */
function runSmartDsaEngine(req: TutorRequest): TutorResponse {
  const query = req.message.toLowerCase();
  const title = req.problemTitle || 'DSA Problem';
  const topic = req.problemTopic || 'Algorithms';
  const mode = req.mode || 'chat';

  let reply = '';
  const suggestions: string[] = [];

  if (mode === 'hint' || query.includes('hint') || query.includes('clue') || query.includes('how to start')) {
    reply = `### 💡 AlgoVortex Progressive Hint for **${title}** (${topic})

**Step 1: Intuition & Pattern Recognition**
Think about what data structure lets you look up previously seen values in $O(1)$ time. 
* Ask yourself: Can we trade a little bit of auxiliary space ($O(N)$) to avoid nested loops ($O(N^2)$)?

**Step 2: Key Observation**
Instead of checking every possible pair or branch forward, maintain state as you iterate through the input. For each element $x$, what exact value or state are you looking for that satisfies the problem condition?

**Step 3: Edge Cases to Keep in Mind**
- Empty or single-element inputs.
- Duplicates and negative numbers.
- Integer overflow if computing products or large sums.

Try writing down the step-by-step logic in pseudo-code before diving into syntax!`;
    suggestions.push('Can you explain the optimal time complexity?', 'Show me the next hint', 'How do I handle edge cases?');
  } else if (mode === 'complexity' || query.includes('complexity') || query.includes('big o') || query.includes('time') || query.includes('space')) {
    reply = `### ⏱️ Time & Space Complexity Analysis: **${title}**

#### **Optimal Approach**
* **Time Complexity**: **$O(N)$** or **$O(N \\log N)$** depending on whether sorting is needed.
  * In a single-pass hash map or two-pointer scan, each element is visited at most a constant number of times ($O(1)$ amortized operations).
* **Space Complexity**: **$O(N)$** auxiliary space.
  * We allocate memory for the frequency map / stack / memoization table proportional to the unique elements in the input.

#### **Brute Force vs Optimal Comparison**
| Approach | Time | Space | Feasibility for $N = 10^5$ |
| :--- | :--- | :--- | :--- |
| Nested Loops (Brute Force) | $O(N^2)$ | $O(1)$ | ❌ **TLE** (~$10^{10}$ ops) |
| Hash Map / Two Pointers | $O(N)$ | $O(N)$ | ✅ **Accepted** (~$10^5$ ops, < 50ms) |`;
    suggestions.push('Can we optimize space to O(1)?', 'Give me a hint for edge cases', 'Explain line by line');
  } else if (mode === 'debug' || query.includes('debug') || query.includes('wrong') || query.includes('error') || query.includes('fail')) {
    reply = `### 🔍 AlgoVortex Code Debugger

Let's inspect potential pitfalls in your approach for **${title}**:

1. **Loop Termination & Bounds**:
   Ensure your index ranges do not cause an off-by-one error (e.g., \`i < n\` vs \`i <= n\`).
2. **Initial State & Base Cases**:
   Does your base case handle arrays with length 0, 1, or 2 correctly? If using recursion or DP, verify base returns before transitioning.
3. **Data Type & Return Values**:
   Make sure you are returning the expected format (e.g., 0-indexed indices array, boolean, or pointer) as required by the problem specification.
4. **Mutations during Iteration**:
   If modifying a collection or pointers in-place, ensure you don't skip adjacent elements or invalidate pointers.

*Pro tip: Insert print statements or run on the smallest sample test case to trace variables step-by-step.*`;
    suggestions.push('How to optimize this solution?', 'Explain this line by line', 'Give me a test case that might fail');
  } else if (mode === 'explain' || query.includes('explain') || query.includes('how does') || query.includes('walkthrough')) {
    reply = `### 📖 Conceptual Walkthrough: **${title}**

**1. The Core Objective**
The problem asks us to solve for optimal constraints in **${topic}**. The naive way is to test all combinations, but we can do significantly better by identifying invariant properties.

**2. The Invariant**
At any index \`i\`, we have already processed all elements before \`i\`. We only need to ask whether the current element complements our stored history.

**3. State Management**
* Maintain an efficient lookup structure (e.g., Map, Two-Pointers, Priority Queue, or DFS recursion stack).
* Update our answer on-the-fly without backtracking needlessly.`;
    suggestions.push('Can you show a hint without full code?', 'What is the space complexity?', 'What are common interview follow-ups?');
  } else {
    reply = `Hello, Coder! 🦊 I am your **AlgoVortex AI Tutor**.

I'm here to guide you through **${title}** and master **${topic}**.

Here is how I can assist you right now:
- **Progressive Hints**: Get nudges in the right direction without spoiling the solution.
- **Complexity Analysis**: Deep dive into Big-O time and space trade-offs.
- **Debugging Support**: Spot edge cases and logic flaws in your code.
- **Interview Follow-ups**: Prepare for variations asked in Tier-1 tech interviews.

What would you like to explore next?`;
    suggestions.push('Give me a starting hint', 'What is the optimal complexity?', 'Explain the underlying algorithm');
  }

  return {
    reply,
    provider: 'smart_dsa_engine',
    modelUsed: 'AlgoVortex Heuristic DSA Tutor v2.0',
    suggestions,
  };
}

/**
 * Main Tutor handler: queries Ollama if active, or falls back to Smart DSA Engine
 */
export async function queryAiTutor(req: TutorRequest): Promise<TutorResponse> {
  const health = await checkOllamaHealth();

  if (health.available) {
    try {
      const systemPrompt = `You are the AlgoVortex AI Coding Tutor, a friendly, encouraging, expert DSA mentor.
Help the student learn Data Structures and Algorithms deeply.
Problem: ${req.problemTitle || 'DSA Problem'}
Topic: ${req.problemTopic || 'Algorithms'}
Never reveal full code answers directly unless explicitly asked after multiple hints.
Encourage optimal time and space complexity ($O(N)$, $O(\\log N)$).
Use crisp markdown with code snippets where helpful.`;

      const promptText = `${systemPrompt}\n\nStudent question: ${req.message}\n${
        req.currentCode ? `\nStudent's current code:\n\`\`\`${req.language || 'text'}\n${req.currentCode}\n\`\`\`` : ''
      }`;

      const model = health.models.length > 0 ? health.models[0] : DEFAULT_MODEL;

      const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: promptText,
          stream: false,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { response?: string };
        if (data.response) {
          return {
            reply: data.response,
            provider: 'ollama',
            modelUsed: model,
            suggestions: ['Can you give me a hint?', 'What is the space complexity?', 'Can we optimize further?'],
          };
        }
      }
    } catch {
      // Fall through to smart dsa engine
    }
  }

  // Fallback to Smart DSA Pedagogical Engine
  return runSmartDsaEngine(req);
}
