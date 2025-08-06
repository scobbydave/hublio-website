import { NextRequest, NextResponse } from 'next/server'
import { generateWithGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { type, title, category, region } = await request.json()
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Validate admin access
    if (key !== process.env.DASHBOARD_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 })
    }

    // Generate AI content based on type
    let prompt = ''
    let systemPrompt = 'You are an expert content creator for the South African mining industry. Create professional, accurate, and engaging content.'

    switch (type) {
      case 'blog':
        prompt = `Write a comprehensive blog post titled "${title}" for the South African mining industry. 
        ${category ? `Focus on the ${category} category. ` : ''}
        ${region ? `Tailor the content for the ${region} region. ` : ''}
        
        Structure the content with:
        - An engaging introduction
        - 3-4 main sections with clear headings
        - Practical insights and examples
        - A conclusion with key takeaways
        
        Keep the tone professional but accessible. Include relevant industry context and statistics where appropriate.`
        break

      case 'regulation':
        prompt = `Create a detailed regulation article titled "${title}" for South African mining operations.
        ${category ? `Focus on ${category} regulations. ` : ''}
        ${region ? `Include specific requirements for the ${region} region. ` : ''}
        
        Structure the content with:
        - Overview of the regulation
        - Key requirements and compliance steps
        - Penalties for non-compliance
        - Practical implementation tips
        - Recent updates or changes
        
        Ensure accuracy and include references to relevant legislation where appropriate.`
        break

      case 'tip':
        prompt = `Create a concise compliance tip titled "${title}" for mining operations.
        ${category ? `Focus on ${category} compliance. ` : ''}
        
        Provide:
        - A brief but comprehensive explanation (2-3 paragraphs)
        - Practical steps mining companies can take
        - Common mistakes to avoid
        - Key benefits of compliance
        
        Keep it actionable and easy to implement.`
        break

      case 'faq':
        prompt = `Create a comprehensive FAQ answer for the question: "${title}"
        ${category ? `Context: ${category} ` : ''}
        
        Provide:
        - A clear, detailed answer (2-4 paragraphs)
        - Step-by-step guidance if applicable
        - Common related questions or considerations
        - Relevant regulations or standards
        
        Make the answer helpful and complete while remaining concise.`
        break

      case 'salary':
        prompt = `Create salary insights and career advice for the position: "${title}" in South African mining.
        ${region ? `Focus on the ${region} market. ` : ''}
        
        Provide:
        - Market overview for this position
        - Factors affecting salary ranges
        - Career progression opportunities
        - Skills that can increase earning potential
        - Industry trends affecting compensation
        
        Keep the advice practical and current.`
        break

      default:
        prompt = `Create professional content titled "${title}" for the South African mining industry.
        ${category ? `Category: ${category}. ` : ''}
        ${region ? `Region: ${region}. ` : ''}
        
        Provide comprehensive, well-structured content that is informative and engaging.`
    }

    const generatedContent = await generateWithGemini(prompt, systemPrompt)
    
    // Generate an excerpt for blog posts
    let excerpt = ''
    if (type === 'blog') {
      const excerptPrompt = `Create a compelling 1-2 sentence excerpt for this blog post titled "${title}". The excerpt should summarize the key value and encourage reading. Keep it under 150 characters.`
      excerpt = await generateWithGemini(excerptPrompt, systemPrompt)
    }

    return NextResponse.json({
      content: generatedContent,
      excerpt: excerpt || generatedContent.substring(0, 150) + '...',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json({ 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
