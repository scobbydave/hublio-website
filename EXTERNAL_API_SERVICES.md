# External API Services Configuration

## Overview
Hublio website uses several external API services to provide dynamic content and functionality. This document explains each service and how to configure them.

## 🔧 Current API Services

### 1. Blog Content (✅ Working)
- **Service**: News API + AI Content Generation
- **Configuration**: `NEWS_API_KEY` (already configured)
- **Status**: ✅ Working - Fetching live mining industry news
- **API Endpoint**: `/api/blog/posts`
- **Functionality**: Automatically pulls and categorizes mining industry news

### 2. Job Vacancies (⚠️ Needs API Keys)
- **Service**: Adzuna Jobs API
- **Configuration**: Missing `ADZUNA_APP_ID` and `ADZUNA_API_KEY`
- **Status**: ⚠️ API ready but needs credentials
- **API Endpoint**: `/api/cron/generate-vacancies`
- **Functionality**: Fetches mining jobs from South Africa, Botswana, Namibia, Zimbabwe

### 3. Content Management (✅ Working)
- **Service**: Sanity CMS
- **Configuration**: Already configured with valid credentials
- **Status**: ✅ Working - Ready for content management
- **Functionality**: Stores and manages blog posts, vacancies, and other content

## 🚀 How to Enable Job Vacancies

### Step 1: Get Adzuna API Credentials
1. Visit [Adzuna Developer Portal](https://developer.adzuna.com/)
2. Create a free developer account
3. Create a new application
4. Copy your `App ID` and `API Key`

### Step 2: Update Environment Variables
Add to your `.env.local` file:
```bash
ADZUNA_APP_ID=your_actual_app_id_here
ADZUNA_API_KEY=your_actual_api_key_here
```

### Step 3: Test the Job Fetching Service
Run the cron job manually to fetch jobs:
```bash
# PowerShell
$headers = @{ "Authorization" = "Bearer hublio-cron-secret-2024" }
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/generate-vacancies" -Method POST -Headers $headers
```

### Step 4: Set Up Automated Job Fetching
The system includes a cron job that should be scheduled to run periodically (e.g., daily) to fetch new job listings.

## 📊 API Rate Limits & Considerations

### Adzuna API
- **Free Tier**: 1,000 calls per month
- **Rate Limiting**: Built-in delays between requests (1 second)
- **Countries Supported**: South Africa (za), Botswana (bw), Namibia (na), Zimbabwe (zw)
- **Search Terms**: mining, mine, mining engineer, mining safety, mining operations

### News API
- **Current Usage**: Fetching mining industry news
- **Rate Limiting**: Handled automatically

## 🔍 Troubleshooting

### Jobs Not Appearing
1. Check if Adzuna API credentials are configured
2. Run the manual cron job to test
3. Check Sanity CMS for stored job data
4. Verify API rate limits haven't been exceeded

### Blog Posts Not Updating
1. Check News API key configuration
2. Verify internet connectivity
3. Check browser console for API errors

## 🎯 Next Steps

1. **Immediate**: Configure Adzuna API credentials to enable job fetching
2. **Production**: Set up automated cron job scheduling on your hosting platform
3. **Optional**: Add more job sources or customize search parameters
4. **Monitoring**: Set up logging for API usage and errors

## 📝 Recent Changes

- ✅ Transformed website from AI services to HR platform focus
- ✅ Updated hero section and services page content
- ✅ Added proper environment configuration for Adzuna API
- ✅ Committed all changes to repository

The website is now fully configured as an HR platform for mining companies, with all the infrastructure ready for external job fetching once API credentials are provided.
