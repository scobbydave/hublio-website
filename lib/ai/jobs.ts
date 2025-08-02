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
  } catch (error) {
    console.error('Job matching failed:', error)
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
