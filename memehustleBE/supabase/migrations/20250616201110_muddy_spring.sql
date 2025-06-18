/*
  # Create upvotes table

  1. New Tables
    - `upvotes`
      - `id` (integer, primary key, auto-increment)
      - `meme_id` (integer, foreign key to memes)
      - `user_id` (integer, required)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `upvotes` table
    - Add policies for authenticated users to read and create upvotes
    - Add unique constraint to prevent duplicate upvotes

  3. Performance
    - Add unique index on (meme_id, user_id) to prevent duplicates
    - Add indexes on foreign keys