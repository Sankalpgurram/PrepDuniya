import express from 'express';
import { getJobs } from '../controllers/jobController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getJobs);

export default router;
