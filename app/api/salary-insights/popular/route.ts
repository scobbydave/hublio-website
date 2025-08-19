import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient } from '@/lib/sanity'

export async function GET() {
  try {
    if (!validateSanityConnection() || !sanityClient) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Fetch most searched salary insights
  const client = sanityClient as any
  const popularInsights = await client.fetch(`
      *[_type == "salaryInsight" && approved == true && searchCount > 0] 
      | order(searchCount desc, createdAt desc) [0...8] {
        _id,
        jobTitle,
        region,
        aiEstimate,
        adminOverride,
        experienceLevel,
        tips,
        requiredSkills,
        industry,
        searchCount
      }
    `)

    // Format results
    const formattedInsights = popularInsights.map((insight: any) => ({
      id: insight._id,
      jobTitle: insight.jobTitle,
      region: insight.region,
      experienceLevel: insight.experienceLevel,
      salaryRange: insight.adminOverride || insight.aiEstimate,
      requiredSkills: insight.requiredSkills || [],
      careerTips: insight.tips || [],
      industry: insight.industry,
      searchCount: insight.searchCount || 0
    }))

    return NextResponse.json({
      success: true,
      insights: formattedInsights,
      total: formattedInsights.length
    })

  } catch (error) {
    console.error('Error fetching popular salary insights:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch popular jobs',
      insights: []
    }, { status: 500 })
  }
}
