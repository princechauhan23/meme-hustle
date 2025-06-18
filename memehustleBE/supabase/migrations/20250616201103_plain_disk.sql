/*
  # Create memes table

  1. New Tables
    - `memes`
      - `id` (integer, primary key, auto-increment)
      - `title` (text, required)
      - `image_url` (text, required)
      - `tags` (text array, required)
      - `description` (text, optional)
      - `upvotes` (integer, default 0)
      - `owner_id` (integer, required)
      - `ai_caption` (text, optional)
      - `vibe_analysis` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `memes` table
    - Add policies for authenticated users to read all memes
    - Add policies for authenticated users to create memes
    - Add policies for users to update their own memes

  3. Performance
    - Add indexes on commonly queried columns
    - Add GIN index for tags array searches