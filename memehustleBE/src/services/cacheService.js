import NodeCache from 'node-cache';
import { logger } from '../utils/logger.js';

// Create cache instances
const leaderboardCache = new NodeCache({ 
  stdTTL: parseInt(process.env.LEADERBOARD_CACHE_TTL) || 60,
  checkperiod: 30
});

const aiCache = new NodeCache({ 
  stdTTL: parseInt(process.env.CACHE_TTL) || 300,
  checkperiod: 60
});

const generalCache = new NodeCache({ 
  stdTTL: parseInt(process.env.CACHE_TTL) || 300,
  checkperiod: 60
});

export class CacheService {
  // Leaderboard caching
  static getLeaderboard(key) {
    const cached = leaderboardCache.get(key);
    if (cached) {
      logger.debug(`Cache hit for leaderboard: ${key}`);
    }
    return cached;
  }

  static setLeaderboard(key, data) {
    leaderboardCache.set(key, data);
    logger.debug(`Cache set for leaderboard: ${key}`);
  }

  static invalidateLeaderboard() {
    leaderboardCache.flushAll();
    logger.info('Leaderboard cache invalidated');
  }

  // AI response caching
  static getAIResponse(prompt) {
    const key = `ai:${this.hashString(prompt)}`;
    const cached = aiCache.get(key);
    if (cached) {
      logger.debug(`AI cache hit for prompt hash: ${key}`);
    }
    return cached;
  }

  static setAIResponse(prompt, response) {
    const key = `ai:${this.hashString(prompt)}`;
    aiCache.set(key, response);
    logger.debug(`AI response cached with key: ${key}`);
  }

  // General purpose caching
  static get(key) {
    return generalCache.get(key);
  }

  static set(key, value, ttl = null) {
    if (ttl) {
      generalCache.set(key, value, ttl);
    } else {
      generalCache.set(key, value);
    }
    logger.debug(`Cache set: ${key}`);
  }

  static del(key) {
    generalCache.del(key);
    logger.debug(`Cache deleted: ${key}`);
  }

  // Utility methods
  static hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  static getStats() {
    return {
      leaderboard: leaderboardCache.getStats(),
      ai: aiCache.getStats(),
      general: generalCache.getStats()
    };
  }

  static flushAll() {
    leaderboardCache.flushAll();
    aiCache.flushAll();
    generalCache.flushAll();
    logger.info('All caches flushed');
  }
}