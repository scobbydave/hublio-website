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
    // Return empty vacancies to avoid SSR fetch issues for now
    // Client-side will handle loading dynamic content
    return {
      initialVacancies: [],
    }
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    return {
      initialVacancies: [],
      error: 'Failed to load job listings',
    }
  }
}

// Remove dynamic rendering to prevent SSR issues
export const dynamic = 'auto'
export const revalidate = false

export default async function VacanciesPage() {
  const { initialVacancies, error } = await getVacanciesData()

  return <VacanciesPageClient initialVacancies={initialVacancies} error={error} />
}
