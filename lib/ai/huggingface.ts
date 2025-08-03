import { JobMatchResult } from './jobs'

interface HuggingFaceResponse {
  response: string
}

interface HuggingFaceChatRequest {
  prompt: string
}

// Configuration for the Hugging Face Mistral-7B model
const HUGGINGFACE_API_URL = process.env.HUGGINGFACE_API_URL || 'http://localhost:8000'
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY // Optional, for hosted endpoints

export class HuggingFaceService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || HUGGINGFACE_API_URL
    this.apiKey = apiKey || HUGGINGFACE_API_KEY
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      console.log('Hugging Face service not available:', error)
      return false
    }
  }

  async chat(prompt: string): Promise<string> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt } as HuggingFaceChatRequest),
      })

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`)
      }

      const data: HuggingFaceResponse = await response.json()
      return data.response
    } catch (error) {
      console.error('Hugging Face chat error:', error)
      throw error
    }
  }

  async matchUserToJob(
    userSkills: string,
    jobDescription: string,
    jobRequirements: string[]
  ): Promise<JobMatchResult> {
    try {
      const prompt = `You are an AI job matching expert specializing in mining industry roles.

USER SKILLS/EXPERIENCE:
${userSkills}

JOB DESCRIPTION:
${jobDescription}

JOB REQUIREMENTS:
${jobRequirements.join('\n- ')}

Analyze the match between the user's skills and this mining job. Provide a JSON response with:
1. MATCH SCORE (0-100): How well do the user's skills match this job?
2. REASONS: Why is this a good/bad match? (3-5 bullet points)
3. RECOMMENDATIONS: What should the user highlight in their application? (2-3 points)
4. MISSING SKILLS: What key skills/experience is the user missing? (if any)

Respond ONLY with valid JSON in this format:
{
  "score": 85,
  "reasons": ["Strong mining experience aligns with role", "Safety certifications match requirements"],
  "recommendations": ["Highlight underground mining experience", "Emphasize safety record"],
  "missingSkills": ["Specific software experience with XYZ"]
}`

      const response = await this.chat(prompt)
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const result = JSON.parse(jsonMatch[0])
      
      return {
        score: Math.max(0, Math.min(100, result.score || 0)),
        reasons: Array.isArray(result.reasons) ? result.reasons : ['Analysis completed using local AI model'],
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : ['Review job requirements carefully'],
        missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : []
      }
    } catch (error) {
      console.error('Hugging Face job matching failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const huggingFaceService = new HuggingFaceService()
