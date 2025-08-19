import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const region = searchParams.get('region') || ''
    const experience = searchParams.get('experience') || ''

    if (!validateSanityConnection() || !sanityClient) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Build GROQ query for search
    let groqQuery = `*[_type == "salaryInsight" && approved == true`
    let params: any = {}

    // Add text search
    groqQuery += ` && jobTitle match $query`
    params.query = `*${query}*`

    // Add region filter
    if (region) {
      groqQuery += ` && region == $region`
      params.region = region
    }

    // Add experience filter
    if (experience) {
      groqQuery += ` && experienceLevel == $experience`
      params.experience = experience
    }

    groqQuery += `] | order(searchCount desc, createdAt desc) [0...10] {
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
    }`

  const client = sanityClient as any
  const results = await client.fetch(groqQuery, params)

    // Format results
    const formattedResults = results.map((result: any) => ({
      id: result._id,
      jobTitle: result.jobTitle,
      region: result.region,
      experienceLevel: result.experienceLevel,
      salaryRange: result.adminOverride || result.aiEstimate,
      requiredSkills: result.requiredSkills || [],
      careerTips: result.tips || [],
      industry: result.industry,
      searchCount: result.searchCount || 0
    }))

    // Update search count for found results
    if (formattedResults.length > 0) {
      const updatePromises = formattedResults.map((result: any) => 
        client.patch(result.id)
          .inc({ searchCount: 1 })
          .commit()
          .catch(() => {}) // Ignore update errors
      )
      
      // Don't wait for search count updates
      Promise.all(updatePromises)
    }

    return NextResponse.json({
      success: true,
      results: formattedResults,
      total: formattedResults.length,
      query: query
    })

  } catch (error) {
    console.error('Error searching salary insights:', error)
    return NextResponse.json({ 
      error: 'Search failed', 
      results: [],
      total: 0
    }, { status: 500 })
  }
}
