import { NextRequest, NextResponse } from 'next/server'

interface ApprovalItem {
  id: string
  type: string
  title: string
  content: string
  aiGenerated: boolean
  createdAt: string
  category?: string
  priority: string
}

export async function GET(request: NextRequest) {
  try {
    // Mock approval items for documents
    const items: ApprovalItem[] = [
      // No pending documents for now
    ]

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching approval documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval documents' },
      { status: 500 }
    )
  }
}
