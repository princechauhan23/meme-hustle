import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  logger.warn('⚠️ Gemini API key not configured - AI features will use fallbacks');
}

export const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY}) : null;

// Get the model directly
export const getGeminiModel = async (prompt) => {
  if (!genAI) return null;
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 100
      }
    });
    
    return {
      response: response.text
    };
  } catch (error) {
    logger.error('Failed to generate AI content:', error);
    return null;
  }
};

// Fallback captions for when AI is unavailable
export const fallbackCaptions = [
  "YOLO to the moon! 🚀",
  "When life gives you memes... 😎",
  "This hits different 💯",
  "Big mood energy ⚡",
  "POV: You're winning at life 🏆",
  "No cap, this is fire 🔥",
  "Main character energy 👑",
  "It's giving legendary vibes ✨",
  "That's some premium content 💎",
  "Certified meme classic 📜"
];

export const fallbackVibes = [
  "Retro Stonks Vibes",
  "Chaotic Good Energy",
  "Vintage Flex Mode",
  "Premium Meme Tier",
  "Galaxy Brain Status",
  "Sigma Grindset",
  "Based and Meme-pilled",
  "Absolute Unit Energy",
  "Touch Grass Reminder",
  "NPC Behavior Detected"
];