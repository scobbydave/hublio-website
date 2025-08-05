# 🔑 Quick Setup Guide for Local Development

## **The Problem**
Your Hublio website works on Vercel because the environment variables are configured there, but locally they're missing. That's why you're seeing "API key not valid" errors.

## **Solution: Copy Environment Variables from Vercel to Local**

### **Step 1: Get Your Gemini API Key from Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your hublio-website project
3. Go to **Settings** → **Environment Variables**
4. Find `GEMINI_API_KEY` and copy its value

### **Step 2: Update Local Environment File**
Open the `.env.local` file I created and replace:
```bash
GEMINI_API_KEY=your_gemini_api_key_from_vercel
```
With your actual key:
```bash
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### **Step 3: Copy Other Variables (Optional but Recommended)**
Also copy these from Vercel if you have them:
- `NEWS_API_KEY`
- `SANITY_API_TOKEN`
- `DASHBOARD_KEY`
- `OPENAI_API_KEY`

### **Step 4: Restart Development Server**
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## **If You Don't Have a Gemini API Key Yet**

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Get API Key" 
4. Create a new project or use existing
5. Generate API key
6. Copy to both your local `.env.local` AND Vercel environment variables

## **Test Everything Works**
After updating the environment variables:
1. Visit: `http://localhost:3000/regulation`
2. Try the chat feature
3. If it works locally, commit and push to GitHub
4. Vercel will auto-deploy with the same environment variables

## **Why This Happened**
- Vercel has your environment variables configured
- Your local development doesn't have access to Vercel's environment
- The regulation hub needs API keys to function
- Without keys, all AI features fail with "API key not valid" errors

## **Current Status**
✅ Regulation hub is built and integrated  
❌ Missing environment variables locally  
✅ Should work fine on Vercel (with your existing environment variables)
