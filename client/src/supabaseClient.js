

const supabaseUrl = 'https://iskmnvylfnbnebwsatjt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
