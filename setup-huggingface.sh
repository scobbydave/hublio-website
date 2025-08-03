#!/bin/bash

# Hugging Face Mistral-7B Setup Script for Hublio AI Job Matching
# This script sets up the local Hugging Face model as a fallback for OpenAI

echo "🚀 Setting up Hugging Face Mistral-7B Fallback Service..."

# Navigate to the model directory
cd mistral-7b-chatbot

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "📦 Building Docker image for Mistral-7B..."
docker build -t hublio-mistral-7b .

echo "🎯 Starting Mistral-7B service on port 8000..."
docker run -d \
  --name hublio-mistral-fallback \
  -p 8000:8000 \
  --restart unless-stopped \
  hublio-mistral-7b \
  uvicorn src.app:app --host 0.0.0.0 --port 8000

# Wait for service to start
echo "⏳ Waiting for service to start..."
sleep 10

# Test the service
echo "🧪 Testing Hugging Face service..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)

if [ "$response" = "200" ]; then
    echo "✅ Hugging Face Mistral-7B service is running successfully!"
    echo "🔗 Health check: http://localhost:8000/health"
    echo "🤖 Chat endpoint: http://localhost:8000/chat"
    echo ""
    echo "📝 To use this service, add to your .env.local:"
    echo "HUGGINGFACE_API_URL=http://localhost:8000"
    echo ""
    echo "🎉 Your AI job matching now has three levels of fallback:"
    echo "   1. OpenAI GPT-4o-mini (primary)"
    echo "   2. Hugging Face Mistral-7B (local fallback)"
    echo "   3. Keyword matching (final fallback)"
else
    echo "❌ Service failed to start. Check Docker logs:"
    echo "docker logs hublio-mistral-fallback"
fi
