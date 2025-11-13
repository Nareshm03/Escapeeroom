#!/bin/bash

API_URL="${1:-http://localhost:5000}"

response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/health")

if [ "$response" = "200" ]; then
    echo "✅ Health check passed"
    exit 0
else
    echo "❌ Health check failed (HTTP $response)"
    exit 1
fi
