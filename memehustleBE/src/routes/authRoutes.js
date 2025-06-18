import express from 'express';
import { getMockUsers } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Get all available users (for development/demo)
router.get('/users', asyncHandler(async (req, res) => {
  const users = getMockUsers().map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    credits: user.credits
  }));
  
  res.json({
    success: true,
    data: users,
    message: 'Available users for authentication'
  });
}));

// Mock login - returns user data and token
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = getMockUsers().find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        username: user.username,
        avatar: user.avatar
      }
    }
  });
}));

// Get current user info (requires auth)
router.get('/me', (req, res, next) => {
  // Apply auth middleware manually for this route
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization token required',
      message: 'Please provide a valid bearer token'
    });
  }
  
  const token = authHeader.substring(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found or token expired'
      });
    }
    
    const userId = decoded.userId;
    const user = getMockUsers().find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found or token expired'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        credits: user.credits
      }
    });
  });
});

// Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    endpoints: {
      'GET /api/auth/users': 'Get all available users for demo',
      'POST /api/auth/login': 'Login with email and password',
      'GET /api/auth/me': 'Get current user info (requires auth)'
    },
    authentication: {
      type: 'JWT Token',
      description: 'Use JWT token in Authorization header',
      example: 'Authorization: Bearer <your-jwt-token>'
    },
    available_users: getMockUsers().map(u => ({
      id: u.id,
      username: u.username,
      email: u.email
    }))
  });
});

export default router;