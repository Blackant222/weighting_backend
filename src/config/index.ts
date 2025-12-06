import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3005,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
  },
};
