import { BidService } from '../services/bidService.js';
import { MemeDuelService } from '../services/memeDuelService.js';
import { MemeService } from '../services/memeService.js';
import { logger } from '../utils/logger.js';

export const setupSocketHandlers = (io, allowedEvents) => {
  io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // Join user to their personal room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      logger.debug(`User ${userId} joined personal room`);
    });

    // Join leaderboard room for real-time leaderboard updates
    socket.on('join_leaderboard', () => {
      socket.join('leaderboard');
      logger.debug(`Socket ${socket.id} joined leaderboard room`);
    });

    // Handle vote events
    socket.on('vote', async ({ memeId, voteType, userId }) => {
      try {
        // Update vote in DB
        const updatedMeme = await MemeService.voteOnMeme(memeId, voteType, userId);
        // Broadcast updated vote counts to all clients
        io.emit('voteUpdate', {
          memeId,
          voteType,
          upvotes: updatedMeme.upvotes,
          downvotes: updatedMeme.downvotes,
        });
      } catch (error) {
        logger.error('Vote error:', error.message);
        socket.emit('error', { message: 'Failed to register vote.' });
      }
    });

    // Handle bid events
    socket.on('bid', async ({ memeId, bidAmount, userId }) => {
      try {
        // Place bid in DB
        const bid = await BidService.createBid({ meme_id: memeId, credits: bidAmount }, userId);
        // Optionally, fetch updated meme/bid info if needed
        io.emit('bidUpdate', {
          memeId,
          bidAmount,
          userId,
          username: bid.username
        });
      } catch (error) {
        logger.error('Bid error:', error.message);
        socket.emit('error', { message: 'Failed to place bid.' });
      }
    });

    socket.on('leaderboard', async ({ top } = {}) => {
      try {
        const limit = (typeof top === 'number' && top > 0) ? top : 10;
        const leaderboard = await MemeService.getTrendingMemes(limit);
        io.emit('leaderboardUpdate', leaderboard);
      } catch (error) {
        logger.error('Leaderboard error:', error && error.message ? error.message : error);
        socket.emit('error', { message: 'Failed to fetch leaderboard.' });
      }
    });

    socket.on('getBattles', async () => {
      try {
        const battles = await MemeDuelService.getBattles();
        io.emit('battlesUpdate', battles);
      } catch (error) {
        logger.error('Battles error:', error && error.message ? error.message : error);
        io.emit('error', { message: 'Failed to fetch battles.' });
      }
    });

    socket.on('endBattle', async ({ battleId }) => {
      try {
        const battle = await MemeDuelService.endBattle(battleId);
        io.emit('battleUpdate', battle);
      } catch (error) {
        logger.error('Battle error:', error && error.message ? error.message : error);
        io.emit('error', { message: 'Failed to end battle.' });
      }
    });

    socket.on('memeDuelvote', async ({ memeId, battleId }) => {
      try {
        await MemeDuelService.voteOnBattle(memeId, battleId);
        const battles = await MemeDuelService.getBattles();
        io.emit('battlesUpdate', battles);
      } catch (error) {
        logger.error('Battle error:', error && error.message ? error.message : error);
        io.emit('error', { message: 'Failed to vote on battle.' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    // Send initial connection success
    socket.emit('connected', {
      message: 'Connected to MemeHustle real-time server',
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Emit real-time events - Only for allowed events
  const emitEvent = (event, data) => {
    if (!allowedEvents.includes(event)) return;

    io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });

    logger.debug(`Emitted ${event}`);
  };

  const emitBidPlaced = (bid, meme) => {
    emitEvent('bid_placed', {
      bid,
      meme
    });

    // Notify meme owner
    if (meme.owner_id) {
      emitEvent('bid_received', {
        bid,
        meme
      });
    }

    logger.debug(`Emitted bid_placed for meme ${bid.meme_id}`);
  };

  const emitLeaderboardUpdate = () => {
    emitEvent('leaderboard_update', {});
    emitEvent('leaderboard_changed', {});
    logger.debug('Emitted leaderboard updates');
  };

  // Export event emitters
  io.emitBidPlaced = emitBidPlaced;
  io.emitLeaderboardUpdate = emitLeaderboardUpdate;

  // Return socket instance
  return io;
};

// Socket event documentation
export const socketEvents = {
  // Client -> Server events
  clientEvents: {
    join_user_room: 'Join user room for personal notifications',
    join_leaderboard: 'Join leaderboard room for real-time updates'
  },

  // Server -> Client events
  serverEvents: {
    connected: 'Initial connection confirmation',
    bid_placed: 'New bid placed on a meme',
    bid_received: 'User received a bid on their meme',
    leaderboard_update: 'Leaderboard rankings updated',
    leaderboard_changed: 'Leaderboard changed'
  }
};