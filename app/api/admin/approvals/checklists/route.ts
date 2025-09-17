export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock approval items for checklists
    const items = [
      {
        id: 'checklist-1',
        type: 'checklist',
        title: 'Monthly Environmental Compliance Checklist',
        content: 'Comprehensive checklist for monthly environmental compliance review including water quality testing, air quality monitoring, waste management verification, and regulatory reporting requirements.',
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        category: 'Environmental',
        priority: 'medium'
      }
    ]

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching approval checklists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval checklists' },
      { status: 500 }
    )
  }
}
