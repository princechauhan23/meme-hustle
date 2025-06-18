import { supabase } from '../config/database.js';
import { CacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';
import { getMockUsers } from '../middleware/auth.js';

export class BidService {
  static async createBid(bidData, userId) {
    try {
      // For mock auth, we'll use hardcoded user data
      const users = getMockUsers();
      const mockUser = users.find(user => user.id === userId);

      // Check if meme exists
      const { data: meme } = await supabase
        .from('memes')
        .select('id, owner_id, title')
        .eq('id', bidData.meme_id)
        .single();

      if (!meme) {
        throw new Error('Meme not found');
      }

      // Create bid
      const bid = {
        meme_id: bidData.meme_id,
        user_id: userId,
        credits: bidData.credits,
        created_at: new Date().toISOString(),
        username: mockUser.username // For display purposes
      };

      const { data, error } = await supabase
        .from('bids')
        .insert([bid])
        .select()
        .single();

      if (error) throw error;

      // Invalidate leaderboard cache
      CacheService.invalidateLeaderboard();

      logger.info(`User ${userId} placed bid of ${bidData.credits} credits on meme ${meme.title}`);
      return data;
    } catch (error) {
      logger.error('Failed to create bid:', error.message);
      throw error;
    }
  }

  // static async getBidsForMeme(memeId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('bids')
  //       .select(`
  //         *,
  //         meme:memes(title)
  //       `)
  //       .eq('meme_id', memeId)
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;

  //     return data;
  //   } catch (error) {
  //     logger.error(`Failed to get bids for meme ${memeId}:`, error.message);
  //     throw error;
  //   }
  // }

  static async getUserBids(userId) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          meme:memes(
            id,
            title,
            image_url,
            upvotes
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error(`Failed to get user bids for user ${userId}:`, error.message);
      throw error;
    }
  }

  static async getTopBidders(limit = 10, timeframe = 'all') {
    try {
      const cacheKey = `top_bidders_${limit}_${timeframe}`;
      const cached = CacheService.getLeaderboard(cacheKey);
      
      if (cached) {
        return cached;
      }

      let query = supabase
        .from('bids')
        .select('user_id, credits');

      // Apply timeframe filter
      if (timeframe !== 'all') {
        const timeMap = {
          'day': 1,
          'week': 7,
          'month': 30
        };
        const days = timeMap[timeframe] || 7;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', cutoff);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Aggregate credits by user
      const userTotals = {};
      data.forEach(bid => {
        userTotals[bid.user_id] = (userTotals[bid.user_id] || 0) + bid.credits;
      });

      // Sort and format
      const topBidders = Object.entries(userTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([userId, totalCredits], index) => ({
          rank: index + 1,
          user_id: parseInt(userId),
          total_credits: totalCredits
        }));

      // Cache the result
      CacheService.setLeaderboard(cacheKey, topBidders);

      return topBidders;
    } catch (error) {
      logger.error('Failed to get top bidders:', error.message);
      throw error;
    }
  }
}