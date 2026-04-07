import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://demnuyviwbmrflotyuuh.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZoCayIrKMoEZrUBU_ctduw_4mtRCYBK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
