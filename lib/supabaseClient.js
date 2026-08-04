import { createClient } from '@supabase/supabase-js';

// Public URL + anon key -- safe to expose in client code.
// Access is controlled entirely by Row Level Security policies on the project.
const supabaseUrl = 'https://niuixeomaexekptkamcn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWl4ZW9tYWV4ZWtwdGthbWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3ODk0NDUsImV4cCI6MjEwMTM2NTQ0NX0.ukD0_XqrpDtAfkngEKC2IIv61uStqxlUVbE72Ieof4k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
