// Supabase client configuration
// TODO: Replace with your Supabase project URL and anon key
// You can find these in your Supabase project settings

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

// Initialize Supabase client
// This will be used for authentication and database operations

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const supabaseConfig: SupabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};

// TODO: When Supabase is connected, uncomment and use the actual client:
// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types (update when schema is finalized)
export interface User {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  message_text: string;
  emotion?: string;
  sentiment?: string;
  severity?: string;
  intent?: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_text: string;
  mood_tag?: string;
  timestamp: string;
}
