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

    // Get the approval item
    const approvalItem = await sanityClient.fetch(`
      *[_type == "approval" && _id == $itemId][0] {
        _id,
        title,
        content,
        type,
        category,
        region,
        tags,
        metadata,
        aiGenerated,
        createdAt
      }
    `, { itemId })

    if (!approvalItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Update approval status
    await sanityClient.patch(itemId)
      .set({ 
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin',
        ...(notes && { approvalNotes: notes })
      })
      .commit()

    // Create the actual content based on type
    let publishedContent = null

    switch (approvalItem.type) {
      case 'blog':
        publishedContent = await sanityClient.create({
          _type: 'blogPost',
          title: approvalItem.title,
          slug: { 
            _type: 'slug',
            current: approvalItem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
          },
          body: [
            {
              _type: 'block',
              _key: 'content',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: approvalItem.content
                }
              ]
            }
          ],
          excerpt: approvalItem.content.substring(0, 150) + '...',
          category: approvalItem.category,
          tags: approvalItem.tags,
          aiGenerated: approvalItem.aiGenerated,
          published: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        })
        break

      case 'tip':
        publishedContent = await sanityClient.create({
          _type: 'complianceTip',
          title: approvalItem.title,
          description: approvalItem.content,
          category: approvalItem.category || 'general',
          priority: approvalItem.metadata?.priority || 'medium',
          aiGenerated: approvalItem.aiGenerated,
          approved: true,
          tags: approvalItem.tags,
          createdAt: new Date().toISOString()
        })
        break

      case 'faq':
        publishedContent = await sanityClient.create({
          _type: 'regulationFAQ',
          question: approvalItem.title,
          answer: [
            {
              _type: 'block',
              _key: 'answer',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: approvalItem.content
                }
              ]
            }
          ],
          category: approvalItem.category || 'general',
          aiGenerated: approvalItem.aiGenerated,
          approved: true,
          tags: approvalItem.tags,
          createdAt: new Date().toISOString()
        })
        break

      case 'regulation':
        publishedContent = await sanityClient.create({
          _type: 'regulationArticle',
          title: approvalItem.title,
          slug: { 
            _type: 'slug',
            current: approvalItem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
          },
          body: [
            {
              _type: 'block',
              _key: 'content',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: approvalItem.content
                }
              ]
            }
          ],
          category: approvalItem.category,
          region: approvalItem.region,
          tags: approvalItem.tags,
          aiGenerated: approvalItem.aiGenerated,
          published: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        })
        break

      case 'salary':
        publishedContent = await sanityClient.create({
          _type: 'salaryInsight',
          jobTitle: approvalItem.title,
          slug: { 
            _type: 'slug',
            current: approvalItem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
          },
          region: approvalItem.region || 'South Africa',
          aiEstimate: approvalItem.metadata?.aiEstimate || {
            min: 0,
            max: 0,
            average: 0,
            currency: 'ZAR'
          },
          experienceLevel: approvalItem.metadata?.experienceLevel || 'mid',
          tips: [approvalItem.content],
          requiredSkills: approvalItem.metadata?.requiredSkills || [],
          industry: approvalItem.metadata?.industry || 'General Mining',
          searchCount: 0,
          approved: true,
          aiGenerated: approvalItem.aiGenerated,
          createdAt: new Date().toISOString()
        })
        break

      case 'document':
        publishedContent = await sanityClient.create({
          _type: 'documentAnalysis',
          fileName: approvalItem.metadata?.fileName || 'Document',
          summary: approvalItem.content,
          checklist: approvalItem.metadata?.checklist || [],
          category: approvalItem.category || 'compliance',
          uploadedBy: 'admin',
          approved: true,
          createdAt: new Date().toISOString()
        })
        break
    }

    return NextResponse.json({
      success: true,
      message: 'Content approved and published',
      publishedContent: publishedContent?._id
    })

  } catch (error) {
    console.error('Error approving content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
