# Hugging Face Mistral-7B Setup Script for Hublio AI Job Matching
# This script sets up the local Hugging Face model as a fallback for OpenAI

Write-Host "🚀 Setting up Hugging Face Mistral-7B Fallback Service..." -ForegroundColor Green

# Navigate to the model directory
Set-Location "mistral-7b-chatbot"

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building Docker image for Mistral-7B..." -ForegroundColor Yellow
docker build -t hublio-mistral-7b .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Starting Mistral-7B service on port 8000..." -ForegroundColor Yellow
docker run -d `
  --name hublio-mistral-fallback `
  -p 8000:8000 `
  --restart unless-stopped `
  hublio-mistral-7b `
  uvicorn src.app:app --host 0.0.0.0 --port 8000

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container" -ForegroundColor Red
    exit 1
}

# Wait for service to start
Write-Host "⏳ Waiting for service to start..." -ForegroundColor Yellow
Start-Sleep 15

# Test the service
Write-Host "🧪 Testing Hugging Face service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Hugging Face Mistral-7B service is running successfully!" -ForegroundColor Green
        Write-Host "🔗 Health check: http://localhost:8000/health" -ForegroundColor Cyan
        Write-Host "🤖 Chat endpoint: http://localhost:8000/chat" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 To use this service, add to your .env.local:" -ForegroundColor Yellow
        Write-Host "HUGGINGFACE_API_URL=http://localhost:8000" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Your AI job matching now has three levels of fallback:" -ForegroundColor Green
        Write-Host "   1. OpenAI GPT-4o-mini (primary)" -ForegroundColor White
        Write-Host "   2. Hugging Face Mistral-7B (local fallback)" -ForegroundColor White
        Write-Host "   3. Keyword matching (final fallback)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Service failed to start. Check Docker logs:" -ForegroundColor Red
    Write-Host "docker logs hublio-mistral-fallback" -ForegroundColor Yellow
}

# Go back to main directory
Set-Location ".."
