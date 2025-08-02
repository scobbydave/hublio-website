# 🚀 Hublio V2 Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables for Production
Copy these to your Vercel environment variables:

```bash
# Required for Alpha Vantage Market Data
ALPHA_VANTAGE_API_KEY=C0RREMPZF3PJSQY4
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=C0RREMPZF3PJSQY4

# Admin Dashboard Access
DASHBOARD_KEY=your-secure-dashboard-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.hublio.com

# Optional - Add these if you have them configured
OPENAI_API_KEY=your-openai-key
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
NEWS_API_KEY=your-news-api-key
```

### 2. Build Test
Run this locally to ensure everything builds correctly:
```bash
npm run build
```

### 3. Important Files to Check
- ✅ vercel.json exists (deployment configuration)
- ✅ .env.local has all required variables
- ✅ Alpha Vantage API integration working
- ✅ Market dashboard functional
- ✅ Admin dashboard accessible

## Deployment Steps

### Step 1: GitHub Repository Setup
1. Create a new repository on GitHub (or use existing)
2. Push your code to GitHub
3. Ensure all files are committed

### Step 2: Vercel Deployment
1. Go to vercel.com and sign in
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

### Step 3: Domain Configuration
1. In Vercel dashboard, go to your project settings
2. Add www.hublio.com as a custom domain
3. Configure DNS settings as shown by Vercel

## Key Features in This Deployment
- ✅ Real Alpha Vantage market data in ZAR
- ✅ Professional admin dashboard (no dummy data)
- ✅ Market dashboard with live precious metals pricing
- ✅ Mining industry focused content
- ✅ Professional enterprise design
- ✅ PWA capabilities
- ✅ Responsive design
- ✅ SEO optimized

## Post-Deployment Testing
- [ ] Test www.hublio.com loads correctly
- [ ] Test market dashboard: /market-dashboard
- [ ] Test admin dashboard: /admin-dashboard?key=your-key
- [ ] Verify Alpha Vantage API working
- [ ] Check all pages load correctly
- [ ] Test mobile responsiveness
