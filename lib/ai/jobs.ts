import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface JobMatchResult {
  score: number // 0-100
  reasons: string[]
  recommendations: string[]
  missingSkills: string[]
}

// Fallback keyword matching when AI is unavailable
function performKeywordMatching(
  userSkills: string,
  jobDescription: string,
  jobRequirements: string[]
): JobMatchResult {
  const normalizeText = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, ' ')
  
  const userWords = normalizeText(userSkills).split(/\s+/).filter(word => word.length > 2)
  const jobWords = normalizeText(`${jobDescription} ${jobRequirements.join(' ')}`).split(/\s+/).filter(word => word.length > 2)
  
  // Mining-specific keywords with weights
  const miningKeywords: Record<string, number> = {
    // Experience levels
    'underground': 15, 'surface': 12, 'openpit': 12, 'processing': 10,
    'safety': 20, 'mining': 10, 'operations': 8, 'equipment': 12,
    // Skills and certifications
    'certification': 15, 'licensed': 12, 'qualified': 10,
    'supervisor': 12, 'manager': 10, 'operator': 10, 'technician': 8,
    // Technical skills
    'maintenance': 10, 'repair': 8, 'troubleshooting': 10,
    'mechanical': 8, 'electrical': 8, 'hydraulic': 8,
    // Experience indicators
    'years': 12, 'experience': 10, 'knowledge': 8, 'expertise': 10
  }
  
  let score = 0
  let matchedSkills: string[] = []
  let reasons: string[] = []
  
  // Calculate keyword matches with weights
  userWords.forEach(userWord => {
    if (jobWords.includes(userWord)) {
      const weight = miningKeywords[userWord] || 5
      score += weight
      matchedSkills.push(userWord)
    }
  })
  
  // Normalize score to 0-100
  score = Math.min(100, Math.max(0, score))
  
  // Generate reasons based on matches
  if (matchedSkills.includes('safety')) {
    reasons.push('Safety experience is highly valued in mining operations')
  }
  if (matchedSkills.includes('underground') || matchedSkills.includes('surface')) {
    reasons.push('Relevant mining environment experience detected')
  }
  if (matchedSkills.includes('equipment') || matchedSkills.includes('operator')) {
    reasons.push('Equipment operation skills align with job requirements')
  }
  if (matchedSkills.includes('certification') || matchedSkills.includes('licensed')) {
    reasons.push('Professional certifications meet industry standards')
  }
  if (matchedSkills.includes('years') || matchedSkills.includes('experience')) {
    reasons.push('Experience level appears suitable for this role')
  }
  
  if (reasons.length === 0) {
    reasons.push('Basic skill alignment detected through keyword analysis')
  }
  
  // Add fallback notice
  reasons.push('⚠️ Using simplified matching - full AI analysis temporarily unavailable')
  
  return {
    score,
    reasons,
    recommendations: [
      'Highlight your mining-specific experience prominently',
      'Emphasize safety certifications and training',
      'Mention any equipment operation experience'
    ],
    missingSkills: score < 50 ? ['Consider additional mining certifications', 'Gain more hands-on experience'] : []
  }
}

export async function matchUserToJob(
  userSkills: string | string[],
  jobDescription: string,
  jobRequirements: string[] = []
): Promise<JobMatchResult> {
  try {
    const skillsText = Array.isArray(userSkills) ? userSkills.join(', ') : userSkills

    const prompt = `
You are an AI job matching expert specializing in mining industry roles. 

USER SKILLS/EXPERIENCE:
${skillsText}

JOB DESCRIPTION:
${jobDescription}

JOB REQUIREMENTS:
${jobRequirements.join('\n- ')}

Please analyze the match between the user's skills and this mining job. Provide:

1. MATCH SCORE (0-100): How well do the user's skills match this job?
2. REASONS: Why is this a good/bad match? (3-5 bullet points)
3. RECOMMENDATIONS: What should the user highlight in their application? (2-3 points)
4. MISSING SKILLS: What key skills/experience is the user missing? (if any)

Format your response as JSON:
{
  "score": 85,
  "reasons": ["Strong mining experience aligns with role", "Safety certifications match requirements"],
  "recommendations": ["Highlight underground mining experience", "Emphasize safety record"],
  "missingSkills": ["Specific software experience with XYZ"]
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    const result = JSON.parse(content)
    return {
      score: Math.max(0, Math.min(100, result.score || 0)),
      reasons: result.reasons || [],
      recommendations: result.recommendations || [],
      missingSkills: result.missingSkills || []
    }
  } catch (error: any) {
    console.error('Job matching failed, using fallback:', error)
    
    // Check if it's a quota error
    if (error?.status === 429 || (error?.error && error.error.code === 'insufficient_quota')) {
      console.log('OpenAI quota exceeded, using keyword matching fallback')
      const skillsText = Array.isArray(userSkills) ? userSkills.join(', ') : userSkills
      return performKeywordMatching(skillsText, jobDescription, jobRequirements)
    }
    
    // For other errors, return generic error response
    return {
      score: 0,
      reasons: ['Unable to analyze match due to technical error'],
      recommendations: ['Please review the job description manually'],
      missingSkills: []
    }
  }
}

export async function generateJobSummary(jobDescription: string): Promise<string> {
  try {
    const prompt = `
Summarize this mining job posting in 2-3 concise sentences that highlight:
1. Key responsibilities
2. Required experience/skills
3. Location and company benefits (if mentioned)

Job Description:
${jobDescription}

Keep it professional and mining-industry focused.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200
    })

    return response.choices[0]?.message?.content || 'Unable to generate summary'
  } catch (error) {
    console.error('Job summary generation failed:', error)
    return 'Summary not available'
  }
}

export async function extractJobSkills(jobDescription: string): Promise<string[]> {
  try {
    const prompt = `
Extract the key skills, qualifications, and requirements from this mining job posting.
Return only the most important 5-10 skills as a JSON array.

Job Description:
${jobDescription}

Focus on:
- Technical skills
- Certifications
- Experience requirements
- Software/equipment knowledge

Format: ["skill1", "skill2", "skill3"]
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return []

    const skills = JSON.parse(content)
    return Array.isArray(skills) ? skills : []
  } catch (error) {
    console.error('Skill extraction failed:', error)
    return []
  }
}
