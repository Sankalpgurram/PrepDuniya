import db from '../config/db.js';

// ─── Table Creation ─────────────────────────────────────────────────────────

export const createCodingTables = async () => {
  const problemsTable = `
    CREATE TABLE IF NOT EXISTS coding_problems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      difficulty ENUM('easy','medium','hard') NOT NULL,
      examples JSON,
      constraints TEXT,
      tags JSON,
      starter_code JSON,
      acceptance_rate FLOAT DEFAULT 65.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const submissionsTable = `
    CREATE TABLE IF NOT EXISTS coding_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      problem_id INT NOT NULL,
      language VARCHAR(50) NOT NULL,
      code TEXT NOT NULL,
      status ENUM('accepted','wrong_answer','compilation_error','runtime_error') NOT NULL DEFAULT 'wrong_answer',
      score INT DEFAULT 0,
      feedback TEXT,
      test_cases_passed INT DEFAULT 0,
      test_cases_total INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX user_idx (user_id),
      INDEX problem_idx (problem_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    await db.query(problemsTable);
    await db.query(submissionsTable);
    console.log('Coding tables ready.');
    await seedProblems();
  } catch (error) {
    console.error('Error creating coding tables:', error);
  }
};

// ─── Seed 15 Problems (5 Easy, 5 Medium, 5 Hard) ────────────────────────────

