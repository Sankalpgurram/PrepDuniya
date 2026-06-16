import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { findUserByEmail, createUser, findUserById, updateProfile, updatePassword } from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      if (existingUser.is_google_user) {
        return res.status(400).json({ success: false, message: 'Email already registered via Google Sign-In. Please login with Google.', data: null });
      }
      return res.status(400).json({ success: false, message: 'Email is already registered.', data: null });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const insertId = await createUser({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
      is_google_user: false
    });

    const token = generateToken(insertId, 'user');

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: { id: insertId, name, email, role: 'user' },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }

    if (user.is_google_user) {
      return res.status(400).json({ success: false, message: 'This account was created via Google. Please login with Google.', data: null });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_picture: user.profile_picture },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential token is missing', data: null });
    }

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not extract email from Google identity', data: null });
    }

    // Check if user already exists
    let user = await findUserByEmail(email);

    if (!user) {
      // Create a new user for Google Sign-In
      const insertId = await createUser({
        name,
        email,
        password: null, // No password for Google users
        profile_picture: picture,
        is_google_user: true,
        provider: 'google'
      });
      user = await findUserById(insertId);
    }

    if (user && !user.is_google_user) {
      // Email exists, but it's a local account!
      // Wait, we can optionally link it or throw an error. Let's throw an error for now.
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists and it uses password login. Please login with your password.',
        data: null
      });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email, profile_picture: user.profile_picture, role: user.role },
        token
      }
    });

  } catch (error) {
    console.error("Google Auth Error", error);
    res.status(401).json({ success: false, message: 'Google token verification failed', data: null });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    res.status(200).json({ success: true, message: 'Profile fetched', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { name, profile_picture, preferences } = req.body;
    await updateProfile(req.user.id, { name, profile_picture, preferences });
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: null });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await findUserById(req.user.id);

    if (!user.password && user.is_google_user) {
      return res.status(400).json({ success: false, message: 'Google users cannot change password', data: null });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updatePassword(req.user.id, hashedPassword);

    res.status(200).json({ success: true, message: 'Password changed successfully', data: null });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded', data: null });
    }

    const relativePath = `uploads/${req.file.filename}`;
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    // Save profile picture path to user row
    await updateProfile(req.user.id, {
      name: user.name,
      profile_picture: relativePath,
      preferences: user.preferences
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profile_picture: relativePath }
    });
  } catch (error) {
    next(error);
  }
};
