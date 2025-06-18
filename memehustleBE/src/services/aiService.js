import { getGeminiModel, fallbackCaptions, fallbackVibes, genAI } from '../config/gemini.js';
import { CacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

const AI_CACHE_TTL = 3600; // 1 hour cache
const MODEL_CONFIG = {
  model: 'gemini-2-flash', // Using Gemini 2.0 Flash for speed
  temperature: 0.7,
  maxOutputTokens: 100,
  topP: 0.8,
  topK: 40,
};

export class AIService {
  static async generateCaption(tags, title = '') {
    if (!genAI) {
      logger.warn('Gemini API not available, using fallback caption');
      return this.getFallbackCaption();
    }

    
    try {
      const prompt = `Generate a funny, witty caption for a meme with these tags: ${tags.join(', ')}${title ? ` and title: "${title}"` : ''}. Keep it under 100 characters, use internet slang, and make it engaging. Don't include quotes in the response.`;
      const cacheKey = `caption_${tags.join('_')}_${title}`;
      const cached = CacheService.get(cacheKey);
      if (cached) {
        logger.debug('Using cached AI caption');
        return cached;
      }

      const result = await getGeminiModel(prompt);
      logger.debug(result, "result1");
      const caption = result.response;
      logger.debug(caption, "caption");

      CacheService.set(cacheKey, caption, AI_CACHE_TTL);
      logger.info(`Generated AI caption: ${caption.substring(0, 50)}...`);
      return caption;
    } catch (error) {
      logger.error('Failed to generate AI caption:', error);
      return this.getFallbackCaption();
    }
  }

  static async generateVibeAnalysis(tags, title = '') {
    if (!genAI) {
      logger.warn('Gemini API not available, using fallback vibe');
      return this.getFallbackVibe();
    }
  
    try {
      const prompt = `You are a meme expert. Analyze the vibe/mood of a meme with these tags: ${tags.join(', ')}. 
      Respond with ONLY a short 2-4 word phrase describing the vibe/energy (like "Retro Stonks Vibes", "Chaotic Good Energy", etc.). 
      Use internet culture terms and be creative. No explanation needed.`;
      
      const cacheKey = `vibe_${tags.join('_')}_${title}`;
      const cached = CacheService.get(cacheKey);
      if (cached) {
        logger.debug('Using cached AI vibe analysis');
        return cached;
      }
  
      const result = await getGeminiModel(prompt);
      logger.debug(result, "result");
      const vibe = result.response.trim();
      logger.debug(vibe, "vibe");
  
      // Validate the response
      if (!vibe || vibe.length > 50) {
        logger.warn('Invalid vibe response, using fallback');
        return this.getFallbackVibe();
      }
  
      CacheService.set(cacheKey, vibe, AI_CACHE_TTL);
      logger.info(`Generated AI vibe: ${vibe}`);
      return vibe;
    } catch (error) {
      logger.error('Failed to generate AI vibe analysis:', error);
      return this.getFallbackVibe();
    }
  }

  static getFallbackCaption() {
    const randomIndex = Math.floor(Math.random() * fallbackCaptions.length);
    const caption = fallbackCaptions[randomIndex];
    logger.debug(`Using fallback caption: ${caption}`);
    return caption;
  }

  static getFallbackVibe() {
    const randomIndex = Math.floor(Math.random() * fallbackVibes.length);
    const vibe = fallbackVibes[randomIndex];
    logger.debug(`Using fallback vibe: ${vibe}`);
    return vibe;
  }

  static async generateBoth(tags, title = '') {
    try {
      // First check if API is available
      if (!genAI) {
        logger.warn('Gemini API not available, using fallbacks');
        return {
          caption: this.getFallbackCaption(),
          vibe: this.getFallbackVibe()
        };
      }
  
      const [caption, vibe] = await Promise.all([
        this.generateCaption(tags, title),
        this.generateVibeAnalysis(tags, title)
      ]);
  
      // Validate responses
      if (!caption || !vibe) {
        logger.warn('Invalid AI response, using fallbacks');
        return {
          caption: this.getFallbackCaption(),
          vibe: this.getFallbackVibe()
        };
      }
  
      logger.debug('Generated AI content:', { caption, vibe });
      return { caption, vibe };
    } catch (error) {
      logger.error('Failed to generate AI content:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return {
        caption: this.getFallbackCaption(),
        vibe: this.getFallbackVibe()
      };
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

      // Generate new caption
      const caption = await this.generateCaption(meme.tags, meme.title);

      // Update meme in database
      const { error } = await supabase
        .from('memes')
        .update({ caption })
        .eq('id', memeId);

      if (error) throw error;

      logger.info(`Regenerated caption for meme ${memeId}`);
      return caption;
    } catch (error) {
      logger.error(`Failed to regenerate caption for meme ${memeId}:`, error.message);
      throw error;
    }
  }
}