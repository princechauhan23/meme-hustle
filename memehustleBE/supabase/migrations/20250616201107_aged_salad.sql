/*
  # Create bids table

  1. New Tables
    - `bids`
      - `id` (integer, primary key, auto-increment)
      - `meme_id` (integer, foreign key to memes)
      - `user_id` (integer, required)
      - `credits` (integer, required)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `bids` table
    - Add policies for authenticated users to read bids
    - Add policies for authenticated users to create bids
    - Add policies for users to view their own bids

  3. Performance
    - Add indexes on foreign keys and commonly queried columns