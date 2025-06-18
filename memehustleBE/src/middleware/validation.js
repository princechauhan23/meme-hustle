import Joi from 'joi';
import { logger } from '../utils/logger.js';

export const validateMeme = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    image_url: Joi.string().uri().required(),
    tags: Joi.array().items(Joi.string().min(1).max(50)).min(1).max(10).required(),
    description: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    logger.warn('Meme validation failed:', error.details);
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
};

export const validateBid = (req, res, next) => {
  const schema = Joi.object({
    meme_id: Joi.number().integer().positive().required(),
    credits: Joi.number().integer().positive().min(1).max(1000).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    logger.warn('Bid validation failed:', error.details);
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  
  next();
};

export const validateLeaderboardQuery = (req, res, next) => {
  const schema = Joi.object({
    top: Joi.number().integer().positive().max(100).default(10),
    timeframe: Joi.string().valid('day', 'week', 'month', 'all').default('all'),
    category: Joi.string().valid('upvotes', 'bids', 'recent').default('upvotes')
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    logger.warn('Leaderboard query validation failed:', error.details);
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: error.details.map(d => d.message)
    });
  }
  
  req.query = value;
  next();
};