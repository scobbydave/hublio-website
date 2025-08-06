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
    const { itemId, notes } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Update approval status to rejected
    const result = await sanityClient.patch(itemId)
      .set({ 
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'admin',
        ...(notes && { rejectionReason: notes })
      })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'Content rejected',
      itemId: result._id
    })

  } catch (error) {
    console.error('Error rejecting content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
