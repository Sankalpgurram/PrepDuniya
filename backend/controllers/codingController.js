import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import {
  getAllProblems, getProblemById, saveSubmission,
  getLeaderboard, getUserHistory, getUserSolvedSet
} from '../models/codingModel.js';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cleanJSON = (text) => {
  try {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
};

const SCORE_MAP = { easy: 100, medium: 200, hard: 300 };

// GET /api/coding/problems
export const getProblems = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const problems = await getAllProblems(difficulty);

    let solvedSet = new Set();
    if (req.user?.id) {
      solvedSet = await getUserSolvedSet(req.user.id);
    }

    const enriched = problems.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
      solved: solvedSet.has(p.id)
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error('getProblems error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch problems' });
  }
};

// GET /api/coding/problems/:id
export const getProblem = async (req, res) => {
  try {
    const problem = await getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    // Parse JSON fields
    problem.examples = typeof problem.examples === 'string' ? JSON.parse(problem.examples) : problem.examples;
    problem.tags = typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags;
    problem.starter_code = typeof problem.starter_code === 'string' ? JSON.parse(problem.starter_code) : problem.starter_code;

    res.status(200).json({ success: true, data: problem });
  } catch (err) {
    console.error('getProblem error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch problem' });
  }
};

// POST /api/coding/submit
export const submitCode = async (req, res) => {
  try {
    const { problem_id, language, code } = req.body;
    if (!problem_id || !language || !code) {
      return res.status(400).json({ success: false, message: 'Missing required fields: problem_id, language, code' });
    }

    const problem = await getProblemById(problem_id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const examples = typeof problem.examples === 'string' ? JSON.parse(problem.examples) : problem.examples;
    const examplesStr = examples.map((e, i) => `Example ${i + 1}: Input: ${e.input}, Expected Output: ${e.output}`).join('\n');

    const prompt = `
You are an expert competitive programming judge evaluating a code submission.

## Problem: ${problem.title}
**Difficulty:** ${problem.difficulty}
**Description:** ${problem.description}

**Examples:**
${examplesStr}

**Constraints:** ${problem.constraints}

## Candidate's Submission (${language}):
\`\`\`${language}
${code}
\`\`\`

## Evaluation Task:
Evaluate this code submission strictly and professionally. Check:
1. Does the logic correctly solve the problem for all cases?
2. Does it handle edge cases from the constraints?
3. Is the time/space complexity reasonable?

Return ONLY a strict JSON object:
{
  "status": "accepted" | "wrong_answer" | "compilation_error" | "runtime_error",
  "test_cases_passed": number,
  "test_cases_total": ${examples.length + 2},
  "feedback": "Detailed, specific feedback about the solution (2-3 sentences)",
  "time_complexity": "e.g., O(n)",
  "space_complexity": "e.g., O(n)",
  "hints": ["hint 1 if wrong", "hint 2 if wrong"]
}

Be strict but fair. If the logic is fundamentally correct even with minor syntax issues in the language, mark as accepted.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const evaluation = cleanJSON(result.response.text());

    const isAccepted = evaluation.status === 'accepted';
    const score = isAccepted ? SCORE_MAP[problem.difficulty] || 100 : 0;

    // Save submission to DB
    if (req.user?.id) {
      await saveSubmission({
        user_id: req.user.id,
        problem_id,
        language,
        code,
        status: evaluation.status,
        score,
        feedback: evaluation.feedback,
        test_cases_passed: evaluation.test_cases_passed || 0,
        test_cases_total: evaluation.test_cases_total || examples.length + 2
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...evaluation,
        score,
        problem_title: problem.title,
        difficulty: problem.difficulty
      }
    });
  } catch (err) {
    console.error('submitCode error:', err);
    res.status(500).json({ success: false, message: 'Code evaluation failed. Please try again.' });
  }
};

// GET /api/coding/leaderboard
export const fetchLeaderboard = async (req, res) => {
  try {
    const board = await getLeaderboard();
    const ranked = board.map((user, idx) => ({
      rank: idx + 1,
      ...user
    }));
    res.status(200).json({ success: true, data: ranked });
  } catch (err) {
    console.error('fetchLeaderboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

// GET /api/coding/history
export const fetchHistory = async (req, res) => {
  try {
    const history = await getUserHistory(req.user.id);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error('fetchHistory error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submission history' });
  }
};
