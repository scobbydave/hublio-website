export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    const {
      type,
      title,
      content,
      category,
      region,
      tags,
      aiAssisted,
      publishImmediately,
      excerpt,
      metadata
    } = contentData

    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Title, content, and type are required' }, { status: 400 })
    }

    let result = null

    if (publishImmediately && !aiAssisted) {
      // Publish directly to main collections if not AI-assisted
      if (!validateSanityConnection() || !sanityClient) {
        return NextResponse.json({ error: 'Sanity not configured for publish', status: 500 })
      }

      const client = sanityClient as any

      switch (type) {
        case 'blog':
          result = await client.create({
            _type: 'blogPost',
            title,
            slug: { 
              _type: 'slug',
              current: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            },
            body: [
              {
                _type: 'block',
                _key: 'content',
                style: 'normal',
                children: [{ _type: 'span', text: content }]
              }
            ],
            excerpt: excerpt || content.substring(0, 150) + '...',
            category: category || 'Industry News',
            tags: tags || [],
            aiGenerated: false,
            published: true,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          })
          break

        case 'regulation':
          result = await client.create({
            _type: 'regulationArticle',
            title,
            slug: { 
              _type: 'slug',
              current: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            },
            body: [
              {
                _type: 'block',
                _key: 'content',
                style: 'normal',
                children: [{ _type: 'span', text: content }]
              }
            ],
            category: category || 'Compliance',
            region: region || 'South Africa',
            tags: tags || [],
            aiGenerated: false,
            published: true,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          })
          break

        case 'tip':
          result = await client.create({
            _type: 'complianceTip',
            title,
            description: content,
            category: category || 'general',
            priority: 'medium',
            aiGenerated: false,
            approved: true,
            tags: tags || [],
            createdAt: new Date().toISOString()
          })
          break

        case 'faq':
          result = await client.create({
            _type: 'regulationFAQ',
            question: title,
            answer: [
              {
                _type: 'block',
                _key: 'answer',
                style: 'normal',
                children: [{ _type: 'span', text: content }]
              }
            ],
            category: category || 'general',
            aiGenerated: false,
            approved: true,
            tags: tags || [],
            createdAt: new Date().toISOString()
          })
          break

        default:
          result = await sanityClient.create({
            _type: 'manualContent',
            type,
            title,
            slug: { 
              _type: 'slug',
              current: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            },
            body: [
              {
                _type: 'block',
                _key: 'content',
                style: 'normal',
                children: [{ _type: 'span', text: content }]
              }
            ],
            excerpt: excerpt || content.substring(0, 150) + '...',
            tags: tags || [],
            category: category || '',
            region: region || '',
            published: true,
            aiAssisted: false,
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          })
      }
      } else {
      // Send to approval queue if AI-assisted or not publishing immediately
      if (!validateSanityConnection() || !sanityClient) {
        // Return success but indicate that the item would be queued
        return NextResponse.json({ success: true, message: 'Content would be queued for approval (Sanity not configured)' })
      }

      const client = sanityClient as any

      result = await client.create({
        _type: 'approval',
        title,
        content,
        type,
        aiGenerated: aiAssisted,
        status: 'pending',
        category: category || '',
        region: region || '',
        tags: tags || [],
        metadata: {
          ...(metadata || {}),
          ...(excerpt && { excerpt })
        },
        priority: 'medium',
        createdAt: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: publishImmediately && !aiAssisted ? 'Content published successfully' : 'Content submitted for approval',
      contentId: result._id,
      needsApproval: !publishImmediately || aiAssisted
    })

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ 
      error: 'Failed to create content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
