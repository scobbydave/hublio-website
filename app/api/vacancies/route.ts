import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const experienceLevel = searchParams.get('experience')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = `*[_type == "vacancy" && isActive == true]`
    const params: any = {}

    // Add filters
    const filters = []
    if (category) {
      filters.push('category == $category')
      params.category = category
    }
    if (location) {
      filters.push('(location match $location || country match $location)')
      params.location = `*${location}*`
    }
    if (experienceLevel) {
      filters.push('experienceLevel == $experienceLevel')
      params.experienceLevel = experienceLevel
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`
    }

    query += ` | order(postedDate desc)[0...${limit}] {
      _id,
      title,
      company,
      location,
      country,
      salary,
      description,
      aiSummary,
      requirements,
      benefits,
      jobType,
      experienceLevel,
      category,
      externalUrl,
      postedDate,
      expiryDate
    }`

    const vacancies = await sanity.fetch(query, params)

    return NextResponse.json({
      success: true,
      vacancies: vacancies || [],
      count: vacancies?.length || 0
    })
  } catch (error) {
    console.error('Vacancies API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vacancies' },
      { status: 500 }
    )
  }
}

// For admin dashboard - get vacancy stats
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'stats') {
      const stats = await sanity.fetch(`{
        "total": count(*[_type == "vacancy"]),
        "active": count(*[_type == "vacancy" && isActive == true]),
        "byCategory": *[_type == "vacancy"] | {
          "category": category,
          "count": count(*[_type == "vacancy" && category == ^.category])
        } | order(count desc),
        "byCountry": *[_type == "vacancy"] | {
          "country": country,
          "count": count(*[_type == "vacancy" && country == ^.country])
        } | order(count desc),
        "recent": *[_type == "vacancy"] | order(postedDate desc)[0...10] {
          _id,
          title,
          company,
          location,
          postedDate
        }
      }`)

      return NextResponse.json({
        success: true,
        stats
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Vacancies stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vacancy stats' },
      { status: 500 }
    )
  }
}
