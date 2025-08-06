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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      // Provide sample data when Sanity is not configured
      console.log('Sanity not configured, providing sample approval data')
      
      const sampleItems = [
        {
          id: '1',
          type: 'tip',
          title: 'Regular Equipment Maintenance Checks',
          content: 'Ensure daily pre-operation inspections of all mining equipment to prevent costly breakdowns and maintain safety standards. Check hydraulic fluid levels, tire pressure, and engine oil.',
          aiGenerated: true,
          createdAt: new Date().toISOString(),
          category: 'maintenance',
          region: 'General',
          tags: ['equipment', 'maintenance', 'safety'],
          metadata: {},
          priority: 'high',
          status: 'pending'
        },
        {
          id: '2',
          type: 'faq',
          title: 'What are the MHSA requirements for underground ventilation?',
          content: 'Underground mines must maintain adequate ventilation as per MHSA regulations Section 12.5. Minimum air velocity requirements are 0.25 m/s in working areas and escape routes must have independent ventilation systems.',
          aiGenerated: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          category: 'safety',
          region: 'South Africa',
          tags: ['MHSA', 'ventilation', 'underground'],
          metadata: { originalQuestion: 'MHSA ventilation requirements?' },
          priority: 'medium',
          status: 'pending'
        },
        {
          id: '3',
          type: 'salary',
          title: 'Mining Engineer - Johannesburg',
          content: 'Salary estimate based on market research: R450,000 - R650,000 annually. Includes benefits such as medical aid, pension fund, and annual bonus. Senior level positions may reach R800,000+.',
          aiGenerated: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          category: 'engineering',
          region: 'Gauteng',
          tags: ['mining engineer', 'salary', 'johannesburg'],
          metadata: {
            jobTitle: 'Mining Engineer',
            salaryRange: 'R450,000 - R650,000',
            region: 'Gauteng'
          },
          priority: 'low',
          status: 'pending'
        },
        {
          id: '4',
          type: 'blog',
          title: 'New Digital Mining Technologies Transforming the Industry',
          content: 'The mining industry is experiencing a digital revolution with IoT sensors, autonomous vehicles, and AI-powered predictive maintenance. These technologies are improving safety, efficiency, and environmental sustainability.',
          aiGenerated: true,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          category: 'technology',
          region: 'Global',
          tags: ['digital transformation', 'IoT', 'automation'],
          metadata: {},
          priority: 'medium',
          status: 'pending'
        }
      ]

      const stats = {
        total: sampleItems.length,
        byType: { tip: 1, faq: 1, salary: 1, blog: 1 },
        byPriority: { high: 1, medium: 2, low: 1 }
      }

      return NextResponse.json({
        items: sampleItems,
        stats,
        message: 'Sample approval data - Sanity CMS not configured'
      })
    }

    // Fetch all pending approval items
    const approvalItems = await sanityClient.fetch(`
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

    return NextResponse.json({
      items: formattedItems,
      stats
    })

  } catch (error) {
    console.error('Error fetching approval queue:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
