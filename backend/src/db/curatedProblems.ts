export interface ProblemDefinition {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic_slug: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  hints: string[];
  starterCode?: Record<string, string>;
  editorial: string;
  time_complexity: string;
  space_complexity: string;
  acceptance_rate: number;
  submissions: number;
  accepted: number;
  sampleTests: Array<{ input: string; expected: string; isSample: number; explanation?: string }>;
  hiddenTests: Array<{ input: string; expected: string; isSample: number; explanation?: string }>;
}

export const CORE_TOPICS = [
  { slug: 'arrays', name: 'Arrays', icon: 'Layers', description: 'Contiguous memory structures, prefixes, sliding intervals, and in-place transformations.', order_index: 1 },
  { slug: 'strings', name: 'Strings', icon: 'FileText', description: 'Character manipulations, palindromes, anagram patterns, and string parsing.', order_index: 2 },
  { slug: 'hashing', name: 'Hashing', icon: 'Hash', description: 'Constant-time O(1) lookups, frequency maps, set intersections, and rolling hashes.', order_index: 3 },
  { slug: 'two-pointers', name: 'Two Pointers', icon: 'ArrowLeftRight', description: 'Converging or trailing index techniques for sorted arrays, palindromes, and windows.', order_index: 4 },
  { slug: 'recursion', name: 'Recursion', icon: 'RotateCcw', description: 'Divide-and-conquer, recursive mathematical induction, and backtracking state trees.', order_index: 5 },
  { slug: 'stack', name: 'Stack', icon: 'Layers', description: 'Last-In-First-Out (LIFO) structures, parentheses matching, and monotonic stacks.', order_index: 6 },
  { slug: 'queue', name: 'Queue', icon: 'Maximize2', description: 'First-In-First-Out (FIFO) buffers, breadth-first search queues, and circular buffers.', order_index: 7 },
  { slug: 'searching', name: 'Searching', icon: 'Search', description: 'Binary search over sorted arrays, monotonic answer spaces, and 2D matrices.', order_index: 8 },
  { slug: 'sorting', name: 'Sorting', icon: 'ArrowUpDown', description: 'Comparison sorts, quicksort partitioning, merge sort, and frequency counting sorts.', order_index: 9 },
  // Supporting topics
  { slug: 'linked-list', name: 'Linked List', icon: 'Link', description: 'Node references, reversal, slow & fast pointer cycle detection.', order_index: 10 },
  { slug: 'trees', name: 'Trees & BST', icon: 'GitBranch', description: 'Hierarchical node traversal, binary search trees, and subtree invariants.', order_index: 11 },
  { slug: 'graphs', name: 'Graphs', icon: 'Share2', description: 'Adjacency graphs, BFS/DFS, topological orderings, and shortest paths.', order_index: 12 },
  { slug: 'dynamic-programming', name: 'Dynamic Programming', icon: 'Cpu', description: 'Overlapping subproblems, memoization, and optimal substructure transitions.', order_index: 13 },
  { slug: 'sliding-window', name: 'Sliding Window', icon: 'Maximize2', description: 'Dynamic and fixed window problems.', order_index: 14 },
  { slug: 'heaps', name: 'Heap & Priority Queue', icon: 'TrendingUp', description: 'Min/max heaps and priority queues.', order_index: 15 },
  { slug: 'backtracking', name: 'Backtracking', icon: 'RotateCcw', description: 'Combinatorial search and state tree pruning.', order_index: 16 },
  { slug: 'intervals', name: 'Intervals', icon: 'Calendar', description: 'Merging and inserting intervals.', order_index: 17 },
  { slug: 'bit-manipulation', name: 'Bit Manipulation', icon: 'Binary', description: 'Bitwise operations and binary representations.', order_index: 18 },
];

