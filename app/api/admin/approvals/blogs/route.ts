import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock approval items for blogs
    const items = [
      {
        id: 'blog-1',
        type: 'blog',
        title: 'Digital Transformation in Mining Compliance',
        content: 'The mining industry is rapidly adopting digital technologies to streamline compliance processes and improve operational efficiency. From automated reporting systems to AI-powered risk assessment tools, technology is revolutionizing how mining companies manage regulatory requirements...',
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        category: 'Technology',
        priority: 'low'
      },
      {
        id: 'blog-2',
        type: 'blog',
        title: 'Future of Sustainable Mining Practices',
        content: 'Sustainable mining practices are becoming increasingly important as environmental regulations tighten and stakeholder expectations evolve. This comprehensive guide explores the latest trends in sustainable mining...',
        aiGenerated: true,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        category: 'Sustainability',
        priority: 'medium'
      },
      {
        id: 'blog-3',
        type: 'blog',
        title: 'Safety Innovation in Underground Mining',
        content: 'Underground mining safety has seen remarkable innovations in recent years, from advanced sensor networks to predictive analytics systems that can identify potential hazards before they occur...',
        aiGenerated: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        category: 'Safety',
        priority: 'high'
      }
    ]

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching approval blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approval blogs' },
      { status: 500 }
    )
  }
}
