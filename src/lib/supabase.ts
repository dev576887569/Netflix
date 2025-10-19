import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: number;
  category: string;
  year?: number;
  rating: string;
  created_at: string;
}

export interface MyListItem {
  id: string;
  user_id: string;
  video_id: string;
  added_at: string;
  video?: Video;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  video_id: string;
  progress: number;
  completed: boolean;
  last_watched: string;
}