export const CURATED_PROBLEMS: ProblemDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ARRAYS (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic_slug: 'arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

Return the indices separated by a space in any order.`,
    input_format: 'Line 1: integer n (number of elements)\nLine 2: n space-separated integers\nLine 3: target integer',
    output_format: 'Space-separated 0-based indices i and j',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nExactly one valid answer exists.',
    examples: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' },
      { input: '3\n3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6.' },
    ],
    hints: [
      'A brute force solution computes all pairs in O(n^2) time.',
      'Can you use a hash map to look up the complement (target - nums[i]) in O(1) time?',
    ],
    editorial: `### Optimal Hash Map Approach\n\nIterate through \`nums\` while storing each element and its index in a hash map. For each element $x$, check if $(target - x)$ already exists in the map.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 51.2,
    submissions: 14200,
    accepted: 7270,
    sampleTests: [
      { input: '4\n2 7 11 15\n9', expected: '0 1', isSample: 1, explanation: '2 + 7 = 9' },
      { input: '3\n3 2 4\n6', expected: '1 2', isSample: 1, explanation: '2 + 4 = 6' },
    ],
    hiddenTests: [
      { input: '2\n3 3\n6', expected: '0 1', isSample: 0 },
      { input: '5\n1 5 3 7 9\n12', expected: '1 3', isSample: 0 },
    ],
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    topic_slug: 'arrays',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the $i^{\\text{th}}$ day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    input_format: 'Line 1: integer n (number of days)\nLine 2: n space-separated prices',
    output_format: 'Single integer representing maximum achievable profit',
    constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
    examples: [
      { input: '6\n7 1 5 3 6 4', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: '5\n7 6 4 3 1', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' },
    ],
    hints: [
      'Track the minimum price seen so far as you iterate across the days.',
      'At each day, the potential profit is prices[i] - min_price.',
    ],
    editorial: `### Single Pass Tracking Minimum\n\nKeep track of \`minPrice\` and \`maxProfit\`. As you visit each day price $p$, update $\\text{maxProfit} = \\max(\\text{maxProfit}, p - \\text{minPrice})$, then update $\\text{minPrice} = \\min(\\text{minPrice}, p)$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 54.3,
    submissions: 9800,
    accepted: 5320,
    sampleTests: [
      { input: '6\n7 1 5 3 6 4', expected: '5', isSample: 1 },
      { input: '5\n7 6 4 3 1', expected: '0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n2 4', expected: '2', isSample: 0 },
      { input: '4\n1 2 3 4', expected: '3', isSample: 0 },
    ],
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    topic_slug: 'arrays',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    input_format: 'Line 1: integer n (number of elements)\nLine 2: n space-separated integers',
    output_format: '"true" or "false"',
    constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
    examples: [
      { input: '4\n1 2 3 1', output: 'true', explanation: 'Value 1 appears at index 0 and index 3.' },
      { input: '4\n1 2 3 4', output: 'false', explanation: 'All elements are distinct.' },
    ],
    hints: [
      'Can you use a Hash Set to track values you have already visited?',
      'If an element is already in the set, a duplicate is found.',
    ],
    editorial: `### Hash Set Lookup\n\nInsert each element into a hash set. If the element is already present, return \`true\` immediately. If the loop completes without duplicates, return \`false\`.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 61.1,
    submissions: 8700,
    accepted: 5315,
    sampleTests: [
      { input: '4\n1 2 3 1', expected: 'true', isSample: 1 },
      { input: '4\n1 2 3 4', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: '10\n1 1 1 3 3 4 3 2 4 2', expected: 'true', isSample: 0 },
      { input: '1\n99', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    topic_slug: 'arrays',
    description: `Given an integer array \`nums\`, return *an array* \`answer\` *such that* \`answer[i]\` *is equal to the product of all the elements of* \`nums\` *except* \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in $O(n)$ time and **without using the division operation**.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'n space-separated integers representing the answer array',
    constraints: '2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30',
    examples: [
      { input: '4\n1 2 3 4', output: '24 12 8 6', explanation: 'Prefix products * suffix products.' },
      { input: '5\n-1 1 0 -3 3', output: '0 0 9 0 0', explanation: 'Elements around zero multiply to 9.' },
    ],
    hints: [
      'Think about how each answer[i] is the product of all numbers to its left multiplied by all numbers to its right.',
      'Compute prefix products in a first pass, then accumulate suffix products in a backward pass.',
    ],
    editorial: `### Prefix and Suffix Running Product\n\nCreate an output array where \`ans[i]\` contains the product of all elements to the left of index $i$. Then, maintain a running suffix product \`R = 1\` while traversing from right to left, multiplying \`ans[i] *= R\` and updating \`R *= nums[i]\`.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$ auxiliary`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 65.0,
    submissions: 7100,
    accepted: 4615,
    sampleTests: [
      { input: '4\n1 2 3 4', expected: '24 12 8 6', isSample: 1 },
      { input: '5\n-1 1 0 -3 3', expected: '0 0 9 0 0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n5 10', expected: '10 5', isSample: 0 },
      { input: '3\n2 3 5', expected: '15 10 6', isSample: 0 },
    ],
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topic_slug: 'arrays',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Single integer representing the maximum subarray sum',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.' },
      { input: '1\n1', output: '1', explanation: 'Single element subarray.' },
    ],
    hints: [
      "Kadane's algorithm: at each index, decide whether to add nums[i] to the running subarray or start a new subarray at nums[i].",
      'running_sum = max(nums[i], running_sum + nums[i]).',
    ],
    editorial: `### Kadane's Algorithm\n\nMaintain \`currentSum\` and \`maxSum\`. At each step $i$, update $\\text{currentSum} = \\max(\\text{nums}[i], \\text{currentSum} + \\text{nums}[i])$ and $\\text{maxSum} = \\max(\\text{maxSum}, \\text{currentSum})$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 50.4,
    submissions: 11200,
    accepted: 5644,
    sampleTests: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expected: '6', isSample: 1 },
      { input: '1\n1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '5\n5 4 -1 7 8', expected: '23', isSample: 0 },
      { input: '3\n-3 -2 -1', expected: '-1', isSample: 0 },
    ],
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    difficulty: 'Medium',
    topic_slug: 'arrays',
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers\nLine 3: integer k',
    output_format: 'n space-separated integers of the rotated array',
    constraints: '1 <= nums.length <= 10^5\n-2^31 <= nums[i] <= 2^31 - 1\n0 <= k <= 10^5',
    examples: [
      { input: '7\n1 2 3 4 5 6 7\n3', output: '5 6 7 1 2 3 4', explanation: 'Rotated 3 steps to the right.' },
      { input: '4\n-1 -100 3 99\n2', output: '3 99 -1 -100', explanation: 'Rotated 2 steps to the right.' },
    ],
    hints: [
      'The rotation k can be simplified to k % n.',
      'Can you reverse the entire array, then reverse the first k elements, then reverse the remaining n - k elements?',
    ],
    editorial: `### Three Reversals Algorithm\n\n1. Reverse the entire array.\n2. Reverse the first $k$ elements.\n3. Reverse the remaining $n - k$ elements.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$ in-place`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 39.9,
    submissions: 6500,
    accepted: 2593,
    sampleTests: [
      { input: '7\n1 2 3 4 5 6 7\n3', expected: '5 6 7 1 2 3 4', isSample: 1 },
      { input: '4\n-1 -100 3 99\n2', expected: '3 99 -1 -100', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n1 2\n3', expected: '2 1', isSample: 0 },
      { input: '5\n1 2 3 4 5\n0', expected: '1 2 3 4 5', isSample: 0 },
    ],
  },
  {
    title: 'Merge Sorted Array',
    slug: 'merge-sorted-array',
    difficulty: 'Easy',
    topic_slug: 'arrays',
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in **non-decreasing order**, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in **non-decreasing order**. Print all $m + n$ merged elements separated by space.`,
    input_format: 'Line 1: integers m and n\nLine 2: m space-separated integers for nums1\nLine 3: n space-separated integers for nums2',
    output_format: 'm+n space-separated sorted integers',
    constraints: '0 <= m, n <= 200\n1 <= m + n <= 200\n-10^9 <= nums1[i], nums2[j] <= 10^9',
    examples: [
      { input: '3 3\n1 2 3\n2 5 6', output: '1 2 2 3 5 6', explanation: 'Merged arrays: [1,2,2,3,5,6].' },
      { input: '1 0\n1\n', output: '1', explanation: 'nums2 is empty.' },
    ],
    hints: [
      'Since both arrays are already sorted, you can compare elements from the end to place the largest items first without overwriting.',
    ],
    editorial: `### Three Pointers from Back\n\nStart pointer $p_1 = m - 1$, $p_2 = n - 1$, and $p = m + n - 1$. Compare $\\text{nums1}[p_1]$ and $\\text{nums2}[p_2]$, writing the larger value into index $p$ and decrementing.\n\n**Time Complexity**: $O(M + N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(M + N)',
    space_complexity: 'O(1)',
    acceptance_rate: 48.0,
    submissions: 8200,
    accepted: 3936,
    sampleTests: [
      { input: '3 3\n1 2 3\n2 5 6', expected: '1 2 2 3 5 6', isSample: 1 },
      { input: '1 0\n1\n', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '0 1\n\n1', expected: '1', isSample: 0 },
      { input: '2 2\n4 5\n1 2', expected: '1 2 4 5', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STRINGS (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    topic_slug: 'strings',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    input_format: 'Line 1: string s\nLine 2: string t',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
    examples: [
      { input: 'anagram\nnagaram', output: 'true', explanation: 'Both strings contain the same character counts.' },
      { input: 'rat\ncar', output: 'false', explanation: 'Character frequencies do not match.' },
    ],
    hints: [
      'If string lengths differ, they cannot be anagrams.',
      'Count the frequency of each letter in both strings and verify equality.',
    ],
    editorial: `### Character Frequency Array\n\nCreate a frequency array of size 26. Increment counts for $s$ and decrement for $t$. If all 26 indices are 0, the strings are anagrams.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$ (26 alphabet characters)`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 63.8,
    submissions: 9400,
    accepted: 5997,
    sampleTests: [
      { input: 'anagram\nnagaram', expected: 'true', isSample: 1 },
      { input: 'rat\ncar', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'a\na', expected: 'true', isSample: 0 },
      { input: 'ab\na', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topic_slug: 'strings',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.`,
    input_format: 'Single line containing string s',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
    examples: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 'race a car', output: 'false', explanation: '"raceacar" is not a palindrome.' },
    ],
    hints: [
      'Use two pointers starting at the beginning and end of the string.',
      'Skip non-alphanumeric characters and compare lowercase versions.',
    ],
    editorial: `### Two Pointers Skipping Symbols\n\nInitialize $i = 0$ and $j = s.\\text{length} - 1$. Move $i$ right and $j$ left skipping non-alphanumeric characters. Compare $\\text{lower}(s[i])$ and $\\text{lower}(s[j])$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 46.5,
    submissions: 8300,
    accepted: 3859,
    sampleTests: [
      { input: 'A man, a plan, a canal: Panama', expected: 'true', isSample: 1 },
      { input: 'race a car', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: ' ', expected: 'true', isSample: 0 },
      { input: '0P', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    topic_slug: 'strings',
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.`,
    input_format: 'Line 1: integer n (number of words)\nLine 2: n space-separated strings',
    output_format: 'String representing longest common prefix (or empty line if none)',
    constraints: '1 <= n <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lowercase English letters.',
    examples: [
      { input: '3\nflower flow flight', output: 'fl', explanation: 'The longest common prefix is "fl".' },
      { input: '3\ndog racecar car', output: '""', explanation: 'There is no common prefix among the input strings.' },
    ],
    hints: [
      'Compare characters column by column across all strings.',
      'Stop as soon as characters differ or any string ends.',
    ],
    editorial: `### Vertical Scanning\n\nScan character by character across index $i$. If $i$ reaches the length of any string or $s_j[i] \\neq s_0[i]$, return $s_0[0..i-1]$.\n\n**Time Complexity**: $O(S)$ where $S$ is sum of all characters  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(S)',
    space_complexity: 'O(1)',
    acceptance_rate: 42.1,
    submissions: 6800,
    accepted: 2862,
    sampleTests: [
      { input: '3\nflower flow flight', expected: 'fl', isSample: 1 },
      { input: '3\ndog racecar car', expected: '""', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\napple apricot', expected: 'ap', isSample: 0 },
      { input: '1\ninterstellar', expected: 'interstellar', isSample: 0 },
    ],
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    topic_slug: 'strings',
    description: `Write a function that reverses a string. Print the reversed string.`,
    input_format: 'Single line containing string s',
    output_format: 'Reversed string',
    constraints: '1 <= s.length <= 10^5\ns consists of printable ASCII characters.',
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'Reversed characters.' },
      { input: 'Hannah', output: 'hannaH', explanation: 'Case is preserved in reverse order.' },
    ],
    hints: [
      'Two pointers swapping characters from ends inwards.',
    ],
    editorial: `### In-Place Two Pointers Reversal\n\nSwap $s[l]$ and $s[r]$ while incrementing $l$ and decrementing $r$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 77.8,
    submissions: 5100,
    accepted: 3967,
    sampleTests: [
      { input: 'hello', expected: 'olleh', isSample: 1 },
      { input: 'Hannah', expected: 'hannaH', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'AlgoVortex', expected: 'xetroVoglA', isSample: 0 },
      { input: 'a', expected: 'a', isSample: 0 },
    ],
  },
  {
    title: 'String to Integer (atoi)',
    slug: 'string-to-integer-atoi',
    difficulty: 'Medium',
    topic_slug: 'strings',
    description: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.

The algorithm for \`myAtoi(string s)\` is as follows:
1. Whitespace: Ignore any leading whitespace (\`" "\`).
2. Signedness: Determine the sign by checking if the next character is \`'-'\` or \`'+'\`, assuming positivity if neither is present.
3. Conversion: Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.
4. Rounding: If the integer is out of the 32-bit signed integer range $[-2^{31}, 2^{31} - 1]$, then clamp the integer so that it remains in the range.`,
    input_format: 'Single line containing string s',
    output_format: 'Converted 32-bit integer',
    constraints: '0 <= s.length <= 200\ns consists of English letters, digits, " ", "+", "-", and ".".',
    examples: [
      { input: '   -42', output: '-42', explanation: 'Leading spaces stripped, negative sign applied.' },
      { input: '4193 with words', output: '4193', explanation: 'Conversion stops at first non-digit character.' },
    ],
    hints: [
      'Process character by character: handle spaces, optional sign, and digits.',
      'Check for overflow at each multiplication step: value > (INT_MAX - digit) / 10.',
    ],
    editorial: `### Deterministic State Machine Parsing\n\nStrip leading spaces, parse optional sign, and accumulate digits checking against $2^{31}-1$ and $-2^{31}$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 17.2,
    submissions: 8500,
    accepted: 1462,
    sampleTests: [
      { input: '   -42', expected: '-42', isSample: 1 },
      { input: '4193 with words', expected: '4193', isSample: 1 },
    ],
    hiddenTests: [
      { input: '-91283472332', expected: '-2147483648', isSample: 0 },
      { input: 'words and 987', expected: '0', isSample: 0 },
    ],
  },
  {
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    topic_slug: 'strings',
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    input_format: 'Single line string s',
    output_format: 'Longest palindromic substring string',
    constraints: '1 <= s.length <= 1000\ns consist of only digits and English letters.',
    examples: [
      { input: 'babad', output: 'bab', explanation: '"aba" is also a valid answer.' },
      { input: 'cbbd', output: 'bb', explanation: 'The longest palindrome is "bb".' },
    ],
    hints: [
      'Every palindrome has a center: either a single character or between two identical characters.',
      'There are 2n - 1 possible centers. Expand outwards from each center.',
    ],
    editorial: `### Expand Around Center\n\nFor each index $i$, expand around $(i, i)$ (odd length) and $(i, i + 1)$ (even length) while characters match.\n\n**Time Complexity**: $O(N^2)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N^2)',
    space_complexity: 'O(1)',
    acceptance_rate: 33.4,
    submissions: 7900,
    accepted: 2638,
    sampleTests: [
      { input: 'babad', expected: 'bab', isSample: 1 },
      { input: 'cbbd', expected: 'bb', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'a', expected: 'a', isSample: 0 },
      { input: 'racecar', expected: 'racecar', isSample: 0 },
    ],
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'Medium',
    topic_slug: 'strings',
    description: `Given an array of strings \`strs\`, group the **anagrams** together. Return the **total number of distinct anagram groups**.`,
    input_format: 'Line 1: integer n (number of words)\nLine 2: n space-separated words',
    output_format: 'Single integer representing the number of anagram groups',
    constraints: '1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\nstrs[i] consists of lowercase English letters.',
    examples: [
      { input: '6\neat tea tan ate nat bat', output: '3', explanation: 'Groups: ["bat"], ["nat","tan"], ["ate","eat","tea"] -> 3 groups.' },
      { input: '1\na', output: '1', explanation: 'Single word is 1 group.' },
    ],
    hints: [
      'Anagrams have the same sorted characters as their canonical key.',
      'Use a Hash Map mapping sorted(string) -> list of strings. The count of groups is map.size.',
    ],
    editorial: `### Categorize by Sorted Key\n\nSort each string to form a canonical key, mapping to a hash table. Return the number of unique keys in the table.\n\n**Time Complexity**: $O(N \\cdot K \\log K)$ where $K$ is max word length  \n**Space Complexity**: $O(N \\cdot K)$`,
    time_complexity: 'O(N * K log K)',
    space_complexity: 'O(N * K)',
    acceptance_rate: 67.2,
    submissions: 6300,
    accepted: 4233,
    sampleTests: [
      { input: '6\neat tea tan ate nat bat', expected: '3', isSample: 1 },
      { input: '1\na', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\nhello world', expected: '2', isSample: 0 },
      { input: '4\nab ba abc cba', expected: '2', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. HASHING (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'First Unique Character in a String',
    slug: 'first-unique-character',
    difficulty: 'Easy',
    topic_slug: 'hashing',
    description: `Given a string \`s\`, find the first non-repeating character in it and return its index. If it does not exist, return \`-1\`.`,
    input_format: 'Single line string s',
    output_format: '0-based integer index or -1',
    constraints: '1 <= s.length <= 10^5\ns consists of only lowercase English letters.',
    examples: [
      { input: 'leetcode', output: '0', explanation: 'Character "l" appears once and is first.' },
      { input: 'loveleetcode', output: '2', explanation: 'Character "v" at index 2 is first non-repeating.' },
    ],
    hints: [
      'In a first pass, count character frequencies using a hash map or array of size 26.',
      'In a second pass, return the first index whose frequency equals 1.',
    ],
    editorial: `### Two Pass Frequency Counting\n\nCount frequency of each character in an array of size 26. In the second pass, find the first $i$ where $\\text{count}[s[i]] == 1$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 60.5,
    submissions: 7800,
    accepted: 4719,
    sampleTests: [
      { input: 'leetcode', expected: '0', isSample: 1 },
      { input: 'loveleetcode', expected: '2', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'aabb', expected: '-1', isSample: 0 },
      { input: 'z', expected: '0', isSample: 0 },
    ],
  },
  {
    title: 'Intersection of Two Arrays',
    slug: 'intersection-of-two-arrays',
    difficulty: 'Easy',
    topic_slug: 'hashing',
    description: `Given two integer arrays \`nums1\` and \`nums2\`, return an array of their **intersection**. Each element in the result must be **unique** and you may return the result in **sorted ascending order**.`,
    input_format: 'Line 1: integers n and m\nLine 2: n space-separated integers\nLine 3: m space-separated integers',
    output_format: 'Space-separated sorted unique common elements',
    constraints: '1 <= nums1.length, nums2.length <= 1000\n0 <= nums1[i], nums2[i] <= 1000',
    examples: [
      { input: '4 2\n1 2 2 1\n2 2', output: '2', explanation: '2 is the only common unique element.' },
      { input: '3 5\n4 9 5\n9 4 9 8 4', output: '4 9', explanation: 'Common unique elements are 4 and 9.' },
    ],
    hints: [
      'Store all elements of nums1 in a Hash Set.',
      'Iterate through nums2 and add to a result set if present in nums1 set.',
    ],
    editorial: `### Hash Set Lookup\n\nConvert \`nums1\` to a set. Check each item in \`nums2\` against the set, adding matches to an intersection set, then sort.\n\n**Time Complexity**: $O(N + M)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N + M)',
    space_complexity: 'O(N)',
    acceptance_rate: 72.4,
    submissions: 5900,
    accepted: 4271,
    sampleTests: [
      { input: '4 2\n1 2 2 1\n2 2', expected: '2', isSample: 1 },
      { input: '3 5\n4 9 5\n9 4 9 8 4', expected: '4 9', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2 2\n1 3\n2 4', expected: '', isSample: 0 },
      { input: '3 3\n1 2 3\n3 2 1', expected: '1 2 3', isSample: 0 },
    ],
  },
  {
    title: 'Ransom Note',
    slug: 'ransom-note',
    difficulty: 'Easy',
    topic_slug: 'hashing',
    description: `Given two strings \`ransomNote\` and \`magazine\`, return \`true\` if \`ransomNote\` can be constructed by using the letters from \`magazine\` and \`false\` otherwise.

Each letter in \`magazine\` can only be used once in \`ransomNote\`.`,
    input_format: 'Line 1: string ransomNote\nLine 2: string magazine',
    output_format: '"true" or "false"',
    constraints: '1 <= ransomNote.length, magazine.length <= 10^5\nransomNote and magazine consist of lowercase English letters.',
    examples: [
      { input: 'aa\naab', output: 'true', explanation: 'magazine has two "a"s, sufficient for ransom note.' },
      { input: 'a\nb', output: 'false', explanation: 'magazine has no "a".' },
    ],
    hints: [
      'Count frequency of each character available in magazine.',
      'Check if magazine has enough of each character required by ransomNote.',
    ],
    editorial: `### Hash Map Frequency Decrement\n\nBuild count table of magazine letters. Subtract for each letter in ransomNote; if any count becomes negative, return \`false\`.\n\n**Time Complexity**: $O(N + M)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N + M)',
    space_complexity: 'O(1)',
    acceptance_rate: 61.3,
    submissions: 6800,
    accepted: 4168,
    sampleTests: [
      { input: 'aa\naab', expected: 'true', isSample: 1 },
      { input: 'a\nb', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'aa\nab', expected: 'false', isSample: 0 },
      { input: 'bg\nefbfg', expected: 'true', isSample: 0 },
    ],
  },
  {
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    topic_slug: 'hashing',
    description: `Given an array of integers \`nums\` and an integer \`k\`, return *the total number of subarrays whose sum equals to* \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers\nLine 3: integer k',
    output_format: 'Total count integer',
    constraints: '1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7',
    examples: [
      { input: '3\n1 1 1\n2', output: '2', explanation: 'Subarrays [1, 1] at indices [0, 1] and [1, 2].' },
      { input: '3\n1 2 3\n3', output: '2', explanation: 'Subarrays [1, 2] and [3].' },
    ],
    hints: [
      'Let prefixSum[i] be sum of elements up to i.',
      'A subarray from j to i sums to k if prefixSum[i] - prefixSum[j-1] == k.',
      'Use a hash map to store frequencies of prefix sums seen so far.',
    ],
    editorial: `### Prefix Sum + Hash Map\n\nMaintain running sum $S$. At each index, add $\\text{map}[S - k]$ to count, then increment $\\text{map}[S]$. Initialize $\\text{map}[0] = 1$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 43.8,
    submissions: 7200,
    accepted: 3153,
    sampleTests: [
      { input: '3\n1 1 1\n2', expected: '2', isSample: 1 },
      { input: '3\n1 2 3\n3', expected: '2', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4\n1 -1 0 0\n0', expected: '5', isSample: 0 },
      { input: '2\n3 4\n5', expected: '0', isSample: 0 },
    ],
  },
  {
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    difficulty: 'Medium',
    topic_slug: 'hashing',
    description: `Given an unsorted array of integers \`nums\`, return *the length of the longest consecutive elements sequence.*

You must write an algorithm that runs in $O(n)$ time.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Integer representing longest consecutive sequence length',
    constraints: '0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
    examples: [
      { input: '6\n100 4 200 1 3 2', output: '4', explanation: 'Longest sequence is [1, 2, 3, 4] with length 4.' },
      { input: '10\n0 3 7 2 5 8 4 6 0 1', output: '9', explanation: 'Longest sequence is 0 through 8 with length 9.' },
    ],
    hints: [
      'Insert all numbers into a Hash Set.',
      'Only start counting consecutive streaks from numbers x where x - 1 is NOT in the set (sequence starts).',
    ],
    editorial: `### Hash Set Streak Exploration\n\nAdd all elements to a hash set. For each element $x$, if $x - 1 \\notin \\text{set}$, count length $x, x+1, x+2...$ while in set. Every element is visited at most twice.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 47.9,
    submissions: 6400,
    accepted: 3065,
    sampleTests: [
      { input: '6\n100 4 200 1 3 2', expected: '4', isSample: 1 },
      { input: '10\n0 3 7 2 5 8 4 6 0 1', expected: '9', isSample: 1 },
    ],
    hiddenTests: [
      { input: '0\n', expected: '0', isSample: 0 },
      { input: '3\n1 2 0', expected: '3', isSample: 0 },
    ],
  },
  {
    title: 'Isomorphic Strings',
    slug: 'isomorphic-strings',
    difficulty: 'Easy',
    topic_slug: 'hashing',
    description: `Given two strings \`s\` and \`t\`, determine if they are **isomorphic**.

Two strings \`s\` and \`t\` are isomorphic if the characters in \`s\` can be replaced to get \`t\`.

All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.`,
    input_format: 'Line 1: string s\nLine 2: string t',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length <= 5 * 10^4\nt.length == s.length\ns and t consist of any valid ascii character.',
    examples: [
      { input: 'egg\nadd', output: 'true', explanation: 'e -> a, g -> d.' },
      { input: 'foo\nbar', output: 'false', explanation: 'o cannot map to both a and r.' },
    ],
    hints: [
      'Maintain two maps: one for mapping s -> t and one for t -> s to enforce bijection.',
    ],
    editorial: `### Bijective Character Mapping\n\nEnsure a 1-to-1 bijection using two maps $M_{st}$ and $M_{ts}$. Check consistency at each character.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 44.5,
    submissions: 5600,
    accepted: 2492,
    sampleTests: [
      { input: 'egg\nadd', expected: 'true', isSample: 1 },
      { input: 'foo\nbar', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'paper\ntitle', expected: 'true', isSample: 0 },
      { input: 'badc\nbaba', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Word Pattern',
    slug: 'word-pattern',
    difficulty: 'Easy',
    topic_slug: 'hashing',
    description: `Given a \`pattern\` and a string \`s\`, find if \`s\` follows the same pattern.

Here **follow** means a full match, such that there is a bijection between a letter in \`pattern\` and a **non-empty** word in \`s\`.`,
    input_format: 'Line 1: pattern string\nLine 2: space-separated words string s',
    output_format: '"true" or "false"',
    constraints: '1 <= pattern.length <= 300\n1 <= s.length <= 3000\npattern contains only lowercase letters.',
    examples: [
      { input: 'abba\ndog cat cat dog', output: 'true', explanation: 'a maps to dog, b maps to cat.' },
      { input: 'abba\ndog cat cat fish', output: 'false', explanation: 'Pattern fails at last word.' },
    ],
    hints: [
      'Split s into words and verify word count equals pattern length.',
      'Check bijection between pattern character and word.',
    ],
    editorial: `### Word Bijection Map\n\nMap pattern characters to words and words to pattern characters. Any inconsistency returns false.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 41.9,
    submissions: 5100,
    accepted: 2136,
    sampleTests: [
      { input: 'abba\ndog cat cat dog', expected: 'true', isSample: 1 },
      { input: 'abba\ndog cat cat fish', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'aaaa\ndog cat cat dog', expected: 'false', isSample: 0 },
      { input: 'abba\ndog dog dog dog', expected: 'false', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. TWO POINTERS (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topic_slug: 'two-pointers',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the $i^{\\text{th}}$ line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated heights',
    output_format: 'Single integer representing max capacity',
    constraints: '2 <= n <= 10^5\n0 <= height[i] <= 10^4',
    examples: [
      { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', explanation: 'Lines at index 1 and 8 hold 7 * min(8, 7) = 49 units.' },
      { input: '2\n1 1', output: '1', explanation: '1 * 1 = 1 unit.' },
    ],
    hints: [
      'Start with the widest container: one pointer at the start and one at the end.',
      'The area is limited by the shorter line. Move the pointer of the shorter line inward.',
    ],
    editorial: `### Greedy Two Pointers\n\nInitialize $l = 0, r = n - 1$. Calculate area $(r - l) \\cdot \\min(h[l], h[r])$. To find a larger area, move the pointer pointing to the shorter vertical bar.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 54.8,
    submissions: 8100,
    accepted: 4438,
    sampleTests: [
      { input: '9\n1 8 6 2 5 4 8 3 7', expected: '49', isSample: 1 },
      { input: '2\n1 1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4\n4 3 2 1', expected: '4', isSample: 0 },
      { input: '5\n1 2 1 2 1', expected: '4', isSample: 0 },
    ],
  },
  {
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii',
    difficulty: 'Medium',
    topic_slug: 'two-pointers',
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

Your solution must use only constant $O(1)$ extra space.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated sorted integers\nLine 3: target integer',
    output_format: 'Space-separated 1-based indices',
    constraints: '2 <= numbers.length <= 3 * 10^4\n-1000 <= numbers[i] <= 1000\nnumbers is sorted in non-decreasing order.\n-1000 <= target <= 1000\nExactly one solution exists.',
    examples: [
      { input: '4\n2 7 11 15\n9', output: '1 2', explanation: '2 + 7 = 9. 1-indexed indices are 1 and 2.' },
      { input: '3\n2 3 4\n6', output: '1 3', explanation: '2 + 4 = 6. 1-indexed indices are 1 and 3.' },
    ],
    hints: [
      'Since the array is sorted, sum = numbers[left] + numbers[right].',
      'If sum < target, left++ to increase sum. If sum > target, right-- to decrease sum.',
    ],
    editorial: `### Converging Two Pointers\n\nStart with $l = 0$ and $r = n - 1$. Adjust pointers based on comparison between $\\text{nums}[l] + \\text{nums}[r]$ and target.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 61.2,
    submissions: 6700,
    accepted: 4100,
    sampleTests: [
      { input: '4\n2 7 11 15\n9', expected: '1 2', isSample: 1 },
      { input: '3\n2 3 4\n6', expected: '1 3', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n-1 0\n-1', expected: '1 2', isSample: 0 },
      { input: '4\n1 2 3 9\n5', expected: '2 3', isSample: 0 },
    ],
  },
  {
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topic_slug: 'two-pointers',
    description: `Given an integer array \`nums\`, return the **total count of unique triplets** \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Total count integer of unique zero-sum triplets',
    constraints: '3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5',
    examples: [
      { input: '6\n-1 0 1 2 -1 -4', output: '2', explanation: 'Unique triplets: [-1, -1, 2] and [-1, 0, 1]. Count = 2.' },
      { input: '3\n0 1 1', output: '0', explanation: 'No zero sum triplet.' },
    ],
    hints: [
      'Sort the array first.',
      'Fix the first element nums[i], then use two pointers on the remaining sorted subsegment.',
      'Skip duplicate values to avoid counting identical triplets.',
    ],
    editorial: `### Sort and Two Pointers\n\nSort array in $O(N \\log N)$. For each $i$, run two pointers $l, r$ looking for $\\text{nums}[l] + \\text{nums}[r] = -\\text{nums}[i]$, skipping duplicates.\n\n**Time Complexity**: $O(N^2)$  \n**Space Complexity**: $O(1)$ auxiliary`,
    time_complexity: 'O(N^2)',
    space_complexity: 'O(1)',
    acceptance_rate: 34.2,
    submissions: 9200,
    accepted: 3146,
    sampleTests: [
      { input: '6\n-1 0 1 2 -1 -4', expected: '2', isSample: 1 },
      { input: '3\n0 1 1', expected: '0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\n0 0 0', expected: '1', isSample: 0 },
      { input: '4\n-2 0 1 1', expected: '1', isSample: 0 },
    ],
  },
  {
    title: 'Move Zeroes',
    slug: 'move-zeroes',
    difficulty: 'Easy',
    topic_slug: 'two-pointers',
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Space-separated integers after moving zeroes',
    constraints: '1 <= nums.length <= 10^4\n-2^31 <= nums[i] <= 2^31 - 1',
    examples: [
      { input: '5\n0 1 0 3 12', output: '1 3 12 0 0', explanation: 'Zeroes pushed to end in-place.' },
      { input: '1\n0', output: '0', explanation: 'Single zero stays.' },
    ],
    hints: [
      'Use a slow pointer that tracks where the next non-zero element should go.',
    ],
    editorial: `### Two Pointers Compaction\n\nMaintain slow pointer $p$. Whenever $nums[i] \\neq 0$, swap $nums[i]$ with $nums[p]$ and advance $p$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 61.6,
    submissions: 7300,
    accepted: 4496,
    sampleTests: [
      { input: '5\n0 1 0 3 12', expected: '1 3 12 0 0', isSample: 1 },
      { input: '1\n0', expected: '0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\n1 0 0', expected: '1 0 0', isSample: 0 },
      { input: '4\n0 0 0 1', expected: '1 0 0 0', isSample: 0 },
    ],
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    difficulty: 'Easy',
    topic_slug: 'two-pointers',
    description: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove the duplicates **in-place** such that each unique element appears only **once**. The relative order of the elements should be kept the same.

Return the number of unique elements in \`nums\`.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated sorted integers',
    output_format: 'Integer representing the count of unique elements',
    constraints: '1 <= nums.length <= 3 * 10^4\n-100 <= nums[i] <= 100\nnums is sorted in non-decreasing order.',
    examples: [
      { input: '3\n1 1 2', output: '2', explanation: 'Unique elements: [1, 2]. Count = 2.' },
      { input: '10\n0 0 1 1 1 2 2 3 3 4', output: '5', explanation: 'Unique elements: [0, 1, 2, 3, 4]. Count = 5.' },
    ],
    hints: [
      'Use a write pointer that only increments when a new distinct value is encountered.',
    ],
    editorial: `### Slow-Fast Pointers\n\nInitialize $k = 1$. Iterate $i$ from 1 to $n - 1$. When $nums[i] \\neq nums[i - 1]$, set $nums[k] = nums[i]$ and $k++$. Return $k$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 55.4,
    submissions: 8400,
    accepted: 4653,
    sampleTests: [
      { input: '3\n1 1 2', expected: '2', isSample: 1 },
      { input: '10\n0 0 1 1 1 2 2 3 3 4', expected: '5', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n1', expected: '1', isSample: 0 },
      { input: '4\n1 2 3 4', expected: '4', isSample: 0 },
    ],
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic_slug: 'two-pointers',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated elevation heights',
    output_format: 'Single integer representing units of trapped water',
    constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    examples: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: '6 units of rain water trapped.' },
      { input: '6\n4 2 0 3 2 5', output: '9', explanation: '9 units trapped.' },
    ],
    hints: [
      'Water trapped at bar i is min(maxLeft, maxRight) - height[i].',
      'Use two pointers from left and right tracking maxLeft and maxRight to eliminate extra space.',
    ],
    editorial: `### Two Pointers Water Trapping\n\nMaintain $l = 0, r = n - 1, \\text{leftMax} = 0, \\text{rightMax} = 0$. Advance pointer with smaller max, trapping $\\text{max} - h[i]$ water.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 60.1,
    submissions: 8900,
    accepted: 5348,
    sampleTests: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected: '6', isSample: 1 },
      { input: '6\n4 2 0 3 2 5', expected: '9', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\n2 0 2', expected: '2', isSample: 0 },
      { input: '4\n3 0 0 3', expected: '6', isSample: 0 },
    ],
  },
  {
    title: 'Valid Palindrome II',
    slug: 'valid-palindrome-ii',
    difficulty: 'Easy',
    topic_slug: 'two-pointers',
    description: `Given a string \`s\`, return \`true\` *if the* \`s\` *can be palindrome after deleting **at most one** character from it*.`,
    input_format: 'Single line containing string s',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length <= 10^5\ns consists of lowercase English letters.',
    examples: [
      { input: 'abca', output: 'true', explanation: 'Delete "c" or "b" to make "aba" or "aca".' },
      { input: 'abc', output: 'false', explanation: 'Deleting 1 character leaves "ab", "bc", or "ac" - none are palindromes.' },
    ],
    hints: [
      'Two pointers moving towards center. At first mismatch, check if s[l+1..r] OR s[l..r-1] is a palindrome.',
    ],
    editorial: `### Greedy Branching on First Mismatch\n\nWhen $s[l] \\neq s[r]$, test substring palindromes for deleting $s[l]$ vs deleting $s[r]$.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 40.2,
    submissions: 6100,
    accepted: 2452,
    sampleTests: [
      { input: 'abca', expected: 'true', isSample: 1 },
      { input: 'abc', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'aba', expected: 'true', isSample: 0 },
      { input: 'eeccccbebaeeabebccceea', expected: 'false', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. RECURSION (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    topic_slug: 'recursion',
    description: `The **Fibonacci numbers**, commonly denoted \`F(n)\` form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from \`0\` and \`1\`. That is:
\`\`\`
F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.
\`\`\`
Given \`n\`, calculate \`F(n)\`.`,
    input_format: 'Single integer n',
    output_format: 'Integer representing F(n)',
    constraints: '0 <= n <= 30',
    examples: [
      { input: '4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' },
      { input: '2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
    ],
    hints: [
      'Base cases are F(0) = 0 and F(1) = 1.',
      'Recursively compute fib(n - 1) + fib(n - 2), or memoize/iterate to avoid exponential time.',
    ],
    editorial: `### Recursive Relation with Iteration\n\nCan be implemented via simple recursion or memoized linear loop.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 70.4,
    submissions: 7900,
    accepted: 5561,
    sampleTests: [
      { input: '4', expected: '3', isSample: 1 },
      { input: '2', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '0', expected: '0', isSample: 0 },
      { input: '10', expected: '55', isSample: 0 },
    ],
  },
  {
    title: 'Power of Three',
    slug: 'power-of-three',
    difficulty: 'Easy',
    topic_slug: 'recursion',
    description: `Given an integer \`n\`, return \`true\` if it is a power of three. Otherwise, return \`false\`.

An integer \`n\` is a power of three, if there exists an integer \`x\` such that \`n == 3^x\`.`,
    input_format: 'Single integer n',
    output_format: '"true" or "false"',
    constraints: '-2^31 <= n <= 2^31 - 1',
    examples: [
      { input: '27', output: 'true', explanation: '27 = 3^3.' },
      { input: '0', output: 'false', explanation: 'There is no x where 3^x = 0.' },
    ],
    hints: [
      'Base case: n == 1 is true. If n <= 0 or n % 3 != 0, return false.',
      'Recursively check isPowerOfThree(n / 3).',
    ],
    editorial: `### Recursive Division by 3\n\nDivide recursively by 3 until 1 is reached. If any remainder is non-zero, it is not a power of 3.\n\n**Time Complexity**: $O(\\log_3 N)$  \n**Space Complexity**: $O(\\log_3 N)$ call stack`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(log N)',
    acceptance_rate: 46.1,
    submissions: 5100,
    accepted: 2351,
    sampleTests: [
      { input: '27', expected: 'true', isSample: 1 },
      { input: '0', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: '9', expected: 'true', isSample: 0 },
      { input: '-1', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Pow(x, n)',
    slug: 'pow-x-n',
    difficulty: 'Medium',
    topic_slug: 'recursion',
    description: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., $x^n$).

Print integer result if integer or up to 5 decimal places.`,
    input_format: 'Single line with number x and integer n separated by space',
    output_format: 'Calculated power value',
    constraints: '-100.0 < x < 100.0\n-2^31 <= n <= 2^31 - 1\nn is an integer.',
    examples: [
      { input: '2 10', output: '1024', explanation: '2^10 = 1024.' },
      { input: '2 -2', output: '0.25', explanation: '2^-2 = 1/4 = 0.25.' },
    ],
    hints: [
      'Divide and conquer: x^n = (x^(n/2))^2.',
      'If n is odd, multiply by x.',
    ],
    editorial: `### Binary Exponentiation\n\nHalve power at each step recursively: $x^n = (x^2)^{n/2}$ for even $n$, and $x \\cdot x^{n-1}$ for odd $n$.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(\\log N)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(log N)',
    acceptance_rate: 34.8,
    submissions: 6800,
    accepted: 2366,
    sampleTests: [
      { input: '2 10', expected: '1024', isSample: 1 },
      { input: '2 -2', expected: '0.25', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3 3', expected: '27', isSample: 0 },
      { input: '10 0', expected: '1', isSample: 0 },
    ],
  },
  {
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    difficulty: 'Medium',
    topic_slug: 'recursion',
    description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses and return the **total number of valid combinations**.`,
    input_format: 'Single integer n',
    output_format: 'Total count of valid well-formed parentheses strings',
    constraints: '1 <= n <= 8',
    examples: [
      { input: '3', output: '5', explanation: '5 valid combinations: ((())), (()()), (())(), ()(()), ()()().' },
      { input: '1', output: '1', explanation: 'Only "()".' },
    ],
    hints: [
      'Use backtracking recursion maintaining counts of open and close brackets.',
      'Can only add open if open < n; can only add close if close < open.',
    ],
    editorial: `### Backtracking Catalan Exploration\n\nBranch recursively placing \'(\' when $\\text{open} < n$ and \')\' when $\\text{close} < \\text{open}$. Total combinations equals the $n$-th Catalan number $C_n = \\frac{1}{n+1}\\binom{2n}{n}$.\n\n**Time Complexity**: $O(\\frac{4^n}{\\sqrt{n}})$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(4^n / sqrt(n))',
    space_complexity: 'O(N)',
    acceptance_rate: 74.2,
    submissions: 7500,
    accepted: 5565,
    sampleTests: [
      { input: '3', expected: '5', isSample: 1 },
      { input: '1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4', expected: '14', isSample: 0 },
      { input: '2', expected: '2', isSample: 0 },
    ],
  },
  {
    title: 'Permutations',
    slug: 'permutations',
    difficulty: 'Medium',
    topic_slug: 'recursion',
    description: `Given an array \`nums\` of distinct integers, return the **total count of all possible permutations** ($n!$).`,
    input_format: 'Line 1: integer n\nLine 2: n distinct space-separated integers',
    output_format: 'Total count integer of permutations',
    constraints: '1 <= nums.length <= 6\nAll the integers of nums are unique.',
    examples: [
      { input: '3\n1 2 3', output: '6', explanation: '3! = 6 permutations.' },
      { input: '1\n1', output: '1', explanation: '1! = 1 permutation.' },
    ],
    hints: [
      'For n distinct elements, total permutations is n!.',
      'Can be generated recursively by swapping elements into each position.',
    ],
    editorial: `### Recursive Backtracking Swaps\n\nSwap each remaining element into the current position, recurse on the suffix, and backtrack.\n\n**Time Complexity**: $O(N!)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N!)',
    space_complexity: 'O(N)',
    acceptance_rate: 77.0,
    submissions: 5900,
    accepted: 4543,
    sampleTests: [
      { input: '3\n1 2 3', expected: '6', isSample: 1 },
      { input: '1\n1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4\n1 2 3 4', expected: '24', isSample: 0 },
      { input: '2\n0 1', expected: '2', isSample: 0 },
    ],
  },
  {
    title: 'Tower of Hanoi',
    slug: 'tower-of-hanoi',
    difficulty: 'Medium',
    topic_slug: 'recursion',
    description: `The Tower of Hanoi is a mathematical puzzle where we have three rods and \`n\` disks. The objective of the puzzle is to move the entire stack to another rod, obeying the following simple rules:
1. Only one disk can be moved at a time.
2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack.
3. No disk may be placed on top of a smaller disk.

Given \`n\` disks, return the **minimum number of moves** ($2^n - 1$) required to solve the puzzle.`,
    input_format: 'Single integer n',
    output_format: 'Single integer representing minimum moves',
    constraints: '1 <= n <= 30',
    examples: [
      { input: '3', output: '7', explanation: '2^3 - 1 = 7 moves.' },
      { input: '4', output: '15', explanation: '2^4 - 1 = 15 moves.' },
    ],
    hints: [
      'To move n disks from A to C: move n - 1 disks from A to B, move largest disk from A to C, then move n - 1 disks from B to C.',
      'Recurrence: T(n) = 2T(n - 1) + 1, which evaluates to 2^n - 1.',
    ],
    editorial: `### Classic Recursive Reduction\n\n$T(n) = 2T(n-1) + 1 = 2^n - 1$.\n\n**Time Complexity**: $O(1)$ directly or $O(2^N)$ for move generation  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(1)',
    space_complexity: 'O(1)',
    acceptance_rate: 82.5,
    submissions: 4200,
    accepted: 3465,
    sampleTests: [
      { input: '3', expected: '7', isSample: 1 },
      { input: '4', expected: '15', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1', expected: '1', isSample: 0 },
      { input: '5', expected: '31', isSample: 0 },
    ],
  },
  {
    title: 'Combinations',
    slug: 'combinations',
    difficulty: 'Medium',
    topic_slug: 'recursion',
    description: `Given two integers \`n\` and \`k\`, return the **total number of combinations** of \`k\` numbers chosen from the range \`[1, n]\` (i.e. $\\binom{n}{k}$).`,
    input_format: 'Single line with two integers n and k separated by space',
    output_format: 'Total combinations integer',
    constraints: '1 <= n <= 20\n1 <= k <= n',
    examples: [
      { input: '4 2', output: '6', explanation: 'Pairs: [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]. Total = 6.' },
      { input: '1 1', output: '1', explanation: 'Only [1].' },
    ],
    hints: [
      'Pascal triangle recurrence: C(n, k) = C(n - 1, k - 1) + C(n - 1, k).',
      'Base cases: C(n, 0) = 1, C(n, n) = 1.',
    ],
    editorial: `### Recursive Binomial Coefficient\n\nCompute $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ recursively using Pascal identity $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$.\n\n**Time Complexity**: $O(k)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(k)',
    space_complexity: 'O(1)',
    acceptance_rate: 69.1,
    submissions: 4800,
    accepted: 3316,
    sampleTests: [
      { input: '4 2', expected: '6', isSample: 1 },
      { input: '1 1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '5 3', expected: '10', isSample: 0 },
      { input: '6 2', expected: '15', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. STACK (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic_slug: 'stack',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    input_format: 'Single string line s',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only "()[]{}".',
    examples: [
      { input: '()[]{}', output: 'true', explanation: 'All pairs properly nested.' },
      { input: '(]', output: 'false', explanation: 'Closing bracket does not match open bracket.' },
    ],
    hints: [
      'Push opening brackets onto a stack.',
      'When seeing a closing bracket, pop the top of the stack and ensure it matches.',
    ],
    editorial: `### LIFO Stack Matching\n\nUse a stack. For each closing bracket, check that the top element matches and pop it. Return true if stack is empty at end.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 40.8,
    submissions: 16500,
    accepted: 6732,
    sampleTests: [
      { input: '()[]{}', expected: 'true', isSample: 1 },
      { input: '(]', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: '([])', expected: 'true', isSample: 0 },
      { input: '([)]', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Min Stack',
    slug: 'min-stack',
    difficulty: 'Medium',
    topic_slug: 'stack',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the operations:
- \`push val\`: Pushes the element val onto the stack.
- \`pop\`: Removes the element on the top of the stack.
- \`top\`: Gets the top element of the stack.
- \`getMin\`: Retrieves the minimum element in the stack.

Print output for each \`top\` and \`getMin\` command.`,
    input_format: 'Line 1: integer n (number of operations)\nNext n lines: operation string',
    output_format: 'Output lines for each top or getMin call',
    constraints: '-2^31 <= val <= 2^31 - 1\nMethods pop, top and getMin are called on non-empty stacks.',
    examples: [
      { input: '4\npush -2\npush 0\npush -3\ngetMin', output: '-3', explanation: 'Minimum is -3.' },
      { input: '5\npush 1\npush 2\ntop\ngetMin\npop', output: '2\n1', explanation: 'Top is 2, min is 1.' },
    ],
    hints: [
      'Maintain a secondary auxiliary stack that stores the minimum element corresponding to each state.',
    ],
    editorial: `### Auxiliary Min Stack\n\nEach node or paired stack holds the value and the current minimum at that height.\n\n**Time Complexity**: $O(1)$ per operation  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(1)',
    space_complexity: 'O(N)',
    acceptance_rate: 53.0,
    submissions: 6200,
    accepted: 3286,
    sampleTests: [
      { input: '4\npush -2\npush 0\npush -3\ngetMin', expected: '-3', isSample: 1 },
      { input: '5\npush 1\npush 2\ntop\ngetMin\npop', expected: '2\n1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\npush 5\ntop\ngetMin', expected: '5\n5', isSample: 0 },
      { input: '6\npush 2\npush 1\ngetMin\npop\ngetMin\ntop', expected: '1\n2\n2', isSample: 0 },
    ],
  },
  {
    title: 'Evaluate Reverse Polish Notation',
    slug: 'evaluate-reverse-polish-notation',
    difficulty: 'Medium',
    topic_slug: 'stack',
    description: `You are given an array of strings \`tokens\` that represents an arithmetic expression in a **Reverse Polish Notation** (postfix notation).

Evaluate the expression. Return *an integer that represents the value of the expression*.

The valid operators are \`'+'\`, \`'-'\`, \`'*'\`, and \`'/'\`. Division truncates toward zero.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated tokens',
    output_format: 'Single integer evaluation result',
    constraints: '1 <= tokens.length <= 10^4\ntokens[i] is an operator or an integer in range [-200, 200].',
    examples: [
      { input: '5\n2 1 + 3 *', output: '9', explanation: '((2 + 1) * 3) = 9.' },
      { input: '5\n4 13 5 / +', output: '6', explanation: '(4 + (13 / 5)) = 6.' },
    ],
    hints: [
      'Use a stack: push numbers, and when encountering an operator, pop two operands, apply operator, and push result.',
      'Remember operand order: b = pop(), a = pop(), calculate a op b.',
    ],
    editorial: `### Postfix Stack Evaluation\n\nPush operands to stack. When an operator is met, pop right operand $b$, pop left operand $a$, compute $a \\text{ op } b$, and push.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 49.5,
    submissions: 5800,
    accepted: 2871,
    sampleTests: [
      { input: '5\n2 1 + 3 *', expected: '9', isSample: 1 },
      { input: '5\n4 13 5 / +', expected: '6', isSample: 1 },
    ],
    hiddenTests: [
      { input: '5\n10 6 9 3 + -11 * / * 17 + 5 +', expected: '22', isSample: 0 },
      { input: '1\n42', expected: '42', isSample: 0 },
    ],
  },
  {
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    difficulty: 'Medium',
    topic_slug: 'stack',
    description: `Given an array of integers \`temperatures\` represents the daily temperatures, return *an array* \`answer\` *such that* \`answer[i]\` *is the number of days you have to wait after the* $i^{\\text{th}}$ *day to get a warmer temperature*. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated temperature integers',
    output_format: 'n space-separated days integers',
    constraints: '1 <= temperatures.length <= 10^5\n30 <= temperatures[i] <= 100',
    examples: [
      { input: '4\n73 74 75 71', output: '1 1 0 0', explanation: 'Day 0 waits 1 day, Day 1 waits 1 day, Days 2 & 3 have no warmer day.' },
      { input: '8\n73 74 75 71 69 72 76 73', output: '1 1 4 2 1 1 0 0', explanation: 'Monotonic decreasing stack resolution.' },
    ],
    hints: [
      'Maintain a monotonic decreasing stack of indices.',
      'When current temperature > stack.top temperature, pop and answer[top] = i - top.',
    ],
    editorial: `### Monotonic Decreasing Stack\n\nStore indices in stack where temperatures decrease. When warmer day arrives, pop and resolve waiting days.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 66.3,
    submissions: 7100,
    accepted: 4707,
    sampleTests: [
      { input: '4\n73 74 75 71', expected: '1 1 0 0', isSample: 1 },
      { input: '8\n73 74 75 71 69 72 76 73', expected: '1 1 4 2 1 1 0 0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\n30 40 50', expected: '1 1 0', isSample: 0 },
      { input: '3\n50 40 30', expected: '0 0 0', isSample: 0 },
    ],
  },
  {
    title: 'Next Greater Element I',
    slug: 'next-greater-element-i',
    difficulty: 'Easy',
    topic_slug: 'stack',
    description: `The **next greater element** of some element \`x\` in an array is the **first greater** element that is to the **right** of \`x\` in the same array.

You are given two **distinct 0-indexed** integer arrays \`nums1\` and \`nums2\`, where \`nums1\` is a subset of \`nums2\`.

For each $0 \\le i < nums1.length$, find the index $j$ such that $nums1[i] == nums2[j]$ and determine the next greater element of $nums2[j]$ in $nums2$. If there is no next greater element, then the answer for this query is \`-1\`.`,
    input_format: 'Line 1: integers n and m\nLine 2: n space-separated elements for nums1\nLine 3: m space-separated elements for nums2',
    output_format: 'n space-separated next greater values',
    constraints: '1 <= nums1.length <= nums2.length <= 1000\n0 <= nums1[i], nums2[i] <= 10^4\nAll integers in nums1 and nums2 are unique.',
    examples: [
      { input: '3 4\n4 1 2\n1 3 4 2', output: '-1 3 -1', explanation: 'For 4: none (-1). For 1: next greater is 3. For 2: none (-1).' },
      { input: '2 4\n2 4\n1 2 3 4', output: '3 -1', explanation: 'For 2: 3. For 4: -1.' },
    ],
    hints: [
      'Precompute next greater element for all elements in nums2 using a monotonic stack and hash map.',
    ],
    editorial: `### Monotonic Stack + Hash Map\n\nTraverse \`nums2\` with a monotonic stack. Store mapping $x \\to \\text{nextGreater}[x]$ in map, then answer queries for \`nums1\` in $O(1)$.\n\n**Time Complexity**: $O(N + M)$  \n**Space Complexity**: $O(M)$`,
    time_complexity: 'O(N + M)',
    space_complexity: 'O(M)',
    acceptance_rate: 71.7,
    submissions: 5400,
    accepted: 3871,
    sampleTests: [
      { input: '3 4\n4 1 2\n1 3 4 2', expected: '-1 3 -1', isSample: 1 },
      { input: '2 4\n2 4\n1 2 3 4', expected: '3 -1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1 2\n1\n2 1', expected: '-1', isSample: 0 },
      { input: '2 3\n1 3\n3 2 1', expected: '-1 -1', isSample: 0 },
    ],
  },
  {
    title: 'Backspace String Compare',
    slug: 'backspace-string-compare',
    difficulty: 'Easy',
    topic_slug: 'stack',
    description: `Given two strings \`s\` and \`t\`, return \`true\` *if they are equal when both are typed into empty text editors*. \`'#'\` means a backspace character.

Note that after backspacing an empty text, the text will continue to be empty.`,
    input_format: 'Line 1: string s\nLine 2: string t',
    output_format: '"true" or "false"',
    constraints: '1 <= s.length, t.length <= 200\ns and t only contain lowercase letters and "#" characters.',
    examples: [
      { input: 'ab#c\nad#c', output: 'true', explanation: 'Both strings become "ac".' },
      { input: 'a#c\nb', output: 'false', explanation: 's becomes "c" while t is "b".' },
    ],
    hints: [
      'Simulate typing using a stack: push characters, pop on "#" when stack is non-empty.',
    ],
    editorial: `### Stack Simulation\n\nPush characters to stack, popping whenever \'#\' appears. Compare finalized string results.\n\n**Time Complexity**: $O(N + M)$  \n**Space Complexity**: $O(N + M)$`,
    time_complexity: 'O(N + M)',
    space_complexity: 'O(N + M)',
    acceptance_rate: 48.3,
    submissions: 5200,
    accepted: 2511,
    sampleTests: [
      { input: 'ab#c\nad#c', expected: 'true', isSample: 1 },
      { input: 'a#c\nb', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'ab##\nc#d#', expected: 'true', isSample: 0 },
      { input: 'a#\nb#', expected: 'true', isSample: 0 },
    ],
  },
  {
    title: 'Asteroid Collision',
    slug: 'asteroid-collision',
    difficulty: 'Medium',
    topic_slug: 'stack',
    description: `We are given an array \`asteroids\` of integers representing asteroids in a row.

For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one explodes. If both are the same size, both explode. Two asteroids moving in the same direction will never meet.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Space-separated integers of remaining asteroids (or empty line if none)',
    constraints: '2 <= asteroids.length <= 10^4\n-1000 <= asteroids[i] <= 1000\nasteroids[i] != 0',
    examples: [
      { input: '3\n5 10 -5', output: '5 10', explanation: '10 and -5 collide resulting in 10. 5 and 10 move right.' },
      { input: '3\n10 2 -5', output: '10', explanation: '2 and -5 collide resulting in -5. 10 and -5 collide resulting in 10.' },
    ],
    hints: [
      'Collision only occurs when top of stack > 0 and current asteroid < 0.',
      'Simulate collisions while conditions hold.',
    ],
    editorial: `### Collision Resolution Stack\n\nPush asteroids onto stack. When current $< 0$ and top $> 0$, resolve collision based on magnitudes.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 44.9,
    submissions: 5900,
    accepted: 2649,
    sampleTests: [
      { input: '3\n5 10 -5', expected: '5 10', isSample: 1 },
      { input: '3\n10 2 -5', expected: '10', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n8 -8', expected: '', isSample: 0 },
      { input: '4\n-2 -1 1 2', expected: '-2 -1 1 2', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. QUEUE (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    difficulty: 'Easy',
    topic_slug: 'queue',
    description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).

Print output for each \`peek\`, \`pop\`, and \`empty\` call.`,
    input_format: 'Line 1: integer n (number of operations)\nNext n lines: operation string',
    output_format: 'Output lines for each peek, pop, or empty call',
    constraints: '1 <= val <= 9\nAt most 100 calls will be made to push, pop, peek, and empty.\nAll calls to pop and peek are valid.',
    examples: [
      { input: '4\npush 1\npush 2\npeek\npop', output: '1\n1', explanation: 'peek returns 1, pop removes and returns 1.' },
      { input: '3\npush 5\nempty\npop', output: 'false\n5', explanation: 'Queue not empty, pop returns 5.' },
    ],
    hints: [
      'Use an inStack for pushing and an outStack for popping/peeking.',
      'Transfer elements from inStack to outStack only when outStack is empty.',
    ],
    editorial: `### Amortized O(1) Two Stacks Queue\n\nPush to $S_1$. For pop/peek, if $S_2$ is empty, dump all elements of $S_1$ into $S_2$. Each element moves at most twice.\n\n**Time Complexity**: Amortized $O(1)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'Amortized O(1)',
    space_complexity: 'O(N)',
    acceptance_rate: 64.7,
    submissions: 6800,
    accepted: 4399,
    sampleTests: [
      { input: '4\npush 1\npush 2\npeek\npop', expected: '1\n1', isSample: 1 },
      { input: '3\npush 5\nempty\npop', expected: 'false\n5', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\npush 3\npeek', expected: '3', isSample: 0 },
      { input: '5\npush 1\npush 2\npop\npush 3\npeek', expected: '1\n2', isSample: 0 },
    ],
  },
  {
    title: 'Number of Recent Calls',
    slug: 'number-of-recent-calls',
    difficulty: 'Easy',
    topic_slug: 'queue',
    description: `You have a \`RecentCounter\` class which counts the number of recent requests within a certain time frame.

Implement the \`RecentCounter\` class:
- \`RecentCounter()\` Initializes the counter with zero recent requests.
- \`int ping(int t)\` Adds a new request at time \`t\`, where \`t\` represents some time in milliseconds, and returns the number of requests that have happened in the past \`3000\` milliseconds (including the new request). Specifically, return the number of requests that have happened in the inclusive range \`[t - 3000, t]\`.

It is guaranteed that every call to \`ping\` uses a strictly larger value of \`t\` than the previous call.`,
    input_format: 'Line 1: integer n (number of pings)\nLine 2: n space-separated timestamps',
    output_format: 'n space-separated call counts',
    constraints: '1 <= t <= 10^9\nEach test case will call ping with strictly increasing values of t.\nAt most 10^4 calls will be made to ping.',
    examples: [
      { input: '4\n1 100 3001 3002', output: '1 2 3 3', explanation: 'At 3002, timestamp 1 is outside [2, 3002] and popped, leaving 3 pings.' },
      { input: '1\n1', output: '1', explanation: 'Single ping returns 1.' },
    ],
    hints: [
      'Maintain a queue of timestamps.',
      'For each ping(t), push t, then pop from front while queue.front() < t - 3000. Return queue.size.',
    ],
    editorial: `### Sliding Window FIFO Queue\n\nEnqueue $t$, then dequeue while $\\text{front} < t - 3000$. Return size.\n\n**Time Complexity**: $O(1)$ amortized per ping  \n**Space Complexity**: $O(W)$ where $W \\le 3000$`,
    time_complexity: 'O(1) amortized',
    space_complexity: 'O(W)',
    acceptance_rate: 74.5,
    submissions: 5100,
    accepted: 3799,
    sampleTests: [
      { input: '4\n1 100 3001 3002', expected: '1 2 3 3', isSample: 1 },
      { input: '1\n1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '3\n642 1849 4921', expected: '1 2 2', isSample: 0 },
      { input: '2\n10 3010', expected: '1 2', isSample: 0 },
    ],
  },
  {
    title: 'First Unique Number in Data Stream',
    slug: 'first-unique-number',
    difficulty: 'Medium',
    topic_slug: 'queue',
    description: `You have a queue of integers, where you keep adding integers. Implement an algorithm that prints the first unique integer after each addition. If no unique integer exists, print \`-1\`.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers added to stream',
    output_format: 'n space-separated integers representing first unique element at each step',
    constraints: '1 <= n <= 5000\n1 <= value <= 10^5',
    examples: [
      { input: '6\n2 3 5 2 3 5', output: '2 2 2 3 5 -1', explanation: 'First unique tracks unique values, becomes -1 when all have duplicates.' },
      { input: '3\n7 7 7', output: '7 -1 -1', explanation: 'Duplicates quickly turn result to -1.' },
    ],
    hints: [
      'Combine a Queue and a Frequency Map.',
      'Pop elements from the front of the queue if their frequency is greater than 1.',
    ],
    editorial: `### Queue with Lazy Eviction\n\nKeep a queue of candidates. Pop front items whenever their frequency in the map exceeds 1.\n\n**Time Complexity**: $O(1)$ amortized per addition  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(1) amortized',
    space_complexity: 'O(N)',
    acceptance_rate: 51.0,
    submissions: 4200,
    accepted: 2142,
    sampleTests: [
      { input: '6\n2 3 5 2 3 5', expected: '2 2 2 3 5 -1', isSample: 1 },
      { input: '3\n7 7 7', expected: '7 -1 -1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n99', expected: '99', isSample: 0 },
      { input: '4\n1 2 2 1', expected: '1 1 1 -1', isSample: 0 },
    ],
  },
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    topic_slug: 'queue',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return *the max sliding window* values.`,
    input_format: 'Line 1: integers n and k\nLine 2: n space-separated integers',
    output_format: 'Space-separated maximum values for each window',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length',
    examples: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', output: '3 3 5 5 6 7', explanation: 'Max values in each size-3 window.' },
      { input: '1 1\n1', output: '1', explanation: 'Window of 1 has max 1.' },
    ],
    hints: [
      'Maintain a monotonic double-ended queue (deque) of indices.',
      'Ensure values in deque are in decreasing order.',
      'Remove elements outside the current window from the front of the deque.',
    ],
    editorial: `### Monotonic Deque\n\nStore indices in a deque such that values decrease. For each $i$, remove indices $< i - k + 1$ from front, pop smaller values from back, push $i$. Front of deque is max of window.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(K)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(K)',
    acceptance_rate: 46.5,
    submissions: 6800,
    accepted: 3162,
    sampleTests: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', expected: '3 3 5 5 6 7', isSample: 1 },
      { input: '1 1\n1', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4 2\n9 11 8 5', expected: '11 11 8', isSample: 0 },
      { input: '2 1\n4 -2', expected: '4 -2', isSample: 0 },
    ],
  },
  {
    title: 'Design Circular Queue',
    slug: 'design-circular-queue',
    difficulty: 'Medium',
    topic_slug: 'queue',
    description: `Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".

Implement operations:
- \`enQueue value\`: Inserts an element into the circular queue. Return \`true\` if successful.
- \`deQueue\`: Deletes an element from the circular queue. Return \`true\` if successful.
- \`Front\`: Gets the front item from the queue. If empty, return \`-1\`.
- \`Rear\`: Gets the last item from the queue. If empty, return \`-1\`.
- \`isEmpty\`: Checks whether the circular queue is empty.
- \`isFull\`: Checks whether the circular queue is full.`,
    input_format: 'Line 1: integer k (capacity)\nFollowing lines: operation calls until end',
    output_format: 'Return value for each operation line',
    constraints: '1 <= k <= 1000\n0 <= value <= 1000\nAt most 3000 calls will be made to methods.',
    examples: [
      { input: '3\nenQueue 1\nenQueue 2\nRear\nisFull', output: 'true\ntrue\n2\nfalse', explanation: 'Circular queue capacity 3.' },
      { input: '2\nenQueue 1\nenQueue 2\nenQueue 3', output: 'true\ntrue\nfalse', explanation: 'Third enqueue fails because capacity is 2.' },
    ],
    hints: [
      'Maintain head, tail, and size pointers using modulo arithmetic: (index + 1) % capacity.',
    ],
    editorial: `### Fixed Array Ring Buffer\n\nUse an array of size $k$ with head and count variables. Modulo wraps indices around.\n\n**Time Complexity**: $O(1)$ per operation  \n**Space Complexity**: $O(K)$`,
    time_complexity: 'O(1)',
    space_complexity: 'O(K)',
    acceptance_rate: 51.8,
    submissions: 4300,
    accepted: 2227,
    sampleTests: [
      { input: '3\nenQueue 1\nenQueue 2\nRear\nisFull', expected: 'true\ntrue\n2\nfalse', isSample: 1 },
      { input: '2\nenQueue 1\nenQueue 2\nenQueue 3', expected: 'true\ntrue\nfalse', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\nenQueue 5\nisFull\nFront\ndeQueue\nisEmpty', expected: 'true\ntrue\n5\ntrue\ntrue', isSample: 0 },
      { input: '2\nFront\nRear', expected: '-1\n-1', isSample: 0 },
    ],
  },
  {
    title: 'Rotten Oranges',
    slug: 'rotten-oranges',
    difficulty: 'Medium',
    topic_slug: 'queue',
    description: `You are given an \`m x n\` \`grid\` where each cell can have one of three values:
- \`0\` representing an empty cell,
- \`1\` representing a fresh orange, or
- \`2\` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Return *the minimum number of minutes that must elapse until no cell has a fresh orange*. If *this is impossible, return* \`-1\`.`,
    input_format: 'Line 1: integers m and n\nNext m lines: n space-separated integers (0, 1, or 2)',
    output_format: 'Minimum minutes integer or -1',
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 10\ngrid[i][j] is 0, 1, or 2.',
    examples: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', output: '4', explanation: 'All oranges rot in 4 minutes.' },
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', output: '-1', explanation: 'Orange at bottom-left corner never rots.' },
    ],
    hints: [
      'Multi-source BFS using a Queue initialized with all rotten oranges (2).',
      'Track fresh orange count; decrement when infecting.',
    ],
    editorial: `### Multi-Source Breadth-First Search\n\nEnqueue all initial rotten oranges at time 0. Spread layer-by-layer to 4-directional fresh neighbors. If fresh $> 0$ remaining, return -1.\n\n**Time Complexity**: $O(M \\cdot N)$  \n**Space Complexity**: $O(M \\cdot N)$`,
    time_complexity: 'O(M * N)',
    space_complexity: 'O(M * N)',
    acceptance_rate: 53.6,
    submissions: 6700,
    accepted: 3591,
    sampleTests: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', expected: '4', isSample: 1 },
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', expected: '-1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1 2\n0 2', expected: '0', isSample: 0 },
      { input: '1 1\n1', expected: '-1', isSample: 0 },
    ],
  },
  {
    title: 'Dota2 Senate',
    slug: 'dota2-senate',
    difficulty: 'Medium',
    topic_slug: 'queue',
    description: `In the world of Dota2, there are two parties: the Radiant and the Dire.

The Senate consists of several senators who want to decide on a change. Each senator belongs to one of the two parties.

The round-based procedure starts with each senator having one vote. In each round, each senator can either ban one senator's rights or announce the victory if all remaining senators are of the same party.

Predict which party will finally announce the victory: \`"Radiant"\` or \`"Dire"\`.`,
    input_format: 'Single line string of characters "R" and "D"',
    output_format: '"Radiant" or "Dire"',
    constraints: 'n == senate.length\n1 <= n <= 10^4\nsenate[i] is either "R" or "D".',
    examples: [
      { input: 'RD', output: 'Radiant', explanation: 'Radiant senator bans Dire senator.' },
      { input: 'RDD', output: 'Dire', explanation: 'Dire senators win majority.' },
    ],
    hints: [
      'Use two queues: radiantQueue and direQueue storing senator turn indices.',
      'Compare front of both queues: smaller index votes first and bans the other, then re-enters queue with index + n.',
    ],
    editorial: `### Two Queues Simulation\n\nGreedy voting: earliest senator bans the next available opposing senator and is requeued for next round ($i + n$).\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 48.0,
    submissions: 3900,
    accepted: 1872,
    sampleTests: [
      { input: 'RD', expected: 'Radiant', isSample: 1 },
      { input: 'RDD', expected: 'Dire', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'RRDDD', expected: 'Radiant', isSample: 0 },
      { input: 'D', expected: 'Dire', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. SEARCHING (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topic_slug: 'searching',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with $O(\\log n)$ runtime complexity.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated sorted integers\nLine 3: target integer',
    output_format: '0-based integer index or -1',
    constraints: '1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
    examples: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    hints: [
      'Initialize left = 0, right = n - 1.',
      'mid = left + (right - left) // 2. If nums[mid] == target return mid; narrow search space accordingly.',
    ],
    editorial: `### Classical Binary Search\n\nDivide search space in half each iteration comparing target with midpoint.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(1)',
    acceptance_rate: 57.2,
    submissions: 11000,
    accepted: 6292,
    sampleTests: [
      { input: '6\n-1 0 3 5 9 12\n9', expected: '4', isSample: 1 },
      { input: '6\n-1 0 3 5 9 12\n2', expected: '-1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n5\n5', expected: '0', isSample: 0 },
      { input: '2\n2 5\n2', expected: '0', isSample: 0 },
    ],
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    topic_slug: 'searching',
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` ($1 \\le k < nums.length$).

Given the array \`nums\` after the possible rotation and an integer \`target\`, return *the index of* \`target\` *if it is in* \`nums\`, *or* \`-1\` *if it is not in* \`nums\`.

You must write an algorithm with $O(\\log n)$ runtime complexity.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers\nLine 3: target integer',
    output_format: '0-based integer index or -1',
    constraints: '1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.\n-10^4 <= target <= 10^4',
    examples: [
      { input: '7\n4 5 6 7 0 1 2\n0', output: '4', explanation: 'Target 0 found at index 4.' },
      { input: '7\n4 5 6 7 0 1 2\n3', output: '-1', explanation: 'Target 3 not in array.' },
    ],
    hints: [
      'In a rotated sorted array, at least one half (left to mid or mid to right) is always strictly sorted.',
      'Check which half is sorted, then check if target lies within that sorted range.',
    ],
    editorial: `### Modified Binary Search\n\nIdentify which half is sorted: if $\\text{nums}[l] \\le \\text{nums}[m]$, left is sorted. If target lies within that range, search left; else search right.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(1)',
    acceptance_rate: 40.1,
    submissions: 8300,
    accepted: 3328,
    sampleTests: [
      { input: '7\n4 5 6 7 0 1 2\n0', expected: '4', isSample: 1 },
      { input: '7\n4 5 6 7 0 1 2\n3', expected: '-1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n1\n0', expected: '-1', isSample: 0 },
      { input: '3\n5 1 3\n5', expected: '0', isSample: 0 },
    ],
  },
  {
    title: 'Find First and Last Position of Element',
    slug: 'find-first-and-last-position',
    difficulty: 'Medium',
    topic_slug: 'searching',
    description: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`[-1, -1]\`.

You must write an algorithm with $O(\\log n)$ runtime complexity.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated sorted integers\nLine 3: target integer',
    output_format: 'Two space-separated integers representing start and end indices',
    constraints: '0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9\nnums is a non-decreasing array.\n-10^9 <= target <= 10^9',
    examples: [
      { input: '6\n5 7 7 8 8 10\n8', output: '3 4', explanation: '8 appears from index 3 to index 4.' },
      { input: '6\n5 7 7 8 8 10\n6', output: '-1 -1', explanation: '6 does not exist in nums.' },
    ],
    hints: [
      'Run two binary searches: one for the leftmost occurrence and one for the rightmost occurrence.',
    ],
    editorial: `### Dual Binary Searches\n\nFirst binary search finds lower bound (first index where $\\text{nums}[i] \\ge \\text{target}$). Second finds upper bound.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(1)',
    acceptance_rate: 43.5,
    submissions: 7100,
    accepted: 3088,
    sampleTests: [
      { input: '6\n5 7 7 8 8 10\n8', expected: '3 4', isSample: 1 },
      { input: '6\n5 7 7 8 8 10\n6', expected: '-1 -1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '0\n\n0', expected: '-1 -1', isSample: 0 },
      { input: '2\n2 2\n2', expected: '0 1', isSample: 0 },
    ],
  },
  {
    title: 'Search a 2D Matrix',
    slug: 'search-a-2d-matrix',
    difficulty: 'Medium',
    topic_slug: 'searching',
    description: `You are given an \`m x n\` integer matrix \`matrix\` with the following two properties:
- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` *if* \`target\` *is in* \`matrix\` *or* \`false\` *otherwise*.

You must write a solution in $O(\\log(m \\cdot n))$ time complexity.`,
    input_format: 'Line 1: integers m and n\nNext m lines: n space-separated integers\nLast line: target integer',
    output_format: '"true" or "false"',
    constraints: 'm == matrix.length\nn == matrix[i].length\n1 <= m, n <= 100\n-10^4 <= matrix[i][j], target <= 10^4',
    examples: [
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', output: 'true', explanation: '3 is present at (0, 1).' },
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', output: 'false', explanation: '13 is not present in matrix.' },
    ],
    hints: [
      'Treat the m x n matrix as a single 1D virtual sorted array of size m * n.',
      'Coordinate mapping: row = mid // n, col = mid % n.',
    ],
    editorial: `### 1D Binary Search on Virtual Array\n\nBinary search from index $0$ to $m \\cdot n - 1$. Map $\\text{mid} \\to (\\lfloor \\text{mid}/n \\rfloor, \\text{mid} \\% n)$.\n\n**Time Complexity**: $O(\\log(M \\cdot N))$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log(M * N))',
    space_complexity: 'O(1)',
    acceptance_rate: 49.8,
    submissions: 6600,
    accepted: 3286,
    sampleTests: [
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', expected: 'true', isSample: 1 },
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', expected: 'false', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1 1\n1\n1', expected: 'true', isSample: 0 },
      { input: '1 2\n1 3\n2', expected: 'false', isSample: 0 },
    ],
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'find-minimum-in-rotated-sorted-array',
    difficulty: 'Medium',
    topic_slug: 'searching',
    description: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times.

Given the sorted rotated array \`nums\` of **unique** elements, return *the minimum element of this array*.

You must write an algorithm that runs in $O(\\log n)$ time.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Minimum element integer',
    constraints: 'n == nums.length\n1 <= n <= 5000\n-5000 <= nums[i] <= 5000\nAll the integers of nums are unique.',
    examples: [
      { input: '5\n3 4 5 1 2', output: '1', explanation: 'Original array [1,2,3,4,5] rotated 3 times.' },
      { input: '7\n4 5 6 7 0 1 2', output: '0', explanation: 'Minimum is 0.' },
    ],
    hints: [
      'Compare nums[mid] with nums[right].',
      'If nums[mid] > nums[right], the minimum is in the right half (left = mid + 1). Else, right = mid.',
    ],
    editorial: `### Binary Search on Inflection Point\n\nIf $\\text{nums}[m] > \\text{nums}[r]$, the pivot is to the right. Else, pivot is at or to the left of $m$.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(1)',
    acceptance_rate: 50.1,
    submissions: 6200,
    accepted: 3106,
    sampleTests: [
      { input: '5\n3 4 5 1 2', expected: '1', isSample: 1 },
      { input: '7\n4 5 6 7 0 1 2', expected: '0', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n11', expected: '11', isSample: 0 },
      { input: '3\n2 3 1', expected: '1', isSample: 0 },
    ],
  },
  {
    title: 'Peak Index in a Mountain Array',
    slug: 'peak-index-in-a-mountain-array',
    difficulty: 'Medium',
    topic_slug: 'searching',
    description: `An array \`arr\` is a **mountain** if the following properties hold:
- \`arr.length >= 3\`
- There exists some \`i\` with \`0 < i < arr.length - 1\` such that:
  - \`arr[0] < arr[1] < ... < arr[i - 1] < arr[i]\`
  - \`arr[i] > arr[i + 1] > ... > arr[arr.length - 1]\`

Given a mountain array \`arr\`, return the index \`i\` such that \`arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]\`.

You must solve it in $O(\\log(\\text{arr.length}))$ time complexity.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Peak index integer',
    constraints: '3 <= arr.length <= 10^5\n0 <= arr[i] <= 10^6\narr is guaranteed to be a mountain array.',
    examples: [
      { input: '4\n0 2 1 0', output: '1', explanation: 'Peak is at index 1 with value 2.' },
      { input: '3\n0 1 0', output: '1', explanation: 'Peak is at index 1.' },
    ],
    hints: [
      'Binary search on slope: if arr[mid] < arr[mid + 1], peak is to the right.',
    ],
    editorial: `### Slope Binary Search\n\nIf $arr[m] < arr[m + 1]$, we are ascending on the left slope, so $l = m + 1$. Else $r = m$.\n\n**Time Complexity**: $O(\\log N)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log N)',
    space_complexity: 'O(1)',
    acceptance_rate: 68.2,
    submissions: 5400,
    accepted: 3682,
    sampleTests: [
      { input: '4\n0 2 1 0', expected: '1', isSample: 1 },
      { input: '3\n0 1 0', expected: '1', isSample: 1 },
    ],
    hiddenTests: [
      { input: '4\n0 10 5 2', expected: '1', isSample: 0 },
      { input: '5\n1 3 5 4 2', expected: '2', isSample: 0 },
    ],
  },
  {
    title: 'Square Root (sqrt(x))',
    slug: 'sqrtx',
    difficulty: 'Easy',
    topic_slug: 'searching',
    description: `Given a non-negative integer \`x\`, return *the square root of* \`x\` *rounded down to the nearest integer*. The returned integer should be **non-negative** as well.

You **must not use** any built-in exponent function or operator.`,
    input_format: 'Single integer x',
    output_format: 'Single integer representing floor(sqrt(x))',
    constraints: '0 <= x <= 2^31 - 1',
    examples: [
      { input: '8', output: '2', explanation: 'The square root of 8 is 2.82842..., rounding down to nearest integer yields 2.' },
      { input: '4', output: '2', explanation: 'sqrt(4) = 2.' },
    ],
    hints: [
      'Binary search on answer in range [0, x].',
      'If mid * mid <= x, record mid as potential answer and search right; else search left.',
    ],
    editorial: `### Binary Search on Monotonic Answer Range\n\nSearch $m \\in [0, x]$. Check $m \\cdot m \\le x$, shifting bounds.\n\n**Time Complexity**: $O(\\log X)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(log X)',
    space_complexity: 'O(1)',
    acceptance_rate: 38.6,
    submissions: 7400,
    accepted: 2856,
    sampleTests: [
      { input: '8', expected: '2', isSample: 1 },
      { input: '4', expected: '2', isSample: 1 },
    ],
    hiddenTests: [
      { input: '0', expected: '0', isSample: 0 },
      { input: '1', expected: '1', isSample: 0 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. SORTING (7 problems)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    title: 'Sort Colors (Dutch National Flag)',
    slug: 'sort-colors',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers \`0\`, \`1\`, and \`2\` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function in a single pass.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers (0, 1, or 2)',
    output_format: 'Space-separated sorted integers (0s, then 1s, then 2s)',
    constraints: 'n == nums.length\n1 <= n <= 300\nnums[i] is either 0, 1, or 2.',
    examples: [
      { input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2', explanation: 'Sorted in-place by colors.' },
      { input: '3\n2 0 1', output: '0 1 2', explanation: 'Red, white, blue order.' },
    ],
    hints: [
      'Dutch National Flag 3-pointer partition: low, mid, and high.',
      'Swap 0s to low++, leave 1s at mid++, and swap 2s to high--.',
    ],
    editorial: `### Dutch National Flag Algorithm\n\nMaintain $low = 0, mid = 0, high = n - 1$. While $mid \\le high$, partition elements based on value.\n\n**Time Complexity**: $O(N)$ single pass  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(1)',
    acceptance_rate: 61.3,
    submissions: 8200,
    accepted: 5026,
    sampleTests: [
      { input: '6\n2 0 2 1 1 0', expected: '0 0 1 1 2 2', isSample: 1 },
      { input: '3\n2 0 1', expected: '0 1 2', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n0', expected: '0', isSample: 0 },
      { input: '2\n1 0', expected: '0 1', isSample: 0 },
    ],
  },
  {
    title: 'Merge Sort',
    slug: 'merge-sort',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given an array of integers \`nums\`, sort the array in ascending order using the **Merge Sort** divide-and-conquer algorithm. Print the sorted elements separated by a space.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Space-separated sorted integers',
    constraints: '1 <= nums.length <= 5 * 10^4\n-5 * 10^4 <= nums[i] <= 5 * 10^4',
    examples: [
      { input: '5\n5 2 3 1 4', output: '1 2 3 4 5', explanation: 'Sorted in ascending order.' },
      { input: '6\n-4 0 7 4 9 -5', output: '-5 -4 0 4 7 9', explanation: 'Negative numbers sorted correctly.' },
    ],
    hints: [
      'Divide the array into two halves until single elements remain.',
      'Merge two sorted halves back together in linear time.',
    ],
    editorial: `### Divide and Conquer Merge Sort\n\nSplit at midpoint, sort left and right halves recursively, then merge in $O(N)$ time.\n\n**Time Complexity**: $O(N \\log N)$ guaranteed  \n**Space Complexity**: $O(N)$ auxiliary`,
    time_complexity: 'O(N log N)',
    space_complexity: 'O(N)',
    acceptance_rate: 58.7,
    submissions: 6900,
    accepted: 4050,
    sampleTests: [
      { input: '5\n5 2 3 1 4', expected: '1 2 3 4 5', isSample: 1 },
      { input: '6\n-4 0 7 4 9 -5', expected: '-5 -4 0 4 7 9', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n42', expected: '42', isSample: 0 },
      { input: '4\n3 3 2 1', expected: '1 2 3 3', isSample: 0 },
    ],
  },
  {
    title: 'Quick Sort',
    slug: 'quick-sort',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given an array of integers \`nums\`, sort the array in ascending order using the recursive **Quick Sort** algorithm with Lomuto or Hoare partitioning.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Space-separated sorted integers',
    constraints: '1 <= nums.length <= 5 * 10^4\n-5 * 10^4 <= nums[i] <= 5 * 10^4',
    examples: [
      { input: '5\n4 2 1 5 3', output: '1 2 3 4 5', explanation: 'Sorted using quicksort partitioning.' },
      { input: '4\n10 7 8 9', output: '7 8 9 10', explanation: 'Sorted integers.' },
    ],
    hints: [
      'Pick a pivot element (e.g. last element or median).',
      'Partition array so elements smaller than pivot are on left, larger on right.',
      'Recursively sort subarrays.',
    ],
    editorial: `### In-Place Partitioning Quicksort\n\nPartition around pivot, then recurse on left and right segments.\n\n**Time Complexity**: $O(N \\log N)$ average  \n**Space Complexity**: $O(\\log N)$ call stack`,
    time_complexity: 'O(N log N)',
    space_complexity: 'O(log N)',
    acceptance_rate: 56.4,
    submissions: 6100,
    accepted: 3440,
    sampleTests: [
      { input: '5\n4 2 1 5 3', expected: '1 2 3 4 5', isSample: 1 },
      { input: '4\n10 7 8 9', expected: '7 8 9 10', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n2 1', expected: '1 2', isSample: 0 },
      { input: '5\n1 1 1 1 1', expected: '1 1 1 1 1', isSample: 0 },
    ],
  },
  {
    title: 'Insertion Sort',
    slug: 'insertion-sort',
    difficulty: 'Easy',
    topic_slug: 'sorting',
    description: `Given an array of integers \`nums\`, sort the array in ascending order using **Insertion Sort**. Print the sorted array.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Space-separated sorted integers',
    constraints: '1 <= nums.length <= 1000\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: '5\n12 11 13 5 6', output: '5 6 11 12 13', explanation: 'Elements sorted in non-decreasing order.' },
      { input: '3\n3 1 2', output: '1 2 3', explanation: 'Sorted list.' },
    ],
    hints: [
      'Iterate from index 1 to n - 1. Shift elements of the sorted subarray that are greater than key to one position ahead.',
    ],
    editorial: `### Incremental Card Insertion\n\nInsert each element into its correct position within the already sorted prefix.\n\n**Time Complexity**: $O(N^2)$  \n**Space Complexity**: $O(1)$`,
    time_complexity: 'O(N^2)',
    space_complexity: 'O(1)',
    acceptance_rate: 73.1,
    submissions: 4200,
    accepted: 3070,
    sampleTests: [
      { input: '5\n12 11 13 5 6', expected: '5 6 11 12 13', isSample: 1 },
      { input: '3\n3 1 2', expected: '1 2 3', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n9', expected: '9', isSample: 0 },
      { input: '4\n4 3 2 1', expected: '1 2 3 4', isSample: 0 },
    ],
  },
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the* $k^{\\text{th}}$ *largest element in the array*.

Note that it is the $k^{\\text{th}}$ largest element in the sorted order, not the $k^{\\text{th}}$ distinct element.

Can you solve it without sorting the entire array?`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers\nLine 3: integer k',
    output_format: 'Single integer representing kth largest element',
    constraints: '1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: '6\n3 2 1 5 6 4\n2', output: '5', explanation: 'Sorted: [1,2,3,4,5,6]. 2nd largest is 5.' },
      { input: '9\n3 2 3 1 2 4 5 5 6\n4', output: '4', explanation: 'Sorted: [1,2,2,3,3,4,5,5,6]. 4th largest is 4.' },
    ],
    hints: [
      'Use a Min-Heap of size k, or use the Quickselect partitioning algorithm in O(N) average time.',
    ],
    editorial: `### Quickselect / Min-Heap\n\nMaintain a min-heap of size $k$. The top of the heap after scanning all elements will be the $k$-th largest.\n\n**Time Complexity**: $O(N \\log K)$  \n**Space Complexity**: $O(K)$`,
    time_complexity: 'O(N log K)',
    space_complexity: 'O(K)',
    acceptance_rate: 66.8,
    submissions: 8300,
    accepted: 5544,
    sampleTests: [
      { input: '6\n3 2 1 5 6 4\n2', expected: '5', isSample: 1 },
      { input: '9\n3 2 3 1 2 4 5 5 6\n4', expected: '4', isSample: 1 },
    ],
    hiddenTests: [
      { input: '1\n1\n1', expected: '1', isSample: 0 },
      { input: '2\n2 1\n1', expected: '2', isSample: 0 },
    ],
  },
  {
    title: 'Sort Characters By Frequency',
    slug: 'sort-characters-by-frequency',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given a string \`s\`, sort it in **decreasing order** based on the **frequency** of the characters. The **frequency** of a character is the number of times it appears in the string.

Return *the sorted string*. If there are multiple valid answers, return any of them.`,
    input_format: 'Single line string s',
    output_format: 'String sorted by character frequency',
    constraints: '1 <= s.length <= 5 * 10^5\ns consists of uppercase and lowercase English letters and digits.',
    examples: [
      { input: 'tree', output: 'eert', explanation: '"e" appears twice, "r" and "t" once. "eetr" is also valid.' },
      { input: 'cccaaa', output: 'aaaccc', explanation: 'Both "c" and "a" appear three times.' },
    ],
    hints: [
      'Count frequencies using a Hash Map.',
      'Bucket sort by frequency (buckets from 1 to n) or sort frequency entries descending.',
    ],
    editorial: `### Bucket Sort by Frequency\n\nCount character frequencies, then group characters into frequency buckets $1..N$ to reconstruct string in $O(N)$ time.\n\n**Time Complexity**: $O(N)$  \n**Space Complexity**: $O(N)$`,
    time_complexity: 'O(N)',
    space_complexity: 'O(N)',
    acceptance_rate: 70.2,
    submissions: 5400,
    accepted: 3790,
    sampleTests: [
      { input: 'tree', expected: 'eert', isSample: 1 },
      { input: 'cccaaa', expected: 'aaaccc', isSample: 1 },
    ],
    hiddenTests: [
      { input: 'Aabb', expected: 'bbAa', isSample: 0 },
      { input: 'z', expected: 'z', isSample: 0 },
    ],
  },
  {
    title: 'Largest Number',
    slug: 'largest-number',
    difficulty: 'Medium',
    topic_slug: 'sorting',
    description: `Given a list of non-negative integers \`nums\`, arrange them such that they form the largest number and return it as a string.

Since the result may be very large, so you need to return a string instead of an integer.`,
    input_format: 'Line 1: integer n\nLine 2: n space-separated integers',
    output_format: 'Concatenated largest number string',
    constraints: '1 <= nums.length <= 100\n0 <= nums[i] <= 10^9',
    examples: [
      { input: '5\n3 30 34 5 9', output: '9534330', explanation: 'Combinations sorted greedily by concatenated string order.' },
      { input: '2\n10 2', output: '210', explanation: '"210" > "102".' },
    ],
    hints: [
      'Convert numbers to strings and sort with custom comparator: compare (b + a) with (a + b).',
      'If the largest number after sorting is "0", the entire result is "0".',
    ],
    editorial: `### Custom Lexicographical String Sorting\n\nSort strings such that $a$ comes before $b$ if $a + b > b + a$. Edge case: if highest element is \'0\', return \'0\'.\n\n**Time Complexity**: $O(N \\log N \\cdot K)$  \n**Space Complexity**: $O(N \\cdot K)$`,
    time_complexity: 'O(N log N * K)',
    space_complexity: 'O(N * K)',
    acceptance_rate: 35.6,
    submissions: 4900,
    accepted: 1744,
    sampleTests: [
      { input: '5\n3 30 34 5 9', expected: '9534330', isSample: 1 },
      { input: '2\n10 2', expected: '210', isSample: 1 },
    ],
    hiddenTests: [
      { input: '2\n0 0', expected: '0', isSample: 0 },
      { input: '1\n1', expected: '1', isSample: 0 },
    ],
  },
];
