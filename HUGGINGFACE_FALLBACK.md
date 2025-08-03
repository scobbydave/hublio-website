# 🤖 AI Job Matching Fallback System

Hublio now features an intelligent **three-tier fallback system** for AI job matching, ensuring users always get meaningful job recommendations even when services are temporarily unavailable.

## 🎯 Fallback Hierarchy

### 1. **Primary: OpenAI GPT-4o-mini** 
- **Best Quality**: Advanced contextual analysis
- **Fast**: ~2-3 seconds response time
- **Limitation**: Requires API quota/credits

### 2. **Secondary: Hugging Face Mistral-7B (Local)**
- **High Quality**: 7B parameter model running locally
- **Private**: No external API calls
- **Reliable**: Always available once deployed
- **Performance**: ~5-10 seconds response time

### 3. **Final Fallback: Keyword Matching**
- **Always Available**: No dependencies
- **Instant**: <1 second response time
- **Basic**: Mining-industry specific keyword analysis

## 🚀 Quick Setup

### Prerequisites
- Docker Desktop installed
- 8GB+ RAM available for Mistral-7B model

### Windows Setup
```powershell
# Run the PowerShell setup script
.\setup-huggingface.ps1
```

### Linux/Mac Setup
```bash
# Run the bash setup script
chmod +x setup-huggingface.sh
./setup-huggingface.sh
```

### Manual Setup
```bash
cd mistral-7b-chatbot
docker build -t hublio-mistral-7b .
docker run -d --name hublio-mistral-fallback -p 8000:8000 hublio-mistral-7b
```

## ⚙️ Configuration

Add to your `.env.local`:
```bash
HUGGINGFACE_API_URL=http://localhost:8000
```

## 🧪 Testing the System

### Test Individual Services

1. **OpenAI Status**: Check your OpenAI dashboard for quota
2. **Hugging Face Health**: Visit `http://localhost:8000/health`
3. **Full Integration**: Use the job matching feature in `/vacancies`

### Expected Behavior

- **Normal Operation**: Uses OpenAI GPT-4o-mini
- **Quota Exceeded**: Automatically switches to Mistral-7B
- **Model Unavailable**: Falls back to keyword matching
- **User Notification**: Each fallback level is clearly indicated

## 📊 Performance Comparison

| Service | Quality | Speed | Reliability | Cost |
|---------|---------|-------|-------------|------|
| OpenAI GPT-4o-mini | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 💰💰 |
| Mistral-7B Local | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| Keyword Matching | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |

## 🔍 User Experience

Users will see different indicators based on which service is active:

- **OpenAI**: No special indicator (premium experience)
- **Mistral-7B**: "🤖 Analysis powered by Mistral-7B local AI model"
- **Keyword**: "⚠️ Using basic keyword matching - AI services temporarily unavailable"

## 🛠️ Maintenance

### Starting/Stopping the Service
```bash
# Start
docker start hublio-mistral-fallback

# Stop  
docker stop hublio-mistral-fallback

# View logs
docker logs hublio-mistral-fallback
```

### Updating the Model
```bash
# Pull latest model
docker pull your-registry/hublio-mistral-7b:latest

# Restart with new image
docker stop hublio-mistral-fallback
docker rm hublio-mistral-fallback
docker run -d --name hublio-mistral-fallback -p 8000:8000 hublio-mistral-7b:latest
```

## 🎉 Benefits

1. **100% Uptime**: Never fails, always provides recommendations
2. **Cost Control**: Reduces OpenAI API costs
3. **Privacy**: Local model keeps data on-premises
4. **Performance**: Smart routing to fastest available service
5. **User Experience**: Seamless transitions, clear communication

## 🔧 Troubleshooting

### Common Issues

**Service won't start:**
```bash
# Check if port 8000 is available
netstat -an | findstr :8000

# Check Docker logs
docker logs hublio-mistral-fallback
```

**Memory issues:**
- Ensure 8GB+ RAM available
- Close other memory-intensive applications
- Consider using a smaller quantized model

**Network connectivity:**
- Verify `http://localhost:8000/health` is accessible
- Check Windows Firewall/antivirus settings
- Ensure Docker networking is properly configured

This robust fallback system ensures your job matching feature remains operational regardless of external service availability! 🚀
