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
    const { itemId, notes, key } = await request.json()

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      // If Sanity is not available, just return success for testing
      console.log('Sanity not configured, returning mock success')
      return NextResponse.json({ 
        success: true, 
        message: 'Mock rejection - Sanity CMS not configured',
        itemId 
      })
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
