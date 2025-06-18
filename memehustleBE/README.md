# MemeHustle Backend

A robust Node.js Express.js backend for the MemeHustle platform with real-time features, AI integration, and comprehensive API endpoints.

## 🚀 Features

- **REST API** - Complete CRUD operations for memes, bids, and leaderboards
- **Real-time Updates** - Socket.io integration for live bidding and upvoting
- **AI Integration** - Google Gemini API for caption generation and vibe analysis
- **Caching System** - In-memory caching for improved performance
- **Mock Authentication** - Development-ready user system
- **Database Integration** - Supabase PostgreSQL with optimized queries
- **Comprehensive Logging** - Winston-based logging system
- **Error Handling** - Robust error handling and validation

## 📦 Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

4. **Database setup:**
   - Set up your Supabase project
   - Run the migration files in the `supabase/migrations/` directory
   - Click "Connect to Supabase" in the UI to configure your database

## 🎯 API Endpoints

### Authentication
- `GET /api/auth/users` - Get available demo users
- `POST /api/auth/login` - Login with username/email
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/docs` - Authentication documentation

### Memes
- `POST /api/memes` - Create new meme (with AI caption generation)
- `GET /api/memes` - Get memes with filtering and pagination
- `GET /api/memes/:id` - Get specific meme by ID
- `POST /api/memes/:id/upvote` - Upvote a meme
- `GET /api/memes/tags/trending` - Get trending tags
- `GET /api/memes/user/:userId` - Get user's memes

### Bids
- `POST /api/bids` - Place bid on meme
- `GET /api/bids/meme/:memeId` - Get bids for specific meme
- `GET /api/bids/my-bids` - Get current user's bids
- `GET /api/bids/user/:userId` - Get user's bids
- `GET /api/bids/leaderboard` - Get top bidders

### Leaderboard
- `GET /api/leaderboard/memes` - Top memes leaderboard
- `GET /api/leaderboard/creators` - Top creators leaderboard
- `GET /api/leaderboard/summary` - Leaderboard summary
- `GET /api/leaderboard/stats` - Global platform statistics

## 🔌 Socket.io Events

### Client → Server
- `join_user_room` - Join personal notification room
- `join_meme_room` - Join meme-specific room
- `leave_meme_room` - Leave meme room
- `join_leaderboard` - Join leaderboard updates

### Server → Client
- `connected` - Connection confirmation
- `meme_updated` - Meme upvoted/modified
- `bid_placed` - New bid placed
- `bid_received` - Received bid notification
- `new_meme` - New meme created
- `leaderboard_update` - Rankings changed

## 🤖 AI Features

### Caption Generation
Automatically generates funny captions using Google Gemini AI:
```javascript
// Example AI-generated caption
"POV: You're winning at life 🏆"
```

### Vibe Analysis
Analyzes meme vibes and generates mood descriptions:
```javascript
// Example vibe analysis
"Retro Stonks Vibes"
```

### Fallback System
Robust fallback system with pre-defined captions and vibes when AI is unavailable.

## 🗄️ Database Schema

### Memes Table
- `id` - Primary key
- `title` - Meme title
- `image_url` - Image URL
- `tags` - Array of tags
- `upvotes` - Vote count
- `owner_id` - Creator ID
- `ai_caption` - AI-generated caption
- `vibe_analysis` - AI-generated vibe

### Bids Table
- `id` - Primary key
- `meme_id` - Foreign key to memes
- `user_id` - Bidder ID
- `credits` - Bid amount

### Upvotes Table
- `meme_id` - Foreign key to memes
- `user_id` - Voter ID
- Unique constraint prevents duplicate votes

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Authentication
Use Bearer token authentication with user ID:
```bash
curl -H "Authorization: Bearer 1" http://localhost:3000/api/memes
```

Available demo users: 1-5 (mememaster, vibelord, stonksguy, cryptoqueen, nftnoob)

## 📊 Monitoring

- Health check: `GET /health`
- Cache statistics available via CacheService
- Comprehensive logging with Winston
- Real-time connection monitoring

## 🔧 Architecture

- **Modular Design** - Clean separation of concerns
- **Service Layer** - Business logic isolation
- **Middleware Stack** - Authentication, validation, error handling
- **Caching Strategy** - Multi-tier caching system
- **Real-time Engine** - Socket.io for live updates