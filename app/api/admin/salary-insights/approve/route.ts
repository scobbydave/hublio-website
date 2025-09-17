export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient } from '@/lib/sanity'

// use shared sanity client and validate configuration at runtime
const sanity = sanityClient

export async function POST(request: NextRequest) {
  try {
    const { insightId } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    if (!insightId) {
      return NextResponse.json({ error: 'Insight ID is required' }, { status: 400 })
    }

    // Update the salary insight to approved
  const client = sanity as any
  const result = await client.patch(insightId)
      .set({ 
        approved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin'
      })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'Salary insight approved successfully',
      insightId: result._id
    })

  } catch (error) {
    console.error('Error approving salary insight:', error)
    return NextResponse.json({ 
      error: 'Failed to approve salary insight',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
