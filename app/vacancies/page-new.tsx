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

// Server component to fetch data
async function getVacanciesData(): Promise<{ initialVacancies: Vacancy[], error?: string }> {
  try {
    // Fetch fresh vacancies with AI summaries
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/vacancies/fresh`, {
      cache: 'no-store' // Ensure fresh data
    })
    const vacancies = response.ok ? await response.json() : []

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

export default async function VacanciesPage() {
  const { initialVacancies, error } = await getVacanciesData()

  return <VacanciesPageClient initialVacancies={initialVacancies} error={error} />
}
