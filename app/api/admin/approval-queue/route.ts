export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient as sanity } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection() || !sanity) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    // Fetch all pending approval items
    const client = sanity as any
    const approvalItems = await client.fetch(`
      *[_type == "approval" && status == "pending"] | order(createdAt desc) {
        _id,
        title,
        content,
        type,
        aiGenerated,
        status,
        category,
        region,
        tags,
        metadata,
        createdAt,
        priority
      }
    `)

    // Calculate stats
    const stats = {
      total: approvalItems.length,
      byType: approvalItems.reduce((acc: Record<string, number>, item: any) => {
        acc[item.type] = (acc[item.type] || 0) + 1
        return acc
      }, {}),
      byPriority: approvalItems.reduce((acc: Record<string, number>, item: any) => {
        acc[item.priority || 'medium'] = (acc[item.priority || 'medium'] || 0) + 1
        return acc
      }, { high: 0, medium: 0, low: 0 })
    }

    // Format items for response
  const formattedItems = approvalItems.map((item: any) => ({
      id: item._id,
      type: item.type,
      title: item.title,
      content: item.content,
      aiGenerated: item.aiGenerated || false,
      createdAt: item.createdAt,
      category: item.category,
      region: item.region,
      tags: item.tags || [],
      metadata: item.metadata || {},
      priority: item.priority || 'medium',
      status: item.status
    }))

  return NextResponse.json({ items: formattedItems, stats })

  } catch (error) {
    console.error('Error fetching approval queue:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
