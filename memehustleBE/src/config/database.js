import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Setup path for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Supabase URL and key are required');
}

// Make sure to pass the variables correctly to createClient
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create the Supabase client with explicit arguments
export const supabase = createClient(supabaseUrl, supabaseKey);