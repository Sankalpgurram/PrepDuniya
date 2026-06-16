import express from 'express';
import { getQuestions, createQuestion, editQuestion, removeQuestion } from '../controllers/adminController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protectRoute, isAdmin);

router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', editQuestion);
router.delete('/questions/:id', removeQuestion);

export default router;
