export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient as sharedSanityClient } from '@/lib/sanity'
import { generateWithGemini } from '@/lib/gemini'

const sanity = sharedSanityClient

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, region, experienceLevel } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!validateSanityConnection()) {
      return NextResponse.json({ error: 'Sanity not configured' }, { status: 500 })
    }

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 })
    }

    // Check if salary insight already exists
  const client = sanity as any
  const existing = await client.fetch(`
      *[_type == "salaryInsight" && jobTitle == $jobTitle && region == $region && experienceLevel == $experienceLevel][0]
    `, { jobTitle, region: region || 'South Africa', experienceLevel: experienceLevel || 'mid' })

    if (existing) {
      return NextResponse.json({ 
        error: 'Salary insight already exists for this combination',
        existingId: existing._id 
      }, { status: 409 })
    }

    // Generate AI salary estimate
    const prompt = `As a South African mining industry salary expert, provide a realistic salary estimate for the position "${jobTitle}" in the ${region || 'South Africa'} region for someone with ${experienceLevel || 'mid'} level experience.

Consider:
- Current South African mining industry standards
- Regional cost of living and market conditions
- Experience level requirements
- Industry demand and supply
- Recent market trends

Provide your response in this exact JSON format:
{
  "salaryEstimate": {
    "min": [minimum annual salary in ZAR],
    "max": [maximum annual salary in ZAR],  
    "average": [average annual salary in ZAR]
  },
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "careerTips": [
    "tip1",
    "tip2", 
    "tip3"
  ],
  "industryCategory": "[most relevant mining category]"
}`

    const aiResponse = await generateWithGemini(prompt, 'You are a mining industry salary expert. Provide accurate, realistic salary data for South African mining positions.')
    
    let parsedResponse
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      // Fallback with default values
      parsedResponse = {
        salaryEstimate: {
          min: 350000,
          max: 650000,
          average: 500000
        },
        requiredSkills: ['Mining Operations', 'Safety Compliance', 'Industry Knowledge'],
        careerTips: [
          'Gain relevant certifications in mining and safety',
          'Build experience with mining equipment and processes',
          'Develop leadership and management skills'
        ],
        industryCategory: 'General Mining'
      }
    }

    // Create salary insight in Sanity
  const salaryInsight = await client.create({
      _type: 'salaryInsight',
      jobTitle,
      slug: { 
        _type: 'slug',
        current: `${jobTitle}-${region || 'south-africa'}-${experienceLevel || 'mid'}`
          .toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      },
      region: region || 'South Africa',
      aiEstimate: {
        min: parsedResponse.salaryEstimate.min,
        max: parsedResponse.salaryEstimate.max,
        average: parsedResponse.salaryEstimate.average,
        currency: 'ZAR'
      },
      experienceLevel: experienceLevel || 'mid',
      tips: parsedResponse.careerTips || [],
      requiredSkills: parsedResponse.requiredSkills || [],
      industry: parsedResponse.industryCategory || 'General Mining',
      searchCount: 0,
      approved: false, // Require admin approval
      aiGenerated: true,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'AI salary estimate generated successfully',
      salaryInsight: {
        id: salaryInsight._id,
        jobTitle,
        region: region || 'South Africa',
        experienceLevel: experienceLevel || 'mid',
        aiEstimate: parsedResponse.salaryEstimate,
        requiredSkills: parsedResponse.requiredSkills,
        tips: parsedResponse.careerTips,
        industry: parsedResponse.industryCategory
      }
    })

  } catch (error) {
    console.error('Error generating AI salary estimate:', error)
    return NextResponse.json({ 
      error: 'Failed to generate salary estimate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
