# WeightBro Backend API 🏋️

Complete backend API for WeightBro - AI-powered diet and fitness tracking app.

## ✅ Features

- **AI Services**: Goal suggestion, diet plan generation, weekly check-ins, AI chat
- **Authentication**: Supabase Auth with JWT tokens
- **Database**: PostgreSQL with Row Level Security
- **Multi-language**: English, Spanish, Persian (Farsi)
- **Image Analysis**: Body composition from photos

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Database Setup
Run `schema.sql` in Supabase SQL Editor:
https://supabase.com/dashboard/project/ohpfqyulxcyqcmecnmbu/sql/new

### 3. Start Server
```bash
bun run dev
```

Server runs on: **http://localhost:3005**

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### User Profile
- `GET /api/v1/users/profile` - Get profile
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/onboarding` - Complete onboarding

### AI Services (Server-side)
- `POST /api/v1/ai/suggest-goal` - AI goal weight suggestion
- `POST /api/v1/ai/generate-plan` - Generate 7-day diet plan
- `POST /api/v1/ai/next-phase` - Generate next week plan
- `POST /api/v1/ai/chat` - Chat with AI nutritionist

### Diet Plans
- `GET /api/v1/plans/active` - Get active plan
- `POST /api/v1/plans/save` - Save plan to database

### Meals
- `PATCH /api/v1/meals/:id/toggle` - Toggle meal completion

### Progress
- `GET /api/v1/progress/stats` - Get XP, points, level, streak
- `GET /api/v1/progress/adherence` - Get adherence percentage

### Chat
- `GET /api/v1/chat/history` - Get chat history
- `POST /api/v1/chat/message` - Send message to AI
- `DELETE /api/v1/chat/history` - Clear history

## 🔐 Authentication

All endpoints (except `/auth/*`) require Bearer token:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 🌍 Environment Variables

Already configured in `.env`:
```env
PORT=3005
SUPABASE_URL=https://ohpfqyulxcyqcmecnmbu.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
GEMINI_API_KEY=AIzaSyAUi5bipWlaNl4tGlgc7OrwsZUMLOJ8py0
```

## 📊 Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3005/health

# API info
curl http://localhost:3005/api/v1
```

## 📁 Project Structure

```
weighting-api/
├── src/
│   ├── config/          # Supabase, Gemini config
│   ├── middleware/      # Auth, error handling
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # AI services (Gemini)
│   ├── repositories/    # Database operations
│   └── types/           # TypeScript types
├── schema.sql           # Database schema
└── .env                 # Environment variables
```

## 🔥 AI Features

All AI functions available both **server-side** (API) and **client-side** (frontend):

1. **Goal Weight Suggestion** - Analyzes user data + optional photo
2. **Diet Plan Generation** - Creates 7-day meal plans with macros
3. **Weekly Check-ins** - Adapts plan based on progress
4. **AI Chat** - Context-aware nutritionist chat

## 📝 Notes

- VPN required for Gemini API in restricted regions
- Frontend uses client-side AI (bypasses VPN issues)
- Backend AI available for production deployment
- Multi-language support: `en`, `es`, `fa`

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Google Gemini 2.5 Flash
