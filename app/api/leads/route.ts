import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import { sendLeadNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message, source = 'unknown', chatContext } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    console.log('Processing lead submission:', { name, email, source })

    let leadId: string | undefined

    // Create lead document for Sanity (if available)
    if (sanityClient) {
      try {
        const leadDoc = {
          _type: 'lead',
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          message: message || undefined,
          source,
          status: 'new',
          chatContext: chatContext || undefined,
          createdAt: new Date().toISOString()
        }

        const result = await sanityClient.create(leadDoc)
        leadId = result._id
        console.log('Lead saved to Sanity:', result._id)
      } catch (sanityError) {
        console.error('Sanity save failed (continuing anyway):', sanityError)
      }
    }

    // Send notification email using our improved email system
    try {
      const emailResult = await sendLeadNotification({
        name,
        email,
        phone,
        company,
        message: message || chatContext || 'Lead captured from chat',
        source: source as 'chat' | 'contact-form' | 'newsletter',
        sessionId: `lead-${Date.now()}`
      })

      if (emailResult.success) {
        console.log('Lead notification sent successfully')
      } else {
        console.log('Lead notification failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('Failed to send lead notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      leadId: leadId || `temp-${Date.now()}`,
      message: 'Lead captured successfully'
    })

  } catch (error) {
    console.error('Lead capture failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Return empty array if no Sanity client
    if (!sanityClient) {
      return NextResponse.json({
        success: true,
        leads: [],
        count: 0,
        message: 'Sanity not configured'
      })
    }

    let query = `*[_type == "lead"]`
    const params: any = {}

    // Add filters
    const filters = []
    if (source) {
      filters.push('source == $source')
      params.source = source
    }
    if (status) {
      filters.push('status == $status')
      params.status = status
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`
    }

    query += ` | order(_createdAt desc)[0...${limit}] {
      _id,
      name,
      email,
      phone,
      company,
      message,
      source,
      status,
      chatContext,
      interest,
      _createdAt,
      followUpDate
    }`

    const leads = await sanityClient.fetch(query, params)

    return NextResponse.json({
      success: true,
      leads: leads || [],
      count: leads?.length || 0
    })
  } catch (error) {
    console.error('Leads fetch failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
