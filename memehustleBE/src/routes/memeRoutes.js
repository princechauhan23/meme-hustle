import express from 'express';
import { MemeService } from '../services/memeService.js';
import { validateMeme } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getMockUsers } from '../middleware/auth.js';

const router = express.Router();

// Create a new meme
router.post('/', validateMeme, asyncHandler(async (req, res) => {
  const { title, image_url, tags } = req.body;

  // Use default values if not provided
  const memeData = {
    title: title || 'Untitled Meme',
    image_url: image_url || 'https://picsum.photos/200',
    tags: tags || ['default']
  };

  const user = getMockUsers().find(u => u.id === req.user.id);

  const meme = await MemeService.createMeme(memeData, req.user.id, user);

  res.status(201).json({
    success: true,
    data: meme,
    message: 'Meme created successfully'
  });
}));

// Get memes with filtering
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    tags: req.query.tags ? req.query.tags : undefined,
    owner_id: req.query.owner_id ? parseInt(req.query.owner_id) : undefined,
    search: req.query.search,
    sort_by: req.query.sort_by || 'created_at',
    sort_order: req.query.sort_order || 'desc'
  };

  const memes = await MemeService.getMemes(filters);

  res.json({
    success: true,
    data: memes,
    filters: Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))
  });
}));

// Get specific meme by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const memeId = parseInt(req.params.id);

  if (isNaN(memeId)) {
    return res.status(400).json({
      error: 'Invalid meme ID',
      message: 'Meme ID must be a number'
    });
  }

  const meme = await MemeService.getMemeById(memeId);

  if (!meme) {
    return res.status(404).json({
      error: 'Meme not found',
      message: `Meme with ID ${memeId} does not exist`
    });
  }

  res.json({
    success: true,
    data: meme
  });
}));

// Get trending memes leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const timeframe = req.query.timeframe || 'all';

  const memes = await MemeService.getTrendingMemes(limit, timeframe);

  res.json({
    success: true,
    data: memes,
    filters: {
      limit,
      timeframe
    }
  });
}));

// Regenerate AI caption for a meme
router.post('/:id/regenerate-caption', asyncHandler(async (req, res) => {
  const memeId = parseInt(req.params.id);

  if (isNaN(memeId)) {
    return res.status(400).json({
      error: 'Invalid meme ID',
      message: 'Meme ID must be a number'
    });
  }

  const caption = await MemeService.regenerateCaption(memeId);

  res.json({
    success: true,
    data: caption,
    message: 'Caption regenerated successfully'
  });
}));

// Get trending tags
router.get('/tags/trending', asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const trendingTags = await MemeService.getTrendingTags(limit);

  res.json({
    success: true,
    data: trendingTags,
    message: 'Trending tags retrieved successfully'
  });
}));

export default router;