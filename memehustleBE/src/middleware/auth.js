import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Mock users for development
const MOCK_USERS = [
  { id: 1, username: 'mememaster', email: 'meme@example.com', password: 'meme', credits: 1000, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, username: 'vibelord', email: 'vibe@example.com', password: 'meme', credits: 750, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, username: 'stonksguy', email: 'stonks@example.com', password: 'meme', credits: 500, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, username: 'cryptoqueen', email: 'crypto@example.com', password: 'meme', credits: 2000, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, username: 'nftnoob', email: 'nft@example.com', password: 'meme', credits: 100, avatar: 'https://i.pravatar.cc/150?u=5' }
];

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authorization token required',
      message: 'Please provide a valid bearer token'
    });
  }

  const token = authHeader.substring(7);

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
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

    req.user = user;
    logger.debug(`Authenticated user: ${user.username}`);
    next();
  });
};

export const getMockUsers = () => MOCK_USERS;

export const updateUserCredits = (userId, creditChange) => {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    user.credits += creditChange;
    return user;
  }
  return null;
};