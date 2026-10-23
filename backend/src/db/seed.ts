import { db, initDatabase } from './database.js';
import { hashPassword } from '../middleware/auth.js';

export async function seedDatabase() {
  initDatabase();

  console.log('[Seed] Seeding database with initial users, topics, problems, and roadmaps...');

  // 1. Seed Users (Admin & Demo Student)
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (existingUsers.count === 0) {
    const adminPass = await hashPassword('AlgoAdmin@2026');
    const demoPass = await hashPassword('GrindEra@2026');

    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, avatar_url, role, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'admin',
      'admin@algovortex.com',
      adminPass,
      'AlgoVortex Architect',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'admin',
      'Lead Architect & System Engineer at AlgoVortex.'
    );

    insertUser.run(
      'algovortex_coder',
      'demo@algovortex.com',
      demoPass,
      'Alex Vance',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      'user',
      'Grinding LeetCode and preparing for Tier-1 FAANG interviews.'
    );

    console.log('[Seed] Default users created: admin@algovortex.com and demo@algovortex.com');
  }

  // 2. Seed Topics
  const existingTopics = db.prepare('SELECT COUNT(*) as count FROM topics').get() as { count: number };
  if (existingTopics.count === 0) {
    const insertTopic = db.prepare(`
      INSERT INTO topics (slug, name, icon, description, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    const topicsData = [
      ['arrays-hashing', 'Arrays & Hashing', 'Layers', 'Foundational data structures, frequency counting, and hash sets.', 1],
      ['two-pointers', 'Two Pointers', 'ArrowLeftRight', 'Converging or trailing pointers for sorted arrays and palindromes.', 2],
      ['sliding-window', 'Sliding Window', 'Maximize2', 'Subarray and substring problems with dynamic or fixed windows.', 3],
      ['stack', 'Stack & Monotonic Stack', 'Layers', 'LIFO structures, parenthesis balancing, and next greater element.', 4],
      ['binary-search', 'Binary Search', 'Search', 'Divide and conquer on sorted spaces and predicate monotonicity.', 5],
      ['linked-list', 'Linked List', 'Link', 'Node manipulation, pointer rewiring, fast-slow pointer cycle detection.', 6],
      ['trees', 'Trees & BST', 'GitBranch', 'Hierarchical trees, recursion, traversals, and binary search trees.', 7],
      ['heaps', 'Heap & Priority Queue', 'TrendingUp', 'Min/max heaps, top-K frequent elements, and streaming medians.', 8],
      ['backtracking', 'Backtracking', 'RotateCcw', 'Combinatorial search, subsets, permutations, and pruning states.', 9],
      ['graphs', 'Graphs & BFS/DFS', 'Share2', 'Adjacency lists, shortest paths, topological sort, and cycle detection.', 10],
      ['dynamic-programming', 'Dynamic Programming', 'Cpu', 'Optimal substructure, memoization, tabular DP, and knapsack variations.', 11],
      ['greedy', 'Greedy Algorithms', 'Zap', 'Locally optimal choices leading to global solutions, interval scheduling.', 12],
      ['intervals', 'Intervals', 'Calendar', 'Merging, inserting, and finding non-overlapping intervals.', 13],
      ['bit-manipulation', 'Bit Manipulation', 'Binary', 'Binary operators, bitmasks, XOR properties, and two-complement.', 14],
      ['math-geometry', 'Math & Geometry', 'Compass', 'GCD, primes, matrix rotations, and coordinate geometry.', 15],
      ['tries', 'Tries & Prefix Trees', 'FolderTree', 'Efficient string prefix searching, auto-complete, and spell checkers.', 16],
    ];

    for (const t of topicsData) {
      insertTopic.run(t[0], t[1], t[2], t[3], t[4]);
    }
    console.log('[Seed] 16 DSA Topics seeded.');
  }

  // 3. Seed Problems & Test Cases
  const existingProblems = db.prepare('SELECT COUNT(*) as count FROM problems').get() as { count: number };
  if (existingProblems.count === 0) {
    const insertProblem = db.prepare(`
      INSERT INTO problems (
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

    // Problem 1: Two Sum
    const p1 = insertProblem.run(
      'Two Sum',
      'two-sum',
      'Easy',
      'arrays-hashing',
      `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
      `First line contains integer n, followed by n space-separated integers for nums. Next line contains the target integer.`,
      `Print the two indices separated by a space.`,
      `2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.`,
      JSON.stringify([
        {
          input: '4\n2 7 11 15\n9',
          output: '0 1',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          input: '3\n3 2 4\n6',
          output: '1 2',
          explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].',
        },
      ]),
      JSON.stringify([
        'A naive approach checks all pairs in O(N^2) time. Can we do it in a single pass?',
        'As you iterate through the array, what complementary value are you looking for?',
        'Use a hash map to store seen numbers and their indices for O(1) instant lookup.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    target = int(lines[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!input || input.length < 2) return;
  const n = parseInt(input[0], 10);
  const nums = input.slice(1, n + 1).map(Number);
  const target = parseInt(input[n + 1], 10);

  const seen = new Map();
  for (let i = 0; i < n; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      console.log(\`\${seen.get(complement)} \${i}\`);
      return;
    }
    seen.set(nums[i], i);
  }
}

solve();
`,
        java: `// Java starter template
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                System.out.println(map.get(comp) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}`,
        cpp: `// C++ starter template
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << seen[comp] << " " << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`,
      }),
      `### Optimal Hash Map Approach

Instead of a brute-force $O(N^2)$ double loop, we store each visited number along with its index in a hash map.

For each index \`i\` and number \`nums[i]\`:
1. Calculate \`complement = target - nums[i]\`.
2. Check if \`complement\` is present in the hash map.
3. If yes, output \`[map[complement], i]\`.
4. Otherwise, insert \`nums[i] -> i\` into the map.

**Time Complexity**: $O(N)$ — Single pass through the array.
**Space Complexity**: $O(N)$ — In the worst case, we store $N$ elements in the map.`,
      'O(N)',
      'O(N)',
      84.2,
      1420,
      1196
    );

    const p1Id = p1.lastInsertRowid as number;
    // Sample Test Cases
    insertTestCase.run(p1Id, '4\n2 7 11 15\n9', '0 1', 1, 'Standard pair at indices 0 and 1');
    insertTestCase.run(p1Id, '3\n3 2 4\n6', '1 2', 1, 'Target 6 made by nums[1] + nums[2]');
    // Hidden Test Cases
    insertTestCase.run(p1Id, '2\n3 3\n6', '0 1', 0, 'Duplicate values test');
    insertTestCase.run(p1Id, '5\n-3 4 3 90 2\n0', '0 2', 0, 'Negative numbers test');
    insertTestCase.run(p1Id, '6\n10 20 30 40 50 60\n110', '4 5', 0, 'Large indices test');

    // Problem 2: Valid Anagram
    const p2 = insertProblem.run(
      'Valid Anagram',
      'valid-anagram',
      'Easy',
      'arrays-hashing',
      `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
      `Line 1 contains string s. Line 2 contains string t.`,
      `Print "true" or "false".`,
      `1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.`,
      JSON.stringify([
        { input: 'anagram\nnagaram', output: 'true', explanation: 'Both strings have identical character frequencies.' },
        { input: 'rat\ncar', output: 'false', explanation: 'String s has "t" while string t has "c".' },
      ]),
      JSON.stringify([
        'Check lengths first: if s.length !== t.length, they cannot be anagrams.',
        'Count the frequency of each of the 26 characters in string s, then decrement for string t.',
        'If all counts return to zero, the strings are anagrams.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    s, t = lines[0], lines[1]
    if len(s) != len(t):
        print("false")
        return
    
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
    for char in t:
        if char not in count or count[char] == 0:
            print("false")
            return
        count[char] -= 1
    print("true")

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const lines = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (lines.length < 2) return;
  const s = lines[0];
  const t = lines[1];

  if (s.length !== t.length) {
    console.log('false');
    return;
  }

  const map = {};
  for (const c of s) map[c] = (map[c] || 0) + 1;
  for (const c of t) {
    if (!map[c]) {
      console.log('false');
      return;
    }
    map[c]--;
  }
  console.log('true');
}

solve();
`,
      }),
      `### Frequency Counting

1. If \`s.length !== t.length\`, return \`false\`.
2. Maintain a frequency table of size 26 for lowercase English letters.
3. Increment for each character in \`s\`, decrement for each character in \`t\`.
4. If every element is zero, return \`true\`.

**Time Complexity**: $O(N)$ where $N$ is string length.
**Space Complexity**: $O(1)$ since alphabet size is bounded by 26 characters.`,
      'O(N)',
      'O(1)',
      78.6,
      980,
      770
    );

    const p2Id = p2.lastInsertRowid as number;
    insertTestCase.run(p2Id, 'anagram\nnagaram', 'true', 1, 'Basic anagram match');
    insertTestCase.run(p2Id, 'rat\ncar', 'false', 1, 'Mismatched letters');
    insertTestCase.run(p2Id, 'a\na', 'true', 0, 'Single identical character');
    insertTestCase.run(p2Id, 'ab\na', 'false', 0, 'Different lengths');
    insertTestCase.run(p2Id, 'listen\nsilent', 'true', 0, 'Common anagram');

    // Problem 3: Valid Parentheses
    const p3 = insertProblem.run(
      'Valid Parentheses',
      'valid-parentheses',
      'Easy',
      'stack',
      `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
      `Single string s consisting of brackets.`,
      `Print "true" if valid, else "false".`,
      `1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.`,
      JSON.stringify([
        { input: '()[]{}', output: 'true', explanation: 'All brackets match in order.' },
        { input: '(]', output: 'false', explanation: 'Opening "(" closed by mismatched "]".' },
      ]),
      JSON.stringify([
        'Use a stack to remember opening brackets.',
        'When encountering a closing bracket, check if the top of the stack matches its pair.',
        'At the end of iteration, the stack must be empty.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print("true")
        return
    
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                print("false")
                return
            stack.pop()
        else:
            stack.append(ch)
            
    print("true" if len(stack) == 0 else "false")

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const s = fs.readFileSync(0, 'utf8').trim();
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (map[ch]) {
      if (stack.length === 0 || stack[stack.length - 1] !== map[ch]) {
        console.log('false');
        return;
      }
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  console.log(stack.length === 0 ? 'true' : 'false');
}

solve();
`,
      }),
      `### Stack-based Matching

Push opening symbols onto a stack. When a closing symbol appears, verify that the stack is non-empty and the top matches the corresponding pair.

**Time Complexity**: $O(N)$  
**Space Complexity**: $O(N)$ for stack`,
      'O(N)',
      'O(N)',
      75.4,
      1890,
      1425
    );

    const p3Id = p3.lastInsertRowid as number;
    insertTestCase.run(p3Id, '()[]{}', 'true', 1, 'Valid sequence');
    insertTestCase.run(p3Id, '(]', 'false', 1, 'Mismatch');
    insertTestCase.run(p3Id, '({[]})', 'true', 0, 'Nested brackets');
    insertTestCase.run(p3Id, '(', 'false', 0, 'Unclosed opening bracket');
    insertTestCase.run(p3Id, ']', 'false', 0, 'Closing bracket without opening');

    // Problem 4: Binary Search
    const p4 = insertProblem.run(
      'Binary Search',
      'binary-search',
      'Easy',
      'binary-search',
      `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
      `Line 1: integer n. Line 2: n space-separated sorted integers. Line 3: target integer.`,
      `Index of target, or -1 if not found.`,
      `1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll integers in nums are unique and sorted in ascending order.`,
      JSON.stringify([
        { input: '6\n-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
        { input: '6\n-1 0 3 5 9 12\n2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
      ]),
      JSON.stringify([
        'Initialize two pointers: left = 0 and right = n - 1.',
        'Compute mid = left + (right - left) // 2 to avoid potential integer overflow.',
        'If nums[mid] == target, return mid; if nums[mid] < target, left = mid + 1; else right = mid - 1.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    target = int(tokens[n+1])
    
    left, right = 0, n - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            print(mid)
            return
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    print(-1)

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);
  const target = parseInt(tokens[n + 1], 10);

  let left = 0, right = n - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      console.log(mid);
      return;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  console.log(-1);
}

solve();
`,
      }),
      `### Classical Binary Search

Divide search space in half each iteration by comparing the midpoint with target.

**Time Complexity**: $O(\\log N)$  
**Space Complexity**: $O(1)$`,
      'O(log N)',
      'O(1)',
      88.1,
      2100,
      1850
    );

    const p4Id = p4.lastInsertRowid as number;
    insertTestCase.run(p4Id, '6\n-1 0 3 5 9 12\n9', '4', 1, 'Target 9 at index 4');
    insertTestCase.run(p4Id, '6\n-1 0 3 5 9 12\n2', '-1', 1, 'Target 2 not present');
    insertTestCase.run(p4Id, '1\n5\n5', '0', 0, 'Single element match');
    insertTestCase.run(p4Id, '1\n5\n10', '-1', 0, 'Single element miss');
    insertTestCase.run(p4Id, '4\n1 2 3 4\n1', '0', 0, 'First element match');

    // Problem 5: Climbing Stairs
    const p5 = insertProblem.run(
      'Climbing Stairs',
      'climbing-stairs',
      'Easy',
      'dynamic-programming',
      `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
      `Single integer n.`,
      `Total distinct ways.`,
      `1 <= n <= 45`,
      JSON.stringify([
        { input: '2', output: '2', explanation: 'There are two ways: 1 step + 1 step, or 2 steps.' },
        { input: '3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, or 2+1.' },
      ]),
      JSON.stringify([
        'To reach step i, you could have come from step (i - 1) or step (i - 2).',
        'Therefore: ways(i) = ways(i - 1) + ways(i - 2).',
        'This is the Fibonacci sequence! We can compute it in O(N) time with O(1) space.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n <= 2:
        print(n)
        return
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const line = fs.readFileSync(0, 'utf8').trim();
  if (!line) return;
  const n = parseInt(line, 10);
  if (n <= 2) {
    console.log(n);
    return;
  }
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  console.log(b);
}

solve();
`,
      }),
      `### Dynamic Programming (Fibonacci Pattern)

Base cases:
- \`dp[1] = 1\`
- \`dp[2] = 2\`
Recurrence relation: \`dp[i] = dp[i - 1] + dp[i - 2]\`.

**Time Complexity**: $O(N)$  
**Space Complexity**: $O(1)$`,
      'O(N)',
      'O(1)',
      79.2,
      1650,
      1307
    );

    const p5Id = p5.lastInsertRowid as number;
    insertTestCase.run(p5Id, '2', '2', 1, 'n = 2');
    insertTestCase.run(p5Id, '3', '3', 1, 'n = 3');
    insertTestCase.run(p5Id, '4', '5', 0, 'n = 4');
    insertTestCase.run(p5Id, '5', '8', 0, 'n = 5');
    insertTestCase.run(p5Id, '10', '89', 0, 'n = 10');

    // Problem 6: Longest Substring Without Repeating Characters
    const p6 = insertProblem.run(
      'Longest Substring Without Repeating Characters',
      'longest-substring-without-repeating-characters',
      'Medium',
      'sliding-window',
      `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
      `Single string s on line 1.`,
      `Single integer representing the max length.`,
      `0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.`,
      JSON.stringify([
        { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
        { input: 'bbbbb', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      ]),
      JSON.stringify([
        'Use the sliding window technique with two pointers (left and right).',
        'Store the last seen index of each character in a hash map.',
        'When a duplicate is encountered, move the left pointer past the previous occurrence.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    s = sys.stdin.read().rstrip('\\r\\n')
    seen = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        max_len = max(max_len, right - left + 1)
    print(max_len)

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const s = fs.readFileSync(0, 'utf8').replace(/[\\r\\n]+$/, '');
  const seen = new Map();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1;
    }
    seen.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  console.log(maxLen);
}

solve();
`,
      }),
      `### Sliding Window with Index Hash Map

Maintain window \`[left, right]\`. If \`s[right]\` was previously seen within the current window, move \`left = lastSeen[s[right]] + 1\`.

**Time Complexity**: $O(N)$  
**Space Complexity**: $O(\\min(N, M))$ where $M$ is alphabet size.`,
      'O(N)',
      'O(min(N, M))',
      62.4,
      3200,
      1996
    );

    const p6Id = p6.lastInsertRowid as number;
    insertTestCase.run(p6Id, 'abcabcbb', '3', 1, 'Standard repeating cycle');
    insertTestCase.run(p6Id, 'bbbbb', '1', 1, 'All identical characters');
    insertTestCase.run(p6Id, 'pwwkew', '3', 0, 'Substring "wke"');
    insertTestCase.run(p6Id, '', '0', 0, 'Empty string');
    insertTestCase.run(p6Id, 'au', '2', 0, 'Two distinct characters');

    // Problem 7: Container With Most Water
    const p7 = insertProblem.run(
      'Container With Most Water',
      'container-with-most-water',
      'Medium',
      'two-pointers',
      `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
      `Line 1: integer n. Line 2: n space-separated integers for height.`,
      `Maximum area of water.`,
      `n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4`,
      JSON.stringify([
        { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', explanation: 'The max area is between index 1 (height 8) and index 8 (height 7).' },
        { input: '2\n1 1', output: '1', explanation: 'Area between height 1 and height 1 is 1 * 1 = 1.' },
      ]),
      JSON.stringify([
        'Start with the widest container: left = 0 and right = n - 1.',
        'Area = (right - left) * min(height[left], height[right]).',
        'To potentially find a taller container, always move the pointer pointing to the shorter vertical line.',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    h = [int(x) for x in tokens[1:n+1]]
    
    left, right = 0, n - 1
    max_area = 0
    while left < right:
        area = (right - left) * min(h[left], h[right])
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
    print(max_area)

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const h = tokens.slice(1, n + 1).map(Number);

  let left = 0, right = n - 1;
  let maxArea = 0;
  while (left < right) {
    const area = (right - left) * Math.min(h[left], h[right]);
    if (area > maxArea) maxArea = area;
    if (h[left] < h[right]) left++;
    else right--;
  }
  console.log(maxArea);
}

solve();
`,
      }),
      `### Two Pointers Greedy Approach

Width decreases monotonically at each step. Moving the taller line can never yield a larger area because the height is bounded by the shorter line. Hence, we greedily move the pointer at the shorter bar.

**Time Complexity**: $O(N)$  
**Space Complexity**: $O(1)$`,
      'O(N)',
      'O(1)',
      54.8,
      2700,
      1480
    );

    const p7Id = p7.lastInsertRowid as number;
    insertTestCase.run(p7Id, '9\n1 8 6 2 5 4 8 3 7', '49', 1, 'Max area is 49');
    insertTestCase.run(p7Id, '2\n1 1', '1', 1, 'Minimal container');
    insertTestCase.run(p7Id, '4\n4 3 2 1', '4', 0, 'Decreasing heights');
    insertTestCase.run(p7Id, '5\n1 2 1 2 1', '4', 0, 'Symmetric peak');

    // Problem 8: Coin Change
    const p8 = insertProblem.run(
      'Coin Change',
      'coin-change',
      'Medium',
      'dynamic-programming',
      `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
      `Line 1: integer n (number of coins). Line 2: n space-separated coin values. Line 3: target amount.`,
      `Minimum coins needed, or -1.`,
      `1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4`,
      JSON.stringify([
        { input: '3\n1 2 5\n11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins total).' },
        { input: '1\n2\n3', output: '-1', explanation: 'Amount 3 cannot be formed with coin 2.' },
      ]),
      JSON.stringify([
        'Define dp[i] as the minimum coins needed to make amount i.',
        'Initialize dp array of size (amount + 1) filled with infinity, with dp[0] = 0.',
        'For each amount from 1 to amount, and each coin: dp[i] = min(dp[i], dp[i - coin] + 1).',
      ]),
      JSON.stringify({
        python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    coins = [int(x) for x in tokens[1:n+1]]
    amount = int(tokens[n+1])
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0 and dp[i - c] != float('inf'):
                if dp[i - c] + 1 < dp[i]:
                    dp[i] = dp[i - c] + 1
                    
    print(dp[amount] if dp[amount] != float('inf') else -1)

if __name__ == "__main__":
    solve()
`,
        javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const coins = tokens.slice(1, n + 1).map(Number);
  const amount = parseInt(tokens[n + 1], 10);

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0 && dp[i - c] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  console.log(dp[amount] === Infinity ? -1 : dp[amount]);
}

