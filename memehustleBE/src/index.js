// Use ES Module import for dotenv
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Setup path for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Log to verify environment variables are loaded
console.log('Checking env variables loaded:');

// ...existing code...