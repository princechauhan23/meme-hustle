import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';

export class MemeDuelService {
  static async startMemeDuel(meme1, meme2, timer, host) {
    try {
      const duel = {
        meme1,
        meme2,
        timer,
        meme1Upvotes: 0,
        meme2Upvotes: 0,
        host,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('memeduels')
        .insert([duel])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Meme Duel started between ${meme1} and ${meme2}`);
      return data;
    } catch (error) {
      logger.error(`Error starting meme duel: ${error.message}`);
      throw error;
    }
  }

  static async getBattles() {
    try {
      const { data, error } = await supabase
        .from('memeduels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('Meme duels retrieved successfully');
      return data;
    } catch (error) {
      logger.error(`Error fetching meme duels: ${error.message}`);
      throw error;
    }
  }

  static async endBattle(battleId) {
    try {
      const { data, error } = await supabase
        .from('memeduels')
        .update({ timer: new Date().toISOString() })
        .eq('id', battleId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Battle ${battleId} ended successfully`);
      return data;
    } catch (error) {
      logger.error(`Error ending battle ${battleId}: ${error.message}`);
      throw error;
    }
  }

  static async voteOnBattle(memeId, battleId) {
    try {

      const { data: battle } = await supabase
        .from('memeduels')
        .select('*')
        .eq('id', battleId)
        .single();

      logger.info(battle, `Battle retrieved successfully`);

      let update = {};
      if (battle.meme1 === memeId) {
        update = { meme1Upvotes: (battle.meme1Upvotes || 0) + 1 };
      }
      if (battle.meme2 === memeId) {
        update = { meme2Upvotes: (battle.meme2Upvotes || 0) + 1 };
      }

      const { data, error } = await supabase
        .from('memeduels')
        .update(update)
        .eq('id', battleId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Battle ${battleId} voted successfully`);
      return data;
    } catch (error) {
      logger.error(`Error voting on battle ${battleId}: ${error.message}`);
      throw error;
    }
  }
}