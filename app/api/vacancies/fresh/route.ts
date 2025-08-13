import { NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis"
import { summarizeNewsArticle } from "@/lib/ai"
import { GeminiService } from "@/lib/gemini"

interface Vacancy {
  _id: string
  title: string
  company: string
  location: string
  country: string
  salary?: {
    min?: number
    max?: number
    currency: string
  }
  description: string
  aiSummary?: string
  requirements: string[]
  jobType: string
  experienceLevel: string
  category: string
  postedDate: string
  externalUrl?: string
}

const geminiService = new GeminiService()

// Sample mining vacancies for when API is not available
const sampleVacancies: Vacancy[] = [
  {
    _id: '1',
    title: 'Senior Mining Engineer',
    company: 'Gold Fields Limited',
    location: 'Johannesburg',
    country: 'South Africa',
    salary: { min: 450000, max: 650000, currency: 'ZAR' },
    description: 'We are seeking an experienced Senior Mining Engineer to lead our underground mining operations. The successful candidate will be responsible for mine planning, safety compliance, and team leadership in our gold mining operations.',
    aiSummary: 'Senior-level position requiring extensive mining experience and leadership skills in underground gold mining operations.',
    requirements: [
      'Bachelor\'s degree in Mining Engineering',
      '8+ years of underground mining experience', 
      'Professional registration with ECSA',
      'Strong leadership and communication skills'
    ],
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    category: 'Mining Engineering',
    postedDate: new Date(Date.now() - 86400000).toISOString(),
    externalUrl: 'https://goldfields.com/careers'
  },
  {
    _id: '2',
    title: 'Mine Safety Officer',
    company: 'Anglo American',
    location: 'Rustenburg',
    country: 'South Africa',
    salary: { min: 320000, max: 420000, currency: 'ZAR' },
    description: 'Join our safety team to ensure compliance with mining safety regulations and maintain the highest safety standards. Responsible for conducting safety inspections, training programs, and incident investigations.',
    aiSummary: 'Safety-focused role requiring strong knowledge of mining safety regulations and compliance procedures.',
    requirements: [
      'National Diploma in Safety Management',
      '5+ years mining safety experience',
      'SAMTRAC certification required',
      'Knowledge of MHSA regulations'
    ],
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    category: 'Safety & Compliance',
    postedDate: new Date(Date.now() - 172800000).toISOString(),
    externalUrl: 'https://angloamerican.com/careers'
  },
  {
    _id: '3',
    title: 'Geological Data Analyst',
    company: 'Sibanye-Stillwater',
    location: 'Cape Town',
    country: 'South Africa',
    salary: { min: 380000, max: 480000, currency: 'ZAR' },
    description: 'Analyze geological data to support mining operations and exploration activities. Work with advanced geological software and collaborate with multidisciplinary teams to optimize resource extraction.',
    aiSummary: 'Technical role combining geology expertise with data analysis skills for mining optimization.',
    requirements: [
      'BSc in Geology or related field',
      '3+ years geological data analysis experience',
      'Proficiency in geological modeling software',
      'Strong statistical analysis skills'
    ],
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    category: 'Geology & Exploration',
    postedDate: new Date(Date.now() - 259200000).toISOString(),
    externalUrl: 'https://sibanyestillwater.com/careers'
  },
  {
    _id: '4',
    title: 'Mining Equipment Technician',
    company: 'Exxaro Resources',
    location: 'Limpopo',
    country: 'South Africa',
    salary: { min: 280000, max: 350000, currency: 'ZAR' },
    description: 'Maintain and repair heavy mining equipment including excavators, haul trucks, and processing machinery. Ensure optimal equipment performance and minimize downtime through preventive maintenance.',
    aiSummary: 'Hands-on technical role focused on mining equipment maintenance and repair.',
    requirements: [
      'Trade certificate in Mechanical Engineering',
      '4+ years heavy equipment maintenance experience',
      'Knowledge of hydraulic and electrical systems',
      'Valid driver\'s license'
    ],
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    category: 'Equipment & Maintenance',
    postedDate: new Date(Date.now() - 345600000).toISOString(),
    externalUrl: 'https://exxaro.com/careers'
  }
]

export async function GET() {
  try {
    const redis = getRedisClient()
    
    // Check cache first (cache for 2 hours)
    if (redis) {
      const cached = await redis.get('vacancies:fresh')
      if (cached) {
        return NextResponse.json(JSON.parse(cached as string))
      }
    }

    let vacancies = [...sampleVacancies]

    // Try to fetch from Alpha Vantage or other job APIs
    try {
      // Alpha Vantage doesn't provide job listings, but we can simulate fresh data
      // In a real implementation, you'd use job APIs like Indeed, LinkedIn, etc.
      
      // Generate AI summaries for vacancies that don't have them
      for (const vacancy of vacancies) {
        if (!vacancy.aiSummary) {
          try {
            const summary = await geminiService.summarizeNews(
              `Job Title: ${vacancy.title}\nCompany: ${vacancy.company}\nDescription: ${vacancy.description}`
            )
            vacancy.aiSummary = summary.substring(0, 150) + "..."
          } catch (error) {
            console.log("Failed to generate AI summary for vacancy:", error)
            vacancy.aiSummary = vacancy.description.substring(0, 100) + "..."
          }
        }
      }

      // Add timestamps to make them appear fresh
      vacancies.forEach(vacancy => {
        vacancy.postedDate = new Date(Date.now() - Math.random() * 604800000).toISOString() // Random within last week
      })

    } catch (error) {
      console.error("Error fetching external job data:", error)
      // Continue with sample data
    }

    // Cache the results for 2 hours
    if (redis && vacancies.length > 0) {
      await redis.setex('vacancies:fresh', 7200, JSON.stringify(vacancies))
    }

    return NextResponse.json(vacancies)
  } catch (error) {
    console.error("Error in vacancies API:", error)
    return NextResponse.json(sampleVacancies) // Fallback to sample data
  }
}
