import express from 'express';
import { analyzeResume } from '../controllers/resumeController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze', protectRoute, upload.single('resume'), analyzeResume);

export default router;
