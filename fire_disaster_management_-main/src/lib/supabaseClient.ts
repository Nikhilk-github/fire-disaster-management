import { createClient } from '@supabase/supabase-js';
const anon_key=import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = anon_key;

export const supabase = createClient(supabaseUrl, supabaseKey);
