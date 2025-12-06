# WeightBro API Guide

## Base URL
```
http://localhost:3005/api/v1
```

## Quick Start

### 1. Create an Account
```bash
curl -X POST http://localhost:3005/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3005/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the `access_token` from the response!**

### 3. Complete Onboarding
```bash
curl -X POST http://localhost:3005/api/v1/users/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe",
    "age": 28,
    "gender": "Male",
    "weight": 85,
    "height": 180,
    "country": "USA",
    "activityLevel": "Moderately active",
    "dietaryPreferences": ["None"],
    "allergies": [],
    "mealsPerDay": "4",
    "primaryGoal": "Weight Loss",
    "language": "en"
  }'
```

### 4. Update Profile with Goal Weight
```bash
curl -X PUT http://localhost:3005/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "goalWeight": 78,
    "goalRationale": "Healthy BMI target"
  }'
```

### 5. Get AI Goal Suggestion
```bash
curl -X POST http://localhost:3005/api/v1/ai/suggest-goal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "profile": {
      "age": 28,
      "gender": "Male",
      "weight": 85,
      "height": 180,
      "activityLevel": "Moderately active",
      "primaryGoal": "Weight Loss",
      "country": "USA",
      "language": "en"
    }
  }'
```

### 6. Generate Initial Diet Plan
```bash
curl -X POST http://localhost:3005/api/v1/ai/generate-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "profile": {
      "name": "John Doe",
      "age": 28,
      "gender": "Male",
      "weight": 85,
      "height": 180,
      "country": "USA",
      "goalWeight": 78,
      "activityLevel": "Moderately active",
      "dietaryPreferences": ["None"],
      "allergies": [],
      "mealsPerDay": "4",
      "primaryGoal": "Weight Loss",
      "language": "en"
    }
  }'
```

### 7. Get Active Plan
```bash
curl -X GET http://localhost:3005/api/v1/plans/active \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 8. Toggle Meal Completion
```bash
curl -X PATCH http://localhost:3005/api/v1/meals/MEAL_ID/toggle \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 9. Get Progress Stats
```bash
curl -X GET http://localhost:3005/api/v1/progress/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 10. Get Adherence
```bash
curl -X GET http://localhost:3005/api/v1/progress/adherence \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 11. Chat with AI Nutritionist
```bash
curl -X POST http://localhost:3005/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "message": "What should I eat for breakfast?"
  }'
```

### 12. Get Chat History
```bash
curl -X GET http://localhost:3005/api/v1/chat/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Multi-Language Support

The API supports 3 languages:
- `en` - English
- `es` - Spanish (Español)
- `fa` - Persian (Farsi)

Set the `language` field in the user profile to get responses in that language.

### Example: Persian User
```bash
curl -X POST http://localhost:3005/api/v1/ai/generate-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "profile": {
      "name": "علی",
      "age": 28,
      "gender": "Male",
      "weight": 85,
      "height": 180,
      "country": "Iran",
      "goalWeight": 78,
      "activityLevel": "Moderately active",
      "dietaryPreferences": ["None"],
      "allergies": [],
      "mealsPerDay": "4",
      "primaryGoal": "Weight Loss",
      "language": "fa"
    }
  }'
```

## Database Setup

Before using the API, you need to set up the database tables in Supabase:

1. Go to your Supabase project: https://ohpfqyulxcyqcmecnmbu.supabase.co
2. Navigate to SQL Editor
3. Run the `schema.sql` file from the project root

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Success Responses

All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

## Authentication

All endpoints except `/auth/*` require authentication via Bearer token:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Image Upload

For endpoints that support image upload (goal suggestion, plan generation, chat), send base64 encoded images:
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```
