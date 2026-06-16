import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided', data: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: 1, iat: ..., exp: ... }
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    let message = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') {
      message = 'Not authorized, token expired';
    }
    return res.status(401).json({ success: false, message, data: null });
  }
};
