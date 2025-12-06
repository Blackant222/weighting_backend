# WeightBro API - Complete Setup Guide

## 1. Database Setup (REQUIRED FIRST)

### Go to Supabase SQL Editor:
https://supabase.com/dashboard/project/ohpfqyulxcyqcmecnmbu/sql/new

### Run the schema.sql file:
Copy and paste the entire contents of `schema.sql` into the SQL Editor and click "Run".

This will create:
- 6 tables (users, diet_plans, daily_plans, meals, chat_messages, check_ins)
- Row Level Security policies
- Performance indexes

## 2. Install Dependencies

```bash
cd weighting-api
bun install
```

## 3. Start Backend Server

```bash
bun run dev
```

Server will run on: http://localhost:3005

## 4. Test Backend

```bash
# Health check
curl http://localhost:3005/health

# API info
curl http://localhost:3005/api/v1
```

## 5. Update Frontend (if needed)

The frontend is already configured to use the backend API at `http://localhost:3005/api/v1`.

Just make sure the frontend is running:
```bash
cd ../
npm run dev
```

## 6. First Time Usage

1. Open frontend in browser
2. Click "Sign Up" and create account
3. Complete onboarding
4. Generate your first diet plan
5. Start chatting with BroBot!

## Troubleshooting

### "Cannot connect to database"
- Make sure you ran `schema.sql` in Supabase
- Check `.env` file has correct Supabase credentials

### "Authentication failed"
- Clear localStorage in browser
- Sign up with a new account

### "AI generation failed"
- Check Gemini API key in `.env`
- Check console for detailed error messages

## Environment Variables

Already configured in `.env`:
- `SUPABASE_URL` ✓
- `SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_KEY` ✓
- `GEMINI_API_KEY` ✓

All set! No changes needed.
