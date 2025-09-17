import { VacanciesPageClient } from "./vacancies-client"

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

// Server component to fetch fresh data with cache revalidation
async function getVacanciesData(): Promise<{ initialVacancies: Vacancy[], error?: string }> {
  try {
    // Fetch fresh vacancies with AI summaries - force revalidation every 5 minutes
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/vacancies/fresh`, {
      next: { 
        revalidate: 300, // Revalidate every 5 minutes
        tags: ['vacancy-data', 'fresh-vacancies']
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const vacancies = await response.json()

    return {
      initialVacancies: Array.isArray(vacancies) ? vacancies : [],
    }
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    return {
      initialVacancies: [],
      error: 'Failed to load job listings',
    }
  }
}

// Force dynamic rendering and revalidation  
export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes

export default async function VacanciesPage() {
  const { initialVacancies, error } = await getVacanciesData()

  return <VacanciesPageClient initialVacancies={initialVacancies} error={error} />
}
