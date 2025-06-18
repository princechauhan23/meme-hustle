import express from 'express';
import { BidService } from '../services/bidService.js';
import { MemeService } from '../services/memeService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Place a bid on a meme
router.post('/:memeId', asyncHandler(async (req, res) => {
  const { memeId } = req.params;
  const { credits } = req.body;
  
  // Mock user ID for testing
  const userId = 'cyberpunk420';
  
  // Validate credits (allow any positive number for simplicity)
  if (typeof credits !== 'number' || credits <= 0) {
    return res.status(400).json({
      error: 'Invalid credits',
      message: 'Credits must be a positive number'
    });
  }
  
  // Create bid
  const bid = await BidService.createBid({
    meme_id: parseInt(memeId),
    credits
  }, userId);
  
  // Get meme details
  const meme = await MemeService.getMemeById(parseInt(memeId));
  
  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.emitBidPlaced(bid, meme);
  }
  
  res.status(201).json({
    success: true,
    data: {
      bid,
      message: `${userId} bid ${credits} credits on meme ${memeId}`
    }
  });
}));

// Get bids for a specific meme
router.get('/meme/:memeId', asyncHandler(async (req, res) => {
  const memeId = parseInt(req.params.memeId);
  
  if (isNaN(memeId)) {
    return res.status(400).json({
      error: 'Invalid meme ID',
      message: 'Meme ID must be a number'
    });
  }
  
  const bids = await BidService.getBidsForMeme(memeId);
  
  res.json({
    success: true,
    data: bids,
    total: bids.length
  });
}));

export default router;