import { NextRequest, NextResponse } from 'next/server'

interface VacancyStats {
  totalJobs: number
  activeJobs: number
  recentJobs: number
  topCategories: Array<{
    category: string
    count: number
  }>
  locationBreakdown: Array<{
    location: string
    count: number
  }>
  salaryRanges: Array<{
    range: string
    count: number
  }>
  experienceLevels: Array<{
    level: string
    count: number
  }>
  lastUpdated: string
}

const generateVacancyStats = (): VacancyStats => {
  // Generate realistic mining job statistics for South Africa
  return {
    totalJobs: 156 + Math.floor(Math.random() * 50), // Add daily variance
    activeJobs: 89 + Math.floor(Math.random() * 30),
    recentJobs: 12 + Math.floor(Math.random() * 10), // Jobs posted in last 7 days
    topCategories: [
      { category: "Mining Engineering", count: 23 + Math.floor(Math.random() * 5) },
      { category: "Safety & Compliance", count: 18 + Math.floor(Math.random() * 4) },
      { category: "Equipment & Maintenance", count: 15 + Math.floor(Math.random() * 3) },
      { category: "Geology & Exploration", count: 12 + Math.floor(Math.random() * 3) },
      { category: "Environmental & Sustainability", count: 8 + Math.floor(Math.random() * 2) },
      { category: "Project Management", count: 7 + Math.floor(Math.random() * 2) },
      { category: "Operations", count: 6 + Math.floor(Math.random() * 2) }
    ],
    locationBreakdown: [
      { location: "Johannesburg, Gauteng", count: 34 },
      { location: "Cape Town, Western Cape", count: 18 },
      { location: "Rustenburg, North West", count: 16 },
      { location: "Welkom, Free State", count: 12 },
      { location: "Klerksdorp, North West", count: 11 },
      { location: "Kimberley, Northern Cape", count: 9 },
      { location: "Polokwane, Limpopo", count: 8 },
      { location: "Other locations", count: 48 }
    ],
    salaryRanges: [
      { range: "R300,000 - R500,000", count: 45 },
      { range: "R500,000 - R750,000", count: 38 },
      { range: "R750,000 - R1,000,000", count: 28 },
      { range: "R200,000 - R300,000", count: 22 },
      { range: "R1,000,000+", count: 15 },
      { range: "Not specified", count: 8 }
    ],
    experienceLevels: [
      { level: "Mid-level (3-7 years)", count: 52 },
      { level: "Senior (7+ years)", count: 38 },
      { level: "Entry level (0-3 years)", count: 32 },
      { level: "Executive/Management", count: 24 },
      { level: "Graduate/Trainee", count: 10 }
    ],
    lastUpdated: new Date().toISOString()
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = generateVacancyStats()
    
    return NextResponse.json({
      success: true,
      ...stats
    })
  } catch (error) {
    console.error('Vacancy stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vacancy statistics' },
      { status: 500 }
    )
  }
}
