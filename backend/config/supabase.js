const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load .env file

// Debugging: Log environment variables
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;

