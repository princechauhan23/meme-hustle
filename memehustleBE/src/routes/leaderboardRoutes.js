import express from 'express';
import { LeaderboardService } from '../services/leaderboardService.js';
import { validateLeaderboardQuery } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get top memes leaderboard
router.get('/memes', validateLeaderboardQuery, asyncHandler(async (req, res) => {
  const { top, timeframe, category } = req.query;
  
  const topMemes = await LeaderboardService.getTopMemes(top, timeframe, category);
  
  res.json({
    success: true,
    data: topMemes,
    filters: {
      top,
      timeframe,
      category
    },
    generated_at: new Date().toISOString()
  });
}));

export default router;