import express from 'express';
import { startInterview, nextInterviewStep, submitInterview } from '../controllers/interviewController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protectRoute, startInterview);
router.post('/next', protectRoute, nextInterviewStep);
router.post('/submit', protectRoute, submitInterview);

export default router;
