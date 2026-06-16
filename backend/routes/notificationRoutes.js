import express from 'express';
import { getNotifications, addNotification, markRead, markAllRead } from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.post('/', protectRoute, addNotification);
router.put('/:id/read', protectRoute, markRead);
router.put('/read-all', protectRoute, markAllRead);

export default router;
