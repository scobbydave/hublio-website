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

export async function GET() {
  try {
    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Fetch most searched salary insights
    const popularInsights = await sanityClient.fetch(`
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
