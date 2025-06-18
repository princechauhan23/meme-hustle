import { supabase } from '../config/database.js';
import { AIService } from './aiService.js';
import { CacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

export class MemeService {
  static async createMeme(memeData, userId, user) {
    try {
      // Validate and sanitize inputs
      const { title, image_url, tags } = memeData;

      // Generate AI content
      const { caption, vibe } = await AIService.generateBoth(tags, title);

      const meme = {
        title,
        image_url,
        tags,
        owner_id: userId,
        author: user.username,
        author_avatar: user.avatar,
        upvotes: 0,
        downvotes: 0,
        ai_caption: caption,
        vibe_analysis: vibe,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('memes')
        .insert([meme])
        .select()
        .single();

      if (error) throw error;

      // Invalidate leaderboard cache
      CacheService.invalidateLeaderboard();

      logger.info(`Created meme: ${data.title} by user ${userId}`);
      return data;
    } catch (error) {
      logger.error('Failed to create meme:', error.message);
      throw error;
    }
  }

  static async getMemes(filters = {}) {
    try {
      let query = supabase
        .from('memes')
        .select(`
          *,
          bids:bids(count)
        `);

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Failed to get memes:', error.message);
      throw error;
    }
  }

  static async getMemeById(id) {
    try {
      const { data, error } = await supabase
        .from('memes')
        .select(`
          *,
          bids:bids(
            id,
            credits,
            user_id,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error(`Failed to get meme ${id}:`, error.message);
      throw error;
    }
  }

  static async voteOnMeme(memeId, type, userId) {
    try {
      const { data: meme, error: fetchError } = await supabase
        .from('memes')
        .select('id, upvotes, downvotes')
        .eq('id', memeId)
        .single();

      if (fetchError) throw fetchError;
      if (!meme) throw new Error('Meme not found');

      // Increment in JS
      let update = {};
      if (type === 'up') {
        update = { upvotes: (meme.upvotes || 0) + 1 };
      } else {
        update = { downvotes: (meme.downvotes || 0) + 1 };
      }

      const { data, error } = await supabase
        .from('memes')
        .update(update)
        .eq('id', memeId)
        .select()
        .single();

      if (error) throw error;

      CacheService.invalidateLeaderboard();

      logger.info(`User ${userId} ${type === 'up' ? 'upvoted' : 'downvoted'} meme ${memeId}`);
      return data;
    } catch (error) {
      logger.error(`Failed to vote on meme ${memeId}:`, error && error.message ? error.message : error);
      throw error;
    }
  }

  static async getTrendingMemes(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(limit);

      if (error) throw error;

      logger.debug(`Retrieved ${data.length} memes for leaderboard`);
      return data;
    } catch (error) {
      logger.error('Failed to get trending memes:', error && error.message ? error.message : error);
      throw error;
    }
  }

  static async regenerateCaption(memeId) {
    try {
      // Get meme details
      const { data: meme } = await supabase
        .from('memes')
        .select('title, tags')
        .eq('id', memeId)
        .single();

      if (!meme) {
        throw new Error('Meme not found');
      }

      // Generate new caption using AI
      const caption = await AIService.generateCaption(meme.tags, meme.title);

      // Update meme in database
      const { data, error } = await supabase
        .from('memes')
        .update({ caption })
        .eq('id', memeId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Regenerated caption for meme ${memeId}: ${caption}`);
      return data;
    } catch (error) {
      logger.error(`Failed to regenerate caption for meme ${memeId}:`, error.message);
      throw error;
    }
  }

  static async getTrendingTags(limit = 10) {
    try {
      const cacheKey = `trending_tags_${limit}`;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return cached;
      }

      // Get all tags from recent memes
      const { data, error } = await supabase
        .from('memes')
        .select('tags')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count tag occurrences
      const tagCounts = {};
      data.forEach(meme => {
        meme.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      // Sort and limit
      const trendingTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }));

      // Cache for 1 hour
      CacheService.set(cacheKey, trendingTags, 3600);

      return trendingTags;
    } catch (error) {
      logger.error('Failed to get trending tags:', error.message);
      throw error;
    }
  }
}