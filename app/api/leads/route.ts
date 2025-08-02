import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { Resend } from 'resend'

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message, source = 'unknown', chatContext } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Create lead document
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

    // Save to Sanity
    const result = await sanity.create(leadDoc)
    console.log('Lead created:', result._id)

    // Send notification email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Hublio AI <noreply@hublio.com>',
          to: ['leads@hublio.com'], // Replace with your actual leads email
          subject: `New Lead from ${source}: ${name}`,
          html: `
            <h2>New Lead Captured</h2>
            <p><strong>Source:</strong> ${source}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            
            ${chatContext ? `
              <h3>Chat Context</h3>
              <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${chatContext}</pre>
            ` : ''}
            
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          `
        })
        console.log('Lead notification email sent')
      } catch (emailError) {
        console.error('Failed to send lead notification email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      leadId: result._id,
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

    const leads = await sanity.fetch(query, params)

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
