// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import dotenv from 'dotenv';
// import { logger } from './utils/logger.js';
// import { errorHandler } from './middleware/errorHandler.js';
// import { authMiddleware } from './middleware/auth.js';
// import memeRoutes from './routes/memeRoutes.js';
// import bidRoutes from './routes/bidRoutes.js';
// import leaderboardRoutes from './routes/leaderboardRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import memeDuelRoutes from './routes/memeDuelRoutes.js';
// import { setupSocketHandlers } from './socket/socketHandlers.js';

// dotenv.config();

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CORS_ORIGIN,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   }
// });

// const PORT = process.env.PORT || 3000;

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));
// app.use(limiter);
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/memes', authMiddleware, memeRoutes);
// app.use('/api/bids', authMiddleware, bidRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/memeDuel', authMiddleware, memeDuelRoutes);

// // Socket.io setup - Only for bidding and voting
// setupSocketHandlers(io, ['bid_received', 'bid_placed', 'leaderboard_update', 'leaderboard_changed']);

// // Make io available to routes
// app.set('io', io);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Route not found',
//     path: req.originalUrl
//   });
// });

// // Error handling middleware
// app.use(errorHandler);

// server.listen(PORT, () => {
//   logger.info(`🚀 MemeHustle server running on port ${PORT}`);
//   logger.info(`📡 Socket.io server ready for real-time connections`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received, shutting down gracefully');
//   server.close(() => {
//     logger.info('Process terminated');
//     process.exit(0);
//   });
// });

// export { app, io };