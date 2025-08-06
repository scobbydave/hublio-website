import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data
    const analyticsData = {
      totalViews: 15420,
      uniqueVisitors: 8932,
      chatSessions: 1247,
      popularPages: [
        {
          path: '/',
          name: 'Homepage',
          views: 4892,
          change: +5.7
        },
        {
          path: '/vacancies',
          name: 'Job Vacancies',
          views: 3245,
          change: +12.5
        },
        {
          path: '/regulation',
          name: 'Regulation Hub',
          views: 2876,
          change: +8.3
        },
        {
          path: '/blog',
          name: 'Mining Blog',
          views: 2134,
          change: -2.1
        },
        {
          path: '/about',
          name: 'About Us',
          views: 987,
          change: +1.4
        }
      ],
      userActivity: {
        vacancyViews: 3245,
        blogReads: 2134,
        regulationHubUsage: 2876,
        contactInquiries: 156
      },
      trafficTrends: {
        today: 542,
        yesterday: 487,
        thisWeek: 3821,
        lastWeek: 3456
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
