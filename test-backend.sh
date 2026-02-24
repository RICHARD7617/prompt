#!/bin/bash

# Test script for backend endpoints

echo "🧪 Testing Backend Endpoints..."
echo ""

BACKEND_URL="${1:-http://localhost:3000}"

echo "📍 Backend URL: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
curl -X GET "$BACKEND_URL/api/health" \
  -H "Content-Type: application/json" | jq .
echo ""
echo ""

# Test 2: Root Endpoint
echo "2️⃣  Testing Root Endpoint..."
curl -X GET "$BACKEND_URL" \
  -H "Content-Type: application/json" | jq .
echo ""
echo ""

# Test 3: Payment Initiation
echo "3️⃣  Testing Payment Initiation (test data)..."
curl -X POST "$BACKEND_URL/api/pesapal/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": 30,
    "recipientNumber": "254746630940"
  }' | jq .
echo ""
echo ""

echo "✅ Tests completed!"
echo ""
echo "📝 Notes:"
echo "   • Health check should return: {\"status\": \"ok\"}"
echo "   • Root should list available endpoints"
echo "   • Payment initiation needs Pesapal credentials"
echo ""
