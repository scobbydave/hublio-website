import { NextRequest, NextResponse } from 'next/server'
import { matchUserToJob } from '@/lib/ai/jobs'
import { checkRateLimit, trackEvent } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Rate limiting - 10 matches per hour per IP
    const isAllowed = await checkRateLimit(`ai_match:${clientIp}`, 10, 3600)
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { userSkills, jobDescription, jobRequirements = [] } = await request.json()

    if (!userSkills || !jobDescription) {
      return NextResponse.json(
        { success: false, error: 'User skills and job description are required' },
        { status: 400 }
      )
    }

    // Perform AI matching
    const match = await matchUserToJob(userSkills, jobDescription, jobRequirements)

    // Track the event for analytics
    await trackEvent('ai_match', {
      score: match.score,
      clientIp,
      hasRecommendations: match.recommendations.length > 0,
      hasMissingSkills: match.missingSkills.length > 0
    })

    return NextResponse.json({
      success: true,
      match
    })
  } catch (error) {
    console.error('AI Match API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform AI matching' },
      { status: 500 }
    )
  }
}
