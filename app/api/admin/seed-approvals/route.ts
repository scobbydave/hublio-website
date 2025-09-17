export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()

    // Validate admin access
    if (key !== 'hublio-secure-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    // Create sample approval items
    const sampleItems = [
      {
        _type: 'approval',
        title: 'New Mining Safety Protocol for Underground Operations',
        content: 'This comprehensive safety protocol outlines the new requirements for underground mining operations, including mandatory safety checks, equipment inspections, and emergency procedures. The protocol has been developed in response to recent industry incidents and aims to improve worker safety significantly.',
        type: 'tip',
        status: 'pending',
        aiGenerated: true,
        category: 'Safety',
        region: 'South Africa',
        priority: 'high',
        tags: ['safety', 'underground', 'protocol'],
        createdAt: new Date().toISOString(),
        metadata: {
          estimatedReadTime: '5 minutes',
          targetAudience: 'Mine operators'
        }
      },
      {
        _type: 'approval',
        title: 'How to Properly Maintain Heavy Mining Equipment',
        content: 'Regular maintenance of heavy mining equipment is crucial for operational efficiency and safety. This guide covers daily, weekly, and monthly maintenance procedures for excavators, haul trucks, and drilling equipment.',
        type: 'blog',
        status: 'pending',
        aiGenerated: false,
        category: 'Equipment',
        region: 'Gauteng',
        priority: 'medium',
        tags: ['maintenance', 'equipment', 'efficiency'],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        metadata: {
          author: 'Mining Engineer',
          wordCount: 1500
        }
      },
      {
        _type: 'approval',
        title: 'What are the environmental compliance requirements for new mining projects?',
        content: 'New mining projects in South Africa must comply with various environmental regulations. This FAQ covers the key requirements including Environmental Impact Assessments (EIA), Water Use Licenses, and ongoing monitoring obligations.',
        type: 'faq',
        status: 'pending',
        aiGenerated: true,
        category: 'Environmental',
        region: 'South Africa',
        priority: 'high',
        tags: ['compliance', 'environmental', 'regulations'],
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        metadata: {
          difficulty: 'intermediate',
          relatedRegulations: ['NEMA', 'NWA']
        }
      },
      {
        _type: 'approval',
        title: 'Updated MHSA Regulations for 2024',
        content: 'The Mine Health and Safety Act has been updated with new provisions for 2024. Key changes include enhanced reporting requirements, updated safety standards for machinery, and new penalties for non-compliance.',
        type: 'regulation',
        status: 'pending',
        aiGenerated: false,
        category: 'Health & Safety',
        region: 'South Africa',
        priority: 'high',
        tags: ['MHSA', 'regulations', 'compliance', '2024'],
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        metadata: {
          effectiveDate: '2024-01-01',
          complianceDeadline: '2024-03-31'
        }
      },
      {
        _type: 'approval',
        title: 'Gold Analyst Salary Range in Johannesburg',
        content: 'Based on current market data, Gold Analysts in Johannesburg earn between R450,000 and R750,000 annually. Senior positions can command up to R1,200,000. The role requires strong analytical skills and experience with precious metals markets.',
        type: 'salary',
        status: 'pending',
        aiGenerated: true,
        category: 'Career',
        region: 'Gauteng',
        priority: 'medium',
        tags: ['salary', 'gold', 'analyst', 'johannesburg'],
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        metadata: {
          jobTitle: 'Gold Analyst',
          salaryRange: 'R450,000 - R750,000',
          experienceLevel: 'Mid-Senior'
        }
      },
      {
        _type: 'approval',
        title: 'Mining Innovation Summit 2024',
        content: 'Join industry leaders at the Mining Innovation Summit 2024 in Cape Town. The event will feature presentations on sustainable mining practices, new technologies, and digital transformation in the mining sector.',
        type: 'event',
        status: 'pending',
        aiGenerated: false,
        category: 'Industry Events',
        region: 'Western Cape',
        priority: 'low',
        tags: ['event', 'innovation', 'summit', 'cape town'],
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        metadata: {
          eventDate: '2024-09-15',
          location: 'Cape Town Convention Centre',
          ticketPrice: 'R2,500'
        }
      },
      {
        _type: 'approval',
        title: 'Acme Mining Solutions - Equipment Supplier Profile',
        content: 'Acme Mining Solutions specializes in heavy-duty mining equipment and has been serving the South African mining industry for over 20 years. They offer excavators, haul trucks, and specialized underground equipment with comprehensive maintenance support.',
        type: 'supplier',
        status: 'pending',
        aiGenerated: true,
        category: 'Equipment Suppliers',
        region: 'South Africa',
        priority: 'low',
        tags: ['supplier', 'equipment', 'machinery'],
        createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        metadata: {
          companyName: 'Acme Mining Solutions',
          yearsInBusiness: 20,
          specializations: ['Heavy Equipment', 'Maintenance']
        }
      }
    ]

    if (!validateSanityConnection() || !sanityClient) {
      return NextResponse.json({ success: true, message: `Would create ${sampleItems.length} items (Sanity not configured)`, items: [] })
    }

    const client = sanityClient as any
    // Create all items in Sanity
    const results = []
    for (const item of sampleItems) {
      const result = await client.create(item)
      results.push(result)
    }

    return NextResponse.json({
      success: true,
      message: `Created ${results.length} sample approval items`,
      items: results.map(r => ({ id: r._id, title: r.title, type: r.type }))
    })

  } catch (error) {
    console.error('Error creating sample approval items:', error)
    return NextResponse.json(
      { error: 'Failed to create sample approval items' },
      { status: 500 }
    )
  }
}
