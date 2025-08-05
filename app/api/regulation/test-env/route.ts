import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    const geminiKey = process.env.GEMINI_API_KEY;
    const newsKey = process.env.NEWS_API_KEY;
    const sanityProjectId = process.env.SANITY_PROJECT_ID;
    const dashboardKey = process.env.DASHBOARD_KEY;

    return NextResponse.json({
      status: 'Environment Check',
      env_vars: {
        GEMINI_API_KEY: geminiKey ? 'Available (starts with: ' + geminiKey.substring(0, 10) + '...)' : 'Not set',
        NEWS_API_KEY: newsKey ? 'Available' : 'Not set',
        SANITY_PROJECT_ID: sanityProjectId ? 'Available' : 'Not set',
        DASHBOARD_KEY: dashboardKey ? 'Available' : 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      message: 'Check your environment variables above'
    });

  } catch (error: any) {
    console.error('Environment check error:', error);
    
    return NextResponse.json(
      { error: 'Failed to check environment', details: error.message },
      { status: 500 }
    );
  }
}
