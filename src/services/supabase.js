import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getJobs = async (filter = 'All') => {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'High Match') {
    query = query.gte('match_score', 90);
  } else if (filter === 'Remote') {
    query = query.contains('tags', ['Remote']);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data;
};
