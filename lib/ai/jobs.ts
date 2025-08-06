import OpenAI from 'openai'
import { huggingFaceService } from './huggingface'

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
  
  // Enhanced mining-specific keywords with weights
  const miningKeywords: Record<string, number> = {
    // Experience levels and mining types
    'underground': 18, 'surface': 15, 'openpit': 15, 'open-pit': 15, 'processing': 12,
    'safety': 25, 'mining': 12, 'operations': 10, 'equipment': 15,
    
    // Skills and certifications
    'certification': 18, 'certified': 16, 'licensed': 15, 'qualified': 12,
    'samtrac': 20, 'dmr': 18, 'mhsa': 20, 'ecsa': 18, 'sacnasp': 15,
    
    // Job roles and responsibilities
    'engineer': 15, 'technician': 12, 'supervisor': 15, 'manager': 12, 
    'operator': 12, 'specialist': 10, 'coordinator': 8, 'analyst': 10,
    
    // Technical skills
    'maintenance': 12, 'repair': 10, 'troubleshooting': 12, 'installation': 10,
    'mechanical': 10, 'electrical': 10, 'hydraulic': 12, 'pneumatic': 10,
    
    // Software and technology
    'surpac': 15, 'datamine': 15, 'micromine': 12, 'leapfrog': 15, 'whittle': 12,
    'autocad': 8, 'excel': 5, 'sap': 8, 'oracle': 8,
    
    // Equipment and machinery
    'caterpillar': 12, 'cat': 12, 'komatsu': 12, 'liebherr': 10, 'sandvik': 10,
    'excavator': 12, 'dozer': 10, 'truck': 8, 'drill': 12, 'crusher': 10,
    
    // Geology and exploration
    'geology': 15, 'geological': 12, 'geologist': 15, 'exploration': 12,
    'drilling': 12, 'assay': 10, 'sampling': 10, 'geostatistics': 15,
    
    // Safety and compliance
    'compliance': 15, 'audit': 10, 'inspection': 12, 'incident': 12,
    'emergency': 12, 'rescue': 15, 'first-aid': 12, 'hazard': 12,
    
    // Environmental
    'environmental': 15, 'sustainability': 12, 'rehabilitation': 12,
    'water': 8, 'air': 6, 'waste': 8, 'pollution': 10,
    
    // Experience indicators
    'years': 15, 'experience': 12, 'knowledge': 10, 'expertise': 12,
    'background': 8, 'skilled': 10, 'proficient': 12
  }
  
  let score = 0
  let matchedSkills: string[] = []
  let reasons: string[] = []
  let missingSkills: string[] = []
  
  // Calculate keyword matches with weights
  userWords.forEach(userWord => {
    if (jobWords.includes(userWord)) {
      const weight = miningKeywords[userWord] || 3
      score += weight
      matchedSkills.push(userWord)
    }
  })
  
  // Bonus for multiple related skills
  const skillCategories = {
    safety: ['safety', 'samtrac', 'mhsa', 'dmr', 'hazard', 'emergency', 'rescue', 'first-aid'],
    technical: ['mechanical', 'electrical', 'hydraulic', 'maintenance', 'repair', 'troubleshooting'],
    software: ['surpac', 'datamine', 'micromine', 'leapfrog', 'autocad', 'excel'],
    equipment: ['cat', 'caterpillar', 'komatsu', 'liebherr', 'excavator', 'drill', 'truck'],
    geology: ['geology', 'geological', 'exploration', 'drilling', 'assay', 'geostatistics']
  }
  
  Object.entries(skillCategories).forEach(([category, skills]) => {
    const matchedInCategory = skills.filter(skill => matchedSkills.includes(skill))
    if (matchedInCategory.length >= 2) {
      score += 10 // Bonus for multiple skills in same category
      reasons.push(`Strong ${category} skill set detected (${matchedInCategory.length} related skills)`)
    }
  })
  
  // Check for missing critical skills
  const criticalSkills = ['safety', 'certified', 'licensed', 'experience']
  const missingCritical = criticalSkills.filter(skill => 
    jobWords.includes(skill) && !userWords.includes(skill)
  )
  
  missingSkills = missingCritical.map(skill => {
    switch(skill) {
      case 'safety': return 'Mining safety certification or training'
      case 'certified': return 'Professional certification in relevant field'
      case 'licensed': return 'Professional license or registration'
      case 'experience': return 'More years of relevant mining experience'
      default: return `${skill} qualification`
    }
  })
  
  // Normalize score to 0-100
  const maxPossibleScore = jobWords.length * 5 // Rough estimate
  score = Math.min(100, Math.max(0, (score / maxPossibleScore) * 100))
  
  // Generate detailed reasons based on matches
  if (matchedSkills.includes('safety') || matchedSkills.includes('samtrac')) {
    reasons.push('✅ Safety experience is highly valued in mining operations')
  }
  if (matchedSkills.includes('underground') || matchedSkills.includes('surface')) {
    reasons.push('✅ Relevant mining environment experience detected')
  }
  if (matchedSkills.includes('equipment') || matchedSkills.includes('operator')) {
    reasons.push('✅ Equipment operation skills align with job requirements')
  }
  if (matchedSkills.includes('certification') || matchedSkills.includes('licensed')) {
    reasons.push('✅ Professional certifications meet industry standards')
  }
  if (matchedSkills.includes('years') || matchedSkills.includes('experience')) {
    reasons.push('✅ Experience level appears suitable for this role')
  }
  if (matchedSkills.some(skill => ['engineer', 'technician', 'supervisor', 'manager'].includes(skill))) {
    reasons.push('✅ Professional role alignment with career level')
  }
  
  // Add specific mining industry insights
  if (score >= 70) {
    reasons.push('🎯 Strong overall match with mining industry requirements')
  } else if (score >= 50) {
    reasons.push('⚠️ Moderate match - consider highlighting transferable skills')
  } else {
    reasons.push('❌ Limited direct match - may need additional qualifications')
  }
  
  if (reasons.length === 0) {
    reasons.push('ℹ️ Basic skill alignment detected through keyword analysis')
  }
  
  // Add fallback notice
  reasons.push('🤖 Analysis using enhanced mining-specific keyword matching')
  
  return {
    score,
    reasons,
    recommendations: score >= 70 ? [
      'Emphasize your mining-specific experience in your application',
      'Highlight relevant safety certifications prominently',
      'Mention specific equipment or software experience'
    ] : score >= 50 ? [
      'Focus on transferable skills from your background',
      'Consider obtaining relevant mining certifications',
      'Highlight any safety training or experience'
    ] : [
      'Consider additional mining industry training',
      'Gain relevant experience through internships or entry-level positions',
      'Obtain essential safety certifications (SAMTRAC, First Aid)'
    ],
    missingSkills
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
    console.error('Job matching failed, trying fallbacks:', error)
    
    // Check if it's a quota error
    if (error?.status === 429 || (error?.error && error.error.code === 'insufficient_quota')) {
      console.log('OpenAI quota exceeded, trying Hugging Face fallback...')
      
      // Try Hugging Face Mistral-7B first
      try {
        const isHfAvailable = await huggingFaceService.isAvailable()
        if (isHfAvailable) {
          console.log('Using Hugging Face Mistral-7B for job matching')
          const skillsText = Array.isArray(userSkills) ? userSkills.join(', ') : userSkills
          const hfResult = await huggingFaceService.matchUserToJob(skillsText, jobDescription, jobRequirements)
          
          // Add indicator that this is from Hugging Face
          hfResult.reasons.push('🤖 Analysis powered by Mistral-7B local AI model')
          return hfResult
        }
      } catch (hfError) {
        console.error('Hugging Face fallback failed:', hfError)
      }
      
      // Fall back to keyword matching if Hugging Face is also unavailable
      console.log('Using keyword matching as final fallback')
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
