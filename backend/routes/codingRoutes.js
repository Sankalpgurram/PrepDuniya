import express from 'express';
import { getProblems, getProblem, submitCode, fetchLeaderboard, fetchHistory } from '../controllers/codingController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/problems', protectRoute, getProblems);
router.get('/problems/:id', protectRoute, getProblem);
router.post('/submit', protectRoute, submitCode);
router.get('/leaderboard', protectRoute, fetchLeaderboard);
router.get('/history', protectRoute, fetchHistory);

export default router;
