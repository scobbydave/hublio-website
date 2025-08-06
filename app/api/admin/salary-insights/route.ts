import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection } from '@/lib/sanity'
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    // Fetch salary insights
    const salaryInsights = await sanityClient.fetch(`
      *[_type == "salaryInsight"] | order(createdAt desc) {
        _id,
        jobTitle,
        region,
        aiEstimate,
        adminOverride,
        experienceLevel,
        tips,
        requiredSkills,
        industry,
        searchCount,
        approved,
        aiGenerated,
        createdAt,
        lastUpdated
      }
    `)

    // Calculate stats
    const totalInsights = salaryInsights.length
    const pendingApproval = salaryInsights.filter((insight: any) => !insight.approved).length
    const totalSearches = salaryInsights.reduce((sum: number, insight: any) => sum + (insight.searchCount || 0), 0)
    
    // Find most searched job title
    const mostSearched = salaryInsights
      .sort((a: any, b: any) => (b.searchCount || 0) - (a.searchCount || 0))[0]?.jobTitle || 'N/A'

    // Calculate average salary range
    const validInsights = salaryInsights.filter((insight: any) => 
      insight.aiEstimate?.average || insight.adminOverride?.average
    )
    const avgSalary = validInsights.length > 0 
      ? validInsights.reduce((sum: number, insight: any) => {
          const salary = insight.adminOverride?.average || insight.aiEstimate?.average || 0
          return sum + salary
        }, 0) / validInsights.length
      : 0

    const stats = {
      totalInsights,
      pendingApproval,
      mostSearched,
      avgSalaryRange: avgSalary > 0 ? `R${Math.round(avgSalary).toLocaleString()}` : 'N/A',
      totalSearches
    }

    return NextResponse.json({
      insights: salaryInsights,
      stats
    })

  } catch (error) {
    console.error('Error fetching salary insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
