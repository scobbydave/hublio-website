# SerpAPI Integration Guide

## What is SerpAPI?

SerpAPI provides access to Google Search results through a simple API. For your mining dashboard, it enables:

### ✅ **Real Benefits for Your Live Website:**
1. **Live Mining News**: Real-time articles from Google News about mining industry
2. **Company-Specific Updates**: Latest news about Anglo American, Gold Fields, Sibanye, etc.
3. **Safety Incident Tracking**: Real-time safety news and incident reports
4. **Market Sentiment**: Track public sentiment through news headlines
5. **Regulatory Updates**: DMRE announcements and policy changes

### 📊 **Current Data Sources:**
- **✅ REAL**: Commodity prices (Gold, Silver, Platinum, Palladium) - Alpha Vantage API
- **🆕 REAL**: Mining industry news - SerpAPI (when configured)
- **⚠️ SAMPLE**: Stock prices, production metrics, safety data

## Setup Instructions

### 1. Get SerpAPI Key
1. Go to [serpapi.com](https://serpapi.com)
2. Sign up for a free account (100 searches/month free)
3. Copy your API key from the dashboard

### 2. Add Environment Variable

#### For Local Development (.env.local):
```bash
NEXT_PUBLIC_SERPAPI_KEY=your_serpapi_key_here
```

#### For Production (Vercel/Netlify):
Add environment variable:
- Name: `NEXT_PUBLIC_SERPAPI_KEY`
- Value: `your_serpapi_key_here`

### 3. News Categories Available

#### 🔍 **Search Queries Implemented:**
- General mining industry news (South Africa focus)
- Safety incidents and reports
- Regulation and policy updates
- Company-specific news (Anglo American, Gold Fields, Sibanye, Impala)
- Commodity market updates

#### 📈 **Impact Classification:**
- **High Impact**: Fatalities, accidents, major acquisitions, record results
- **Medium Impact**: Production updates, regulatory changes, discoveries
- **Low Impact**: General industry updates, routine announcements

## Cost Estimation

### SerpAPI Pricing:
- **Free Tier**: 100 searches/month (suitable for testing)
- **Starter**: $50/month - 5,000 searches (suitable for live website)
- **Pro**: $200/month - 25,000 searches (high-traffic websites)

### Usage Estimation for Your Dashboard:
- News refresh every 5 minutes: ~8,640 searches/month
- Recommended: Refresh every 30 minutes: ~1,440 searches/month
- **Cost**: $50/month for reliable live news feeds

## Alternative News Sources

If SerpAPI cost is a concern, consider:

1. **NewsAPI** (newsapi.org) - $449/month for commercial use
2. **RSS Feeds** - Free but limited sources:
   - Mining Weekly RSS
   - Mining Journal RSS
   - JSE announcements RSS
3. **Web Scraping** - Technical complexity, legal considerations

## Implementation Status

✅ **Completed:**
- SerpAPI service class with news categorization
- Automatic impact detection
- Company and commodity-specific searches
- Fallback to sample data if API unavailable

🔄 **To Activate:**
- Add NEXT_PUBLIC_SERPAPI_KEY environment variable
- Deploy to production
- Monitor usage and costs

## Sample API Response

```json
{
  "news_results": [
    {
      "title": "Anglo American Reports Strong Q3 Platinum Production",
      "link": "https://example.com/news",
      "snippet": "Mining giant Anglo American reported...",
      "date": "2025-08-10",
      "source": "Mining Weekly",
      "thumbnail": "https://..."
    }
  ]
}
```

The system automatically:
1. Fetches real news every 5-30 minutes
2. Categorizes by safety/production/market/regulation
3. Determines impact level (high/medium/low)
4. Removes duplicates
5. Displays with proper source attribution

## Benefits Over Mock Data

### Before (Mock Data):
- Static fake news articles
- No real market insights
- Misleading for live website visitors
- No actual value for decision making

### After (SerpAPI):
- Real-time industry news
- Actual market-moving events
- Legitimate information source
- Professional credibility for your platform
- SEO benefits from fresh, relevant content

## Next Steps

1. **Set up SerpAPI account** (free trial)
2. **Add environment variable** 
3. **Test with sample searches**
4. **Monitor usage and upgrade plan** as needed
5. **Consider adding more news sources** for redundancy

This transforms your mining dashboard from a demo into a legitimate mining industry information platform that visitors can trust and rely on for real market intelligence.
