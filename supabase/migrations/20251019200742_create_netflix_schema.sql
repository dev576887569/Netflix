/*
  # Netflix MVP Database Schema

  ## Overview
  This migration creates the core database structure for a Netflix-style streaming MVP.
  
  ## 1. New Tables
  
  ### `profiles`
  Extends auth.users with user profile information
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email for display
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `videos`
  Stores video content metadata and streaming URLs
  - `id` (uuid, primary key) - Unique video identifier
  - `title` (text) - Video title
  - `description` (text) - Video description/synopsis
  - `thumbnail_url` (text) - Thumbnail image URL
  - `video_url` (text) - Video streaming URL (YouTube embed or direct link)
  - `duration` (integer) - Video duration in seconds
  - `category` (text) - Genre/category (Action, Comedy, Drama, etc.)
  - `year` (integer) - Release year
  - `rating` (text) - Content rating (PG, PG-13, R, etc.)
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `my_list`
  Tracks user's saved/favorite videos
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid) - References profiles(id)
  - `video_id` (uuid) - References videos(id)
  - `added_at` (timestamptz) - When video was added to list
  - Unique constraint on (user_id, video_id)
  
  ### `watch_history`
  Tracks user viewing progress and history
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid) - References profiles(id)
  - `video_id` (uuid) - References videos(id)
  - `progress` (integer) - Playback progress in seconds
  - `completed` (boolean) - Whether video was fully watched
  - `last_watched` (timestamptz) - Last viewing timestamp
  - Unique constraint on (user_id, video_id)
  
  ## 2. Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - `profiles`: Users can read all profiles, but only update their own
  - `videos`: Public read access for all authenticated users
  - `my_list`: Users can only access their own list items
  - `watch_history`: Users can only access their own watch history
  
  ## 3. Indexes
  - Index on videos.category for efficient filtering
  - Index on my_list.user_id for fast user list queries
  - Index on watch_history.user_id for fast history queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  duration integer DEFAULT 0,
  category text NOT NULL,
  year integer,
  rating text DEFAULT 'PG',
  created_at timestamptz DEFAULT now()
);

-- Create my_list table
CREATE TABLE IF NOT EXISTS my_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create watch_history table
CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_watched timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Videos policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

-- My List policies
CREATE POLICY "Users can view own list"
  ON my_list FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own list"
  ON my_list FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own list"
  ON my_list FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Watch History policies
CREATE POLICY "Users can view own watch history"
  ON watch_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON watch_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON watch_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_my_list_user_id ON my_list(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON watch_history(last_watched DESC);