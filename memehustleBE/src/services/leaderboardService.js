import { supabase } from '../config/database.js';
import { CacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

export class LeaderboardService {
  static async getTopMemes(limit = 10, timeframe = 'all', category = 'upvotes') {
    try {
      const cacheKey = `top_memes_${limit}_${timeframe}_${category}`;
      const cached = CacheService.getLeaderboard(cacheKey);
      
      if (cached) {
        return cached;
      }

      let query = supabase
        .from('memes')
        .select(`
          id,
          title,
          image_url,
          tags,
          upvotes,
          owner_id,
          created_at,
          ai_caption,
          vibe_analysis,
          bids:bids(count)
        `);

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

      // Apply sorting based on category
      switch (category) {
        case 'upvotes':
          query = query.order('upvotes', { ascending: false });
          break;
        case 'bids':
          // This would need a more complex query to sort by bid count
          query = query.order('created_at', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('upvotes', { ascending: false });
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      // Add ranking
      const rankedMemes = data.map((meme, index) => ({
        ...meme,
        rank: index + 1,
        bid_count: meme.bids?.[0]?.count || 0
      }));

      // If category is bids, re-sort by bid count
      if (category === 'bids') {
        rankedMemes.sort((a, b) => b.bid_count - a.bid_count);
        rankedMemes.forEach((meme, index) => {
          meme.rank = index + 1;
        });
      }

      // Cache the result
      CacheService.setLeaderboard(cacheKey, rankedMemes);

      logger.debug(`Retrieved top ${limit} memes for ${timeframe} timeframe, ${category} category`);
      return rankedMemes;
    } catch (error) {
      logger.error('Failed to get top memes:', error.message);
      throw error;
    }
  }
}