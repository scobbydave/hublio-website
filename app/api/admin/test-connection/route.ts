export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const url = new URL(request.url)
    const key = url.searchParams.get('key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!key || key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, settings } = await request.json()

    switch (type) {
      case 'gemini':
        return await testGeminiConnection(settings.geminiApiKey)
      
      case 'sanity':
        return await testSanityConnection(settings.sanityProjectId, settings.sanityApiToken)
      
      case 'news':
        return await testNewsApiConnection(settings.newsApiKey)
      
      case 'resend':
        return await testResendConnection(settings.resendApiKey)
      
      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown API type'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error testing connection:', error)
    return NextResponse.json({
      success: false,
      message: 'Connection test failed'
    }, { status: 500 })
  }
}

async function testGeminiConnection(apiKey: string) {
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: 'Gemini API key is required'
    })
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models?key=' + apiKey
    )

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Gemini API connection successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid Gemini API key'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Gemini API'
    })
  }
}

async function testSanityConnection(projectId: string, token: string) {
  if (!projectId) {
    return NextResponse.json({
      success: false,
      message: 'Sanity Project ID is required'
    })
  }

  try {
    const sanityUrl = `https://${projectId}.api.sanity.io/v1/projects/${projectId}`
    const response = await fetch(sanityUrl, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Sanity CMS connection successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid Sanity credentials'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Sanity CMS'
    })
  }
}

async function testNewsApiConnection(apiKey: string) {
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: 'News API key is required'
    })
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${apiKey}`
    )

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'News API connection successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid News API key'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to News API'
    })
  }
}

async function testResendConnection(apiKey: string) {
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: 'Resend API key is required'
    })
  }

  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Resend API connection successful'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid Resend API key'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Resend API'
    })
  }
}
