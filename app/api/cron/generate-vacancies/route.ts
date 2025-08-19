import { NextRequest, NextResponse } from 'next/server'
import { validateSanityConnection, sanityClient as sanity } from '@/lib/sanity'
import { generateJobSummary, extractJobSkills } from '@/lib/ai/jobs'

// Note: use the shared sanity client from `lib/sanity` and guard usage with `validateSanityConnection()`
// This avoids creating a client at module import time when env vars are not present.

interface JobSearchResult {
  results: {
    id: string
    title: string
    company: { display_name: string }
    location: { display_name: string }
    description: string
    salary_min?: number
    salary_max?: number
    contract_type?: string
    category: { label: string }
    redirect_url: string
    created: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting vacancy generation job...')

    // Check if we have Adzuna API credentials
    if (!process.env.ADZUNA_API_KEY || !process.env.ADZUNA_APP_ID) {
      console.log('Adzuna API credentials not found, skipping job fetch')
      return NextResponse.json({ 
        success: true, 
        message: 'Adzuna API not configured, using mock data',
        jobsProcessed: 0 
      })
    }

    // Fetch mining jobs from multiple countries
    const countries = ['za', 'bw', 'na', 'zw'] // South Africa, Botswana, Namibia, Zimbabwe
    const allJobs: any[] = []

    for (const country of countries) {
      try {
        const searchQueries = [
          'mining',
          'mine',
          'mining engineer',
          'mining safety',
          'mining operations',
          'underground mining',
          'surface mining'
        ]

        for (const query of searchQueries.slice(0, 3)) { // Limit queries to avoid rate limits
          const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&what=${encodeURIComponent(query)}&results_per_page=20&sort_by=date`
          
          const response = await fetch(url)
          if (response.ok) {
            const data: JobSearchResult = await response.json()
            allJobs.push(...data.results.map(job => ({ ...job, country })))
          }
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Failed to fetch jobs for ${country}:`, error)
      }
    }

    console.log(`Fetched ${allJobs.length} potential mining jobs`)

    // Process and save jobs to Sanity
    let jobsProcessed = 0
    const batchSize = 5

    for (let i = 0; i < allJobs.length && i < 50; i += batchSize) { // Process max 50 jobs
      const batch = allJobs.slice(i, i + batchSize)
      
      await Promise.all(batch.map(async (job) => {
        try {
          // Check if job already exists
          // Check if Sanity is configured before attempting reads/writes
          const hasSanity = validateSanityConnection() && !!sanity

          if (hasSanity) {
            const client = sanity as any
            const existingJob = await client.fetch(
              `*[_type == "vacancy" && externalId == $externalId][0]`,
              { externalId: job.id }
            )

            if (existingJob) {
              console.log(`Job ${job.id} already exists, skipping`)
              return
            }
          } else {
            console.log('Sanity not configured - skipping Sanity checks and writes for fetched jobs')
            // If Sanity not configured, skip saving but continue processing other jobs
            return
          }

          // Generate AI summary and extract skills
          const [aiSummary, skills] = await Promise.all([
            generateJobSummary(job.description),
            extractJobSkills(job.description)
          ])

          // Map country code to country name
          const countryNames: { [key: string]: string } = {
            'za': 'South Africa',
            'bw': 'Botswana',
            'na': 'Namibia',
            'zw': 'Zimbabwe'
          }

          // Categorize job
          const title = job.title.toLowerCase()
          let category = 'operations'
          if (title.includes('underground')) category = 'underground'
          else if (title.includes('surface') || title.includes('open pit')) category = 'surface'
          else if (title.includes('process') || title.includes('plant')) category = 'processing'
          else if (title.includes('safety')) category = 'safety'
          else if (title.includes('engineer')) category = 'engineering'
          else if (title.includes('manager') || title.includes('supervisor')) category = 'management'

          // Determine experience level
          let experienceLevel = 'mid'
          if (title.includes('junior') || title.includes('trainee') || title.includes('graduate')) {
            experienceLevel = 'entry'
          } else if (title.includes('senior') || title.includes('lead') || title.includes('principal')) {
            experienceLevel = 'senior'
          } else if (title.includes('manager') || title.includes('director') || title.includes('head')) {
            experienceLevel = 'executive'
          }

          // Create vacancy document
          const vacancyDoc = {
            _type: 'vacancy',
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            country: countryNames[job.country] || 'Unknown',
            description: job.description,
            aiSummary,
            requirements: skills,
            salary: job.salary_min || job.salary_max ? {
              min: job.salary_min,
              max: job.salary_max,
              currency: 'USD' // Adzuna typically returns USD
            } : undefined,
            jobType: job.contract_type === 'permanent' ? 'full-time' : 
                     job.contract_type === 'contract' ? 'contract' : 'full-time',
            experienceLevel,
            category,
            externalId: job.id,
            externalUrl: job.redirect_url,
            isActive: true,
            postedDate: job.created,
            createdAt: new Date().toISOString()
          }

          // Save to Sanity (only when configured)
          if (validateSanityConnection() && !!sanity) {
            const client = sanity as any
            await client.create(vacancyDoc)
            jobsProcessed++
            console.log(`Processed job: ${job.title} at ${job.company.display_name}`)
          } else {
            console.log(`Sanity not configured - would have created job: ${job.title} at ${job.company.display_name}`)
          }
          
        } catch (error) {
          console.error(`Failed to process job ${job.id}:`, error)
        }
      }))

      // Add delay between batches
      if (i + batchSize < allJobs.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Clean up old/expired jobs
    // Clean up old/expired jobs only when Sanity is configured
    try {
      if (validateSanityConnection() && !!sanity) {
        const client = sanity as any
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        await client.delete({
          query: `*[_type == "vacancy" && _createdAt < $date]`,
          params: { date: oneWeekAgo.toISOString() }
        })
        console.log('Cleaned up old job listings')
      } else {
        console.log('Sanity not configured - skipping cleanup of old jobs')
      }
    } catch (error) {
      console.error('Failed to clean up old jobs:', error)
    }

    console.log(`Vacancy generation completed. Processed ${jobsProcessed} new jobs.`)

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${jobsProcessed} mining vacancies`,
      jobsProcessed,
      totalFetched: allJobs.length
    })

  } catch (error) {
    console.error('Vacancy generation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Vacancy generation failed',
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}

// Allow manual triggering via GET for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Forward to POST handler
  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${process.env.CRON_SECRET}`,
      'content-type': 'application/json'
    }
  }))
}
