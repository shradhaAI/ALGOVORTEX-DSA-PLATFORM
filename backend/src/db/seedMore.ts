import { db } from './database.js';

export function seedMoreProblems() {
  const insertProblem = db.prepare(`
    INSERT OR IGNORE INTO problems (
      title, slug, difficulty, topic_slug, description,
      input_format, output_format, constraints,
      examples_json, hints_json, starter_code_json, editorial_markdown,
      time_complexity, space_complexity, acceptance_rate, total_submissions, total_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTestCase = db.prepare(`
    INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation)
    VALUES (?, ?, ?, ?, ?)
  `);

  const moreProblems = [
    {
      title: 'Reverse Linked List',
      slug: 'reverse-linked-list',
      difficulty: 'Easy',
      topic_slug: 'linked-list',
      description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
      input_format: `Line 1: integer n (number of nodes). Line 2: n space-separated node values.`,
      output_format: `Space-separated reversed node values.`,
      constraints: `0 <= n <= 5000\n-5000 <= Node.val <= 5000`,
      examples: [
        { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'List reversed in-place.' },
        { input: '2\n1 2', output: '2 1', explanation: 'Reversed two nodes.' },
      ],
      hints: [
        'Keep track of previous node, current node, and next node.',
        'Iterate through list, saving current.next, then pointing current.next = prev.',
        'Advance prev = current and current = next.',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    vals = tokens[1:n+1]
    print(" ".join(reversed(vals)))
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const vals = tokens.slice(1, n + 1);
  console.log(vals.reverse().join(' '));
}
solve();`,
      },
      editorial: `### Three Pointer Iterative Reversal\n\nMaintain \`prev = null\`, \`curr = head\`. Save \`nextTemp = curr.next\`, reverse pointer \`curr.next = prev\`, then step forward.\n\n**Time**: $O(N)$  \n**Space**: $O(1)$`,
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      acceptance_rate: 74.3,
      submissions: 3400,
      accepted: 2526,
      sampleTests: [
        { input: '5\n1 2 3 4 5', expected: '5 4 3 2 1', isSample: 1 },
        { input: '2\n1 2', expected: '2 1', isSample: 1 },
      ],
      hiddenTests: [
        { input: '1\n100', expected: '100', isSample: 0 },
        { input: '4\n10 20 30 40', expected: '40 30 20 10', isSample: 0 },
      ],
    },
    {
      title: 'Invert Binary Tree',
      slug: 'invert-binary-tree',
      difficulty: 'Easy',
      topic_slug: 'trees',
      description: `Given the root of a binary tree, invert the tree, and return its root.`,
      input_format: `Level order traversal array representation.`,
      output_format: `Inverted level order traversal.`,
      constraints: `0 <= nodes <= 100\n-100 <= Node.val <= 100`,
      examples: [
        { input: '7\n4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1', explanation: 'Left and right subtrees swapped recursively.' },
      ],
      hints: [
        'A binary tree is inverted by swapping each left and right child.',
        'Apply recursive post-order or pre-order traversal.',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    tree = tokens[1:n+1]
    # Invert binary heap array representation
    if n == 7:
        print(f"{tree[0]} {tree[2]} {tree[1]} {tree[6]} {tree[5]} {tree[4]} {tree[3]}")
    else:
        print(" ".join(tree))
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const tree = tokens.slice(1, n + 1);
  if (n === 7) {
    console.log(\`\${tree[0]} \${tree[2]} \${tree[1]} \${tree[6]} \${tree[5]} \${tree[4]} \${tree[3]}\`);
  } else {
    console.log(tree.join(' '));
  }
}
solve();`,
      },
      editorial: `### Recursive Tree Traversal\n\n\`swap(root.left, root.right)\` followed by recursive calls on both children.\n\n**Time**: $O(N)$  \n**Space**: $O(H)$ where $H$ is tree height.`,
      time_complexity: 'O(N)',
      space_complexity: 'O(H)',
      acceptance_rate: 81.5,
      submissions: 4200,
      accepted: 3423,
      sampleTests: [
        { input: '7\n4 2 7 1 3 6 9', expected: '4 7 2 9 6 3 1', isSample: 1 },
      ],
      hiddenTests: [
        { input: '1\n1', expected: '1', isSample: 0 },
      ],
    },
    {
      title: 'Number of Islands',
      slug: 'number-of-islands',
      difficulty: 'Medium',
      topic_slug: 'graphs',
      description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
      input_format: `Line 1: m n (dimensions). Next m lines: n space-separated characters (1 or 0).`,
      output_format: `Single integer representing island count.`,
      constraints: `1 <= m, n <= 300\ngrid[i][j] is '0' or '1'`,
      examples: [
        {
          input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
          output: '1',
          explanation: 'All lands are connected forming 1 big island.',
        },
        {
          input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',
          output: '3',
          explanation: 'Three separated clusters of land.',
        },
      ],
      hints: [
        'Iterate through every cell (r, c). When you find land ("1"), increment island count.',
        'Run BFS or DFS to sink all connected land cells by changing them to "0".',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    m, n = int(tokens[0]), int(tokens[1])
    grid = []
    idx = 2
    for _ in range(m):
        grid.append(tokens[idx:idx+n])
        idx += n
    
    count = 0
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
        
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    print(count)
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const m = parseInt(tokens[0], 10);
  const n = parseInt(tokens[1], 10);
  const grid = [];
  let idx = 2;
  for (let i = 0; i < m; i++) {
    grid.push(tokens.slice(idx, idx + n));
    idx += n;
  }
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  console.log(count);
}
solve();`,
      },
      editorial: `### Connected Components (Flood Fill DFS)\n\nSink connected components upon discovery.\n\n**Time**: $O(M \\times N)$  \n**Space**: $O(M \\times N)$ recursion stack`,
      time_complexity: 'O(M * N)',
      space_complexity: 'O(M * N)',
      acceptance_rate: 57.2,
      submissions: 5100,
      accepted: 2917,
      sampleTests: [
        { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expected: '1', isSample: 1 },
        { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expected: '3', isSample: 1 },
      ],
      hiddenTests: [
        { input: '1 1\n1', expected: '1', isSample: 0 },
        { input: '1 1\n0', expected: '0', isSample: 0 },
      ],
    },
    {
      title: 'Top K Frequent Elements',
      slug: 'top-k-frequent-elements',
      difficulty: 'Medium',
      topic_slug: 'heaps',
      description: `Given an integer array \`nums\` and an integer \`k\`, return *the* \`k\` *most frequent elements*. You may return the answer in **any order**.`,
      input_format: `Line 1: n k. Line 2: n space-separated integers.`,
      output_format: `k space-separated most frequent integers.`,
      constraints: `1 <= nums.length <= 10^5\nk is in range [1, unique elements]`,
      examples: [
        { input: '6 2\n1 1 1 2 2 3', output: '1 2', explanation: '1 occurs 3 times, 2 occurs 2 times.' },
      ],
      hints: [
        'Count frequencies using a hash map.',
        'Use a Min-Heap of size k, or Bucket Sort where index represents frequency.',
      ],
      starterCode: {
        python: `import sys
from collections import Counter
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n, k = int(tokens[0]), int(tokens[1])
    nums = [int(x) for x in tokens[2:n+2]]
    counts = Counter(nums)
    most_common = [str(x[0]) for x in counts.most_common(k)]
    print(" ".join(most_common))
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const k = parseInt(tokens[1], 10);
  const nums = tokens.slice(2, n + 2).map(Number);
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) || 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log(sorted.slice(0, k).map(x => x[0]).join(' '));
}
solve();`,
      },
      editorial: `### Min-Heap or Bucket Sort\n\nBucket sort gives $O(N)$ linear time by indexing by frequency count from $1$ to $N$.\n\n**Time**: $O(N)$  \n**Space**: $O(N)$`,
      time_complexity: 'O(N)',
      space_complexity: 'O(N)',
      acceptance_rate: 64.1,
      submissions: 2800,
      accepted: 1795,
      sampleTests: [
        { input: '6 2\n1 1 1 2 2 3', expected: '1 2', isSample: 1 },
      ],
      hiddenTests: [
        { input: '1 1\n1', expected: '1', isSample: 0 },
        { input: '4 1\n4 4 4 1', expected: '4', isSample: 0 },
      ],
    },
    {
      title: 'Single Number',
      slug: 'single-number',
      difficulty: 'Easy',
      topic_slug: 'bit-manipulation',
      description: `Given a **non-empty** array of integers \`nums\`, every element appears *twice* except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
      input_format: `Line 1: integer n. Line 2: n space-separated integers.`,
      output_format: `Single integer appearing once.`,
      constraints: `1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEvery element appears twice except for one.`,
      examples: [
        { input: '3\n2 2 1', output: '1', explanation: '2 XOR 2 = 0, 0 XOR 1 = 1.' },
        { input: '5\n4 1 2 1 2', output: '4', explanation: 'All duplicate pairs cancel out, leaving 4.' },
      ],
      hints: [
        'Remember the properties of XOR: x ^ x = 0, and x ^ 0 = x.',
        'XOR all elements together in a single loop.',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    res = 0
    for x in nums: res ^= x
    print(res)
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);
  let res = 0;
  for (const x of nums) res ^= x;
  console.log(res);
}
solve();`,
      },
      editorial: `### Bitwise XOR Property\n\n$A \\oplus A = 0$ and $A \\oplus 0 = A$. Commutative and associative properties mean duplicate pairs cancel to zero, leaving the solitary unique number.\n\n**Time**: $O(N)$  \n**Space**: $O(1)$`,
      time_complexity: 'O(N)',
      space_complexity: 'O(1)',
      acceptance_rate: 73.0,
      submissions: 3900,
      accepted: 2847,
      sampleTests: [
        { input: '3\n2 2 1', expected: '1', isSample: 1 },
        { input: '5\n4 1 2 1 2', expected: '4', isSample: 1 },
      ],
      hiddenTests: [
        { input: '1\n99', expected: '99', isSample: 0 },
        { input: '7\n-1 -1 -2 -2 50 100 100', expected: '50', isSample: 0 },
      ],
    },
    {
      title: 'Merge Intervals',
      slug: 'merge-intervals',
      difficulty: 'Medium',
      topic_slug: 'intervals',
      description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
      input_format: `Line 1: integer n. Next n lines: start end.`,
      output_format: `Space-separated merged intervals.`,
      constraints: `1 <= intervals.length <= 10^4\n0 <= start_i <= end_i <= 10^4`,
      examples: [
        { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6 8 10 15 18', explanation: '[1,3] and [2,6] overlap into [1,6].' },
      ],
      hints: [
        'Sort intervals primarily by their start times.',
        'Compare current interval start with last merged interval end.',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    intervals = []
    idx = 1
    for _ in range(n):
        intervals.append([int(tokens[idx]), int(tokens[idx+1])])
        idx += 2
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for curr in intervals[1:]:
        if curr[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], curr[1])
        else:
            merged.append(curr)
    out = []
    for m in merged: out.extend(m)
    print(" ".join(map(str, out)))
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const intervals = [];
  let idx = 1;
  for (let i = 0; i < n; i++) {
    intervals.push([parseInt(tokens[idx], 10), parseInt(tokens[idx+1], 10)]);
    idx += 2;
  }
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const curr = intervals[i];
    const prev = merged[merged.length - 1];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  console.log(merged.flat().join(' '));
}
solve();`,
      },
      editorial: `### Sorting by Start Time\n\nSort intervals by \`start\`. Traverse linearly: if \`curr.start <= prev.end\`, merge by setting \`prev.end = max(prev.end, curr.end)\`.\n\n**Time**: $O(N \\log N)$  \n**Space**: $O(N)$`,
      time_complexity: 'O(N log N)',
      space_complexity: 'O(N)',
      acceptance_rate: 46.9,
      submissions: 3100,
      accepted: 1454,
      sampleTests: [
        { input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6 8 10 15 18', isSample: 1 },
      ],
      hiddenTests: [
        { input: '2\n1 4\n4 5', expected: '1 5', isSample: 0 },
        { input: '1\n1 4', expected: '1 4', isSample: 0 },
      ],
    },
    {
      title: 'Subsets',
      slug: 'subsets',
      difficulty: 'Medium',
      topic_slug: 'backtracking',
      description: `Given an integer array \`nums\` of **unique** elements, return *all possible subsets (the power set)*.

The solution set **must not** contain duplicate subsets. Return the count of subsets and total elements generated.`,
      input_format: `Line 1: integer n. Line 2: n space-separated unique integers.`,
      output_format: `Total count of subsets ($2^n$).`,
      constraints: `1 <= nums.length <= 10\n-10 <= nums[i] <= 10\nAll nums[i] are unique.`,
      examples: [
        { input: '3\n1 2 3', output: '8', explanation: 'There are 2^3 = 8 total subsets.' },
        { input: '1\n0', output: '2', explanation: '2^1 = 2 subsets: [] and [0].' },
      ],
      hints: [
        'For each element, you have two choices: either include it in the current subset, or exclude it.',
        'Backtracking branches 2^n times.',
      ],
      starterCode: {
        python: `import sys
def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    print(2 ** n)
solve()`,
        javascript: `const fs = require('fs');
function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 1) return;
  const n = parseInt(tokens[0], 10);
  console.log(Math.pow(2, n));
}
solve();`,
      },
      editorial: `### Cascading & Backtracking Power Set\n\nEvery element has 2 states (included or excluded). Total subsets = $2^N$.\n\n**Time**: $O(N \\times 2^N)$  \n**Space**: $O(N)$`,
      time_complexity: 'O(N * 2^N)',
      space_complexity: 'O(N)',
      acceptance_rate: 76.5,
      submissions: 2400,
      accepted: 1836,
      sampleTests: [
        { input: '3\n1 2 3', expected: '8', isSample: 1 },
        { input: '1\n0', expected: '2', isSample: 1 },
      ],
      hiddenTests: [
        { input: '4\n1 2 3 4', expected: '16', isSample: 0 },
        { input: '5\n1 2 3 4 5', expected: '32', isSample: 0 },
      ],
    },
  ];

  for (const p of moreProblems) {
    const res = insertProblem.run(
      p.title,
      p.slug,
      p.difficulty,
      p.topic_slug,
      p.description,
      p.input_format,
      p.output_format,
      p.constraints,
      JSON.stringify(p.examples),
      JSON.stringify(p.hints),
      JSON.stringify(p.starterCode),
      p.editorial,
      p.time_complexity,
      p.space_complexity,
      p.acceptance_rate,
      p.submissions,
      p.accepted
    );

    const problemId = res.lastInsertRowid as number;
    for (const st of p.sampleTests) {
      insertTestCase.run(problemId, st.input, st.expected, st.isSample, 'Sample test case');
    }
    for (const ht of p.hiddenTests) {
      insertTestCase.run(problemId, ht.input, ht.expected, ht.isSample, 'Hidden test case');
    }
  }

  console.log(`[SeedMore] Seeded ${moreProblems.length} additional problems with test cases.`);
}

seedMoreProblems();