solve();
`,
      }),
      `### Bottom-Up Dynamic Programming (Unbounded Knapsack)

For each value $i \\in [1, \\text{amount}]$, check all available coin denominations $c$:
$$\\text{dp}[i] = \\min(\\text{dp}[i], \\text{dp}[i - c] + 1)$$

**Time Complexity**: $O(N \\times \\text{amount})$  
**Space Complexity**: $O(\\text{amount})$`,
      'O(N * amount)',
      'O(amount)',
      45.3,
      1980,
      897
    );

    const p8Id = p8.lastInsertRowid as number;
    insertTestCase.run(p8Id, '3\n1 2 5\n11', '3', 1, '11 = 5 + 5 + 1');
    insertTestCase.run(p8Id, '1\n2\n3', '-1', 1, 'Impossible amount');
    insertTestCase.run(p8Id, '1\n1\n0', '0', 0, 'Amount 0 requires 0 coins');
    insertTestCase.run(p8Id, '3\n1 5 10\n27', '5', 0, '10 + 10 + 5 + 1 + 1');

    console.log('[Seed] Core DSA Problems & test cases seeded successfully.');
  }

  // 4. Seed Roadmaps
  const existingRoadmaps = db.prepare('SELECT COUNT(*) as count FROM roadmaps').get() as { count: number };
  if (existingRoadmaps.count === 0) {
    const insertRoadmap = db.prepare(`
      INSERT INTO roadmaps (slug, title, description, level, total_steps, estimated_hours, items_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertRoadmap.run(
      'beginner-zero-to-one',
      'Beginner 0 to 1 DSA Mastery',
      'Step-by-step foundational journey starting from programming fundamentals, Big-O notation, to essential arrays, strings, and recursion.',
      'Beginner',
      12,
      40,
      JSON.stringify([
        { step: 1, title: 'Time & Space Complexity (Big-O)', topic: 'Foundations', status: 'completed' },
        { step: 2, title: 'Array Traversal & Frequency Counting', topic: 'arrays-hashing', problemSlug: 'two-sum', status: 'available' },
        { step: 3, title: 'String Manipulation & Anagrams', topic: 'arrays-hashing', problemSlug: 'valid-anagram', status: 'available' },
        { step: 4, title: 'Two Pointers Technique', topic: 'two-pointers', problemSlug: 'container-with-most-water', status: 'available' },
        { step: 5, title: 'Sliding Window Substrings', topic: 'sliding-window', problemSlug: 'longest-substring-without-repeating-characters', status: 'available' },
        { step: 6, title: 'Stack & Monotonic Matching', topic: 'stack', problemSlug: 'valid-parentheses', status: 'available' },
        { step: 7, title: 'Binary Search Monotonicity', topic: 'binary-search', problemSlug: 'binary-search', status: 'available' },
        { step: 8, title: 'Introduction to Dynamic Programming', topic: 'dynamic-programming', problemSlug: 'climbing-stairs', status: 'available' },
      ])
    );

    insertRoadmap.run(
      'sde-sheet-75',
      'AlgoVortex Blind 75 / SDE Sheet',
      'The definitive curated list of the top 75 most frequently asked DSA problems at Google, Amazon, Microsoft, and Meta.',
      'Intermediate',
      75,
      90,
      JSON.stringify([
        { step: 1, title: 'Two Sum', topic: 'arrays-hashing', problemSlug: 'two-sum' },
        { step: 2, title: 'Valid Anagram', topic: 'arrays-hashing', problemSlug: 'valid-anagram' },
        { step: 3, title: 'Valid Parentheses', topic: 'stack', problemSlug: 'valid-parentheses' },
        { step: 4, title: 'Binary Search', topic: 'binary-search', problemSlug: 'binary-search' },
        { step: 5, title: 'Climbing Stairs', topic: 'dynamic-programming', problemSlug: 'climbing-stairs' },
        { step: 6, title: 'Longest Substring Without Repeating Characters', topic: 'sliding-window', problemSlug: 'longest-substring-without-repeating-characters' },
        { step: 7, title: 'Container With Most Water', topic: 'two-pointers', problemSlug: 'container-with-most-water' },
        { step: 8, title: 'Coin Change', topic: 'dynamic-programming', problemSlug: 'coin-change' },
      ])
    );

    insertRoadmap.run(
      'advanced-graph-dp',
      'Advanced Graphs, Trees & Dynamic Programming',
      'Deep dive into Topological Sort, Dijkstra, Segment Trees, Trie prefix trees, and multi-dimensional Dynamic Programming.',
      'Advanced',
      30,
      60,
      JSON.stringify([
        { step: 1, title: 'Coin Change & Knapsack Patterns', topic: 'dynamic-programming', problemSlug: 'coin-change' },
        { step: 2, title: 'Graph Traversal (BFS & DFS)', topic: 'graphs' },
        { step: 3, title: 'Topological Sort & Cycle Detection', topic: 'graphs' },
        { step: 4, title: 'Shortest Path Algorithms (Dijkstra)', topic: 'graphs' },
        { step: 5, title: 'Trie Prefix Trees & Search Autocomplete', topic: 'tries' },
      ])
    );

    console.log('[Seed] 3 Curated Roadmaps seeded.');
  }

  // 5. Seed Contests
  const existingContests = db.prepare('SELECT COUNT(*) as count FROM contests').get() as { count: number };
  if (existingContests.count === 0) {
    const insertContest = db.prepare(`
      INSERT INTO contests (slug, title, description, start_time, end_time, status, problems_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertContest.run(
      'vortex-weekly-42',
      'Vortex Weekly Challenge #42',
      '90-minute live competitive coding arena featuring 4 problems ranging from Easy to Hard. Real-time ranking with penalty time.',
      new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      new Date(Date.now() + 86400000 * 2 + 5400000).toISOString(),
      'upcoming',
      JSON.stringify(['two-sum', 'valid-parentheses', 'longest-substring-without-repeating-characters', 'coin-change'])
    );

    insertContest.run(
      'grinding-era-biweekly-10',
      'Grinding Era Grand Prix #10',
      'High-stakes algorithmic contest designed for senior engineers and competitive coders worldwide.',
      new Date(Date.now() - 86400000 * 5).toISOString(),
      new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
      'ended',
      JSON.stringify(['binary-search', 'container-with-most-water', 'climbing-stairs'])
    );

    console.log('[Seed] Sample Contests seeded.');
  }

  console.log('[Seed] Database initialization and seed completed!');
}
