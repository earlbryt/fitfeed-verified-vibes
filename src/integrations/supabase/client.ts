
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tnvroepeyzkwauqjbtnv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudnJvZXBleXprd2F1cWpidG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTM2MjcsImV4cCI6MjA2MTQyOTYyN30.-ejxe2-1c0lsCUXQEeyhaIxG2MTzoxcgJ6PKuFcBSxg";

// Configure client with better persistence and auth settings
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