const PROBLEMS = [
  // ── EASY ──
  {
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: 'easy',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.',
    tags: ['Array', 'Hash Table'],
    starter_code: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 52.3
  },
  {
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.
An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only.',
    tags: ['String', 'Stack'],
    starter_code: {
      javascript: 'function isValid(s) {\n  // Your code here\n}',
      python: 'def is_valid(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 49.8
  },
  {
    title: 'Reverse Linked List',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    difficulty: 'easy',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    constraints: 'The number of nodes in the list is in the range [0, 5000].\n-5000 <= Node.val <= 5000',
    tags: ['Linked List', 'Recursion'],
    starter_code: {
      javascript: 'function reverseList(head) {\n  // Your code here\n}',
      python: 'def reverse_list(head):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 75.6
  },
  {
    title: 'Palindrome Number',
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise. An integer is a palindrome when it reads the same forward and backward.`,
    difficulty: 'easy',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.' }
    ],
    constraints: '-2^31 <= x <= 2^31 - 1',
    tags: ['Math'],
    starter_code: {
      javascript: 'function isPalindrome(x) {\n  // Your code here\n}',
      python: 'def is_palindrome(x):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 57.4
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    difficulty: 'easy',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transactions are done and the max profit = 0.' }
    ],
    constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
    tags: ['Array', 'Dynamic Programming'],
    starter_code: {
      javascript: 'function maxProfit(prices) {\n  // Your code here\n}',
      python: 'def max_profit(prices):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 68.2
  },
  // ── MEDIUM ──
  {
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    difficulty: 'medium',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    starter_code: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}',
      python: 'def length_of_longest_substring(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 33.8
  },
  {
    title: '3Sum',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`. Notice that the solution set must not contain duplicate triplets.`,
    difficulty: 'medium',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' }
    ],
    constraints: '3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    starter_code: {
      javascript: 'function threeSum(nums) {\n  // Your code here\n}',
      python: 'def three_sum(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 32.7
  },
  {
    title: 'Binary Tree Level Order Traversal',
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    difficulty: 'medium',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' }
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000',
    tags: ['Tree', 'BFS', 'Binary Tree'],
    starter_code: {
      javascript: 'function levelOrder(root) {\n  // Your code here\n}',
      python: 'def level_order(root):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 67.4
  },
  {
    title: 'Product of Array Except Self',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`. The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    difficulty: 'medium',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    constraints: '2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30',
    tags: ['Array', 'Prefix Sum'],
    starter_code: {
      javascript: 'function productExceptSelf(nums) {\n  // Your code here\n}',
      python: 'def product_except_self(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 65.6
  },
  {
    title: 'Coin Change',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`. You may assume that you have an infinite number of each kind of coin.`,
    difficulty: 'medium',
    examples: [
      { input: 'coins = [1,5,11], amount = 11', output: '1', explanation: '1 coin of value 11.' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    tags: ['Array', 'Dynamic Programming', 'BFS'],
    starter_code: {
      javascript: 'function coinChange(coins, amount) {\n  // Your code here\n}',
      python: 'def coin_change(coins, amount):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 45.1
  },
  // ── HARD ──
  {
    title: 'Median of Two Sorted Arrays',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays. The overall run time complexity should be \`O(log (m+n))\`.`,
    difficulty: 'hard',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    constraints: 'nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    starter_code: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}',
      python: 'def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 38.5
  },
  {
    title: 'Trapping Rain Water',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'hard',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In total, 6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    starter_code: {
      javascript: 'function trap(height) {\n  // Your code here\n}',
      python: 'def trap(height):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int trap(int[] height) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 60.7
  },
  {
    title: 'Word Ladder',
    description: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence where every adjacent pair of words differs by a single character. Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the number of words in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or 0 if no such sequence exists.`,
    difficulty: 'hard',
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit -> hot -> dot -> dog -> cog' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' }
    ],
    constraints: '1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nwordList[i].length == beginWord.length\nAll strings consist of lowercase English letters.',
    tags: ['Hash Table', 'String', 'BFS'],
    starter_code: {
      javascript: 'function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n}',
      python: 'def ladder_length(begin_word, end_word, word_list):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 36.9
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    difficulty: 'hard',
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' }
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-1000 <= Node.val <= 1000',
    tags: ['String', 'Tree', 'DFS', 'BFS', 'Design'],
    starter_code: {
      javascript: 'function serialize(root) {\n  // Your code here\n}\n\nfunction deserialize(data) {\n  // Your code here\n}',
      python: 'def serialize(root):\n    # Your code here\n    pass\n\ndef deserialize(data):\n    # Your code here\n    pass',
      java: 'public class Codec {\n    public String serialize(TreeNode root) {\n        // Your code here\n    }\n    public TreeNode deserialize(String data) {\n        // Your code here\n    }\n}',
      cpp: 'class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        // Your code here\n    }\n    TreeNode* deserialize(string data) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 55.2
  },
  {
    title: 'N-Queens',
    description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order. Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.`,
    difficulty: 'hard',
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'There exist two distinct solutions to the 4-queens puzzle.' },
      { input: 'n = 1', output: '[["Q"]]' }
    ],
    constraints: '1 <= n <= 9',
    tags: ['Array', 'Backtracking'],
    starter_code: {
      javascript: 'function solveNQueens(n) {\n  // Your code here\n}',
      python: 'def solve_n_queens(n):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        // Your code here\n    }\n};'
    },
    acceptance_rate: 68.3
  }
];

const seedProblems = async () => {
  try {
    const [existing] = await db.query('SELECT COUNT(*) as count FROM coding_problems');
    if (existing[0].count > 0) {
      console.log('Coding problems already seeded.');
      return;
    }

    for (const p of PROBLEMS) {
      await db.query(
        `INSERT INTO coding_problems (title, description, difficulty, examples, constraints, tags, starter_code, acceptance_rate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.title, p.description, p.difficulty,
         JSON.stringify(p.examples), p.constraints,
         JSON.stringify(p.tags), JSON.stringify(p.starter_code),
         p.acceptance_rate]
      );
    }
    console.log(`✅ Seeded ${PROBLEMS.length} coding problems.`);
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// ─── DB Query Helpers ────────────────────────────────────────────────────────

export const getAllProblems = async (difficulty) => {
  let query = 'SELECT id, title, difficulty, tags, acceptance_rate FROM coding_problems';
  const params = [];
  if (difficulty && difficulty !== 'all') {
    query += ' WHERE difficulty = ?';
    params.push(difficulty);
  }
  query += ' ORDER BY FIELD(difficulty, "easy", "medium", "hard"), id';
  const [rows] = await db.query(query, params);
  return rows;
};

export const getProblemById = async (id) => {
  const [rows] = await db.query('SELECT * FROM coding_problems WHERE id = ?', [id]);
  return rows[0];
};

export const saveSubmission = async (data) => {
  const { user_id, problem_id, language, code, status, score, feedback, test_cases_passed, test_cases_total } = data;
  const [result] = await db.query(
    `INSERT INTO coding_submissions (user_id, problem_id, language, code, status, score, feedback, test_cases_passed, test_cases_total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, problem_id, language, code, status, score, feedback, test_cases_passed, test_cases_total]
  );
  return result.insertId;
};

export const getLeaderboard = async () => {
  const [rows] = await db.query(`
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(DISTINCT CASE WHEN cs.status = 'accepted' THEN cs.problem_id END) as problems_solved,
      COALESCE(SUM(CASE WHEN cs.status = 'accepted' THEN cs.score ELSE 0 END), 0) as total_score,
      COUNT(cs.id) as total_submissions
    FROM users u
    LEFT JOIN coding_submissions cs ON u.id = cs.user_id
    GROUP BY u.id, u.name, u.email
    HAVING total_score > 0
    ORDER BY total_score DESC, problems_solved DESC
    LIMIT 50
  `);
  return rows;
};

export const getUserHistory = async (user_id) => {
  const [rows] = await db.query(`
    SELECT cs.*, cp.title, cp.difficulty
    FROM coding_submissions cs
    JOIN coding_problems cp ON cs.problem_id = cp.id
    WHERE cs.user_id = ?
    ORDER BY cs.created_at DESC
    LIMIT 20
  `, [user_id]);
  return rows;
};

export const getUserSolvedSet = async (user_id) => {
  const [rows] = await db.query(
    `SELECT DISTINCT problem_id FROM coding_submissions WHERE user_id = ? AND status = 'accepted'`,
    [user_id]
  );
  return new Set(rows.map(r => r.problem_id));
};
