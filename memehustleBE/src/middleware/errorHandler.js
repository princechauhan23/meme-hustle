import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Supabase errors
  if (err.message?.includes('duplicate key')) {
    error = {
      message: 'Resource already exists',
      status: 409
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      details: err.details,
      status: 400
    };
  }

  // Rate limit errors
  if (err.message?.includes('Too many requests')) {
    error = {
      message: 'Rate limit exceeded',
      status: 429
    };
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: error.details 
    })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};