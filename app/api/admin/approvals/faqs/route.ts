import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock approval items for FAQs
    const items = [
      {
        id: 'faq-1',
        type: 'faq',
        title: 'What are the latest water use license requirements?',
        content: 'Water use licenses now require quarterly monitoring reports and must include real-time water quality data from certified monitoring equipment.',
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        category: 'Environmental',
        priority: 'medium'
      }
    ]

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching approval FAQs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval FAQs' },
      { status: 500 }
    )
  }
}
