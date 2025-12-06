#!/bin/bash

echo "🧪 Testing WeightBro API..."
echo ""

# Test health endpoint
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:3005/health | jq
echo ""

# Test API root
echo "2️⃣ Testing API root..."
curl -s http://localhost:3005/api/v1 | jq '.endpoints.auth'
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "Next steps:"
echo "1. Run schema.sql in Supabase"
echo "2. Sign up via frontend"
echo "3. Complete onboarding"
