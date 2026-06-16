import express from 'express';
import { signup, login, googleAuth, getProfile, updateUserInfo, changePassword, uploadProfilePicture } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { validateSignup, validateLogin } from '../middleware/validationMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.get('/profile', protectRoute, getProfile);
router.put('/profile/update', protectRoute, updateUserInfo);
router.put('/change-password', protectRoute, changePassword);
router.post('/profile/upload-pic', protectRoute, uploadImage.single('profile_picture'), uploadProfilePicture);

export default router;
