import express from 'express';
import { MemeDuelService } from '../services/memeDuelService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/start', asyncHandler(async (req, res) => {
  const { meme1, meme2, timer, host } = req.body;

  try {
    const duel = await MemeDuelService.startMemeDuel(meme1, meme2, timer, host);
    res.status(201).json({ success: true, data: duel });
  } catch (error) {
    logger.error(`Error starting meme duel: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}));

export default router;
