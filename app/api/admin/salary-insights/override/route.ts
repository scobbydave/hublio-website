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

export async function POST(request: NextRequest) {
  try {
    const { insightId, override } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    if (!insightId || !override) {
      return NextResponse.json({ error: 'Insight ID and override data are required' }, { status: 400 })
    }

    // Update the salary insight with admin override
    const result = await sanityClient.patch(insightId)
      .set({ 
        adminOverride: {
          min: override.min || 0,
          max: override.max || 0,
          average: override.average || 0,
          notes: override.notes || ''
        },
        lastUpdated: new Date().toISOString(),
        overriddenBy: 'admin'
      })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'Salary override updated successfully',
      insightId: result._id
    })

  } catch (error) {
    console.error('Error updating salary override:', error)
    return NextResponse.json({ 
      error: 'Failed to update salary override',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
