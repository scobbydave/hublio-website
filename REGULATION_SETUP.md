# Regulation & Compliance Hub - Setup Guide

## Overview
The Regulation & Compliance Hub is a comprehensive AI-powered platform that provides:
- AI Compliance Advisor (powered by Gemini AI)
- Regulation Articles & Updates
- AI-Generated Compliance Tips
- Document Analysis & Compliance Checking
- Real-time Mining Regulation News
- Interactive FAQ System
- Admin Dashboard for Content Management

## Environment Variables Setup

Add the following environment variables to your `.env.local` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Sanity CMS Configuration (if not already configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# News API Configuration (optional - for real-time news)
NEWS_API_KEY=your_news_api_key_here
```

## Getting Your API Keys

### 1. Gemini AI API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create a new project or select existing one
5. Generate API key and copy it
6. Add to `.env.local` as `GEMINI_API_KEY=your_key_here`

### 2. News API Key (Optional)
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from dashboard
4. Add to `.env.local` as `NEWS_API_KEY=your_key_here`

## Features Available

### Public Interface (`/regulation`)
- **AI Compliance Advisor**: Chat with Gemini AI about mining regulations
- **Regulation Articles**: Browse compliance articles and updates
- **Compliance Tips**: AI-generated tips for mining operations
- **Document Analyzer**: Upload documents for compliance analysis
- **Regulation News**: Real-time news feed about mining regulations
- **FAQs**: Interactive frequently asked questions

### Admin Dashboard
- **Content Management**: Approve/reject AI-generated content
- **Analytics Dashboard**: View usage statistics and engagement metrics
- **Approval Workflows**: Review compliance tips, articles, and FAQs
- **User Engagement**: Monitor chat conversations and document uploads

## Navigation Integration
The Regulation hub is now integrated into the main site navigation between "Blog" and "Contact".

## File Structure
```
app/
├── regulation/
│   └── page.tsx                 # Main regulation hub page
├── api/regulation/
│   ├── chat/route.ts           # AI chat endpoint
│   ├── articles/route.ts       # Articles CRUD
│   ├── tips/route.ts           # Tips CRUD  
│   ├── analyzer/route.ts       # Document analysis
│   ├── news/route.ts           # News aggregation
│   ├── faqs/route.ts           # FAQ management
│   └── approve/route.ts        # Content approval

components/
├── regulation/
│   ├── compliance-chat.tsx     # AI chat interface
│   ├── regulation-articles.tsx # Articles browser
│   ├── compliance-tips.tsx     # Tips display
│   ├── document-analyzer.tsx   # Document upload/analysis
│   ├── regulation-news.tsx     # News feed
│   └── regulation-faqs.tsx     # FAQ interface
└── admin/
    └── regulation-hub-widget.tsx # Admin dashboard

lib/
├── gemini.ts                   # Gemini AI service
└── regulation-data.ts          # Sanity CMS data layer
```

## Usage Instructions

### For Users
1. Navigate to `/regulation` from the main menu
2. Use the tabbed interface to access different features
3. Chat with the AI advisor for immediate compliance guidance
4. Browse articles and tips for in-depth information
5. Upload documents for automated compliance analysis

### For Administrators  
1. Access the admin dashboard
2. Navigate to the "Regulation" tab
3. Review and approve AI-generated content
4. Monitor usage analytics and user engagement
5. Manage content approval workflows

## Technical Details

### AI Integration
- Uses Google's Gemini Pro model for chat responses
- Context-aware responses specific to mining industry
- Document analysis with compliance recommendations
- Automated content generation for tips and summaries

### Data Management
- Sanity CMS for structured content storage
- Real-time synchronization between admin and public interfaces
- Approval workflows for quality control
- Analytics tracking for usage insights

### Security Features
- API rate limiting and error handling
- Input validation and sanitization
- Secure file upload handling
- Admin authentication and authorization

## Troubleshooting

### Common Issues
1. **API Key Errors**: Ensure GEMINI_API_KEY is properly set in .env.local
2. **Missing Dependencies**: Run `npm install @google/generative-ai`
3. **Build Errors**: Check TypeScript interfaces match Sanity schema
4. **Navigation Issues**: Verify Header component includes regulation link

### Testing
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/regulation`
3. Test each tab functionality
4. Verify admin dashboard integration
5. Check API endpoints are responding correctly

## Support
For technical support or feature requests, refer to the project documentation or contact the development team.
