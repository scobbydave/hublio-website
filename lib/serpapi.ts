// Types for news data
export interface NewsResult {
  title: string
  link: string
  snippet: string
  date: string
  source: string
  thumbnail?: string
}

export interface MiningNewsResponse {
  news_results: NewsResult[]
  search_metadata: {
    created_at: string
    processed_at: string
    google_news_url: string
    total_time_taken: number
  }
}

// SerpAPI configuration
const SERPAPI_KEY = process.env.NEXT_PUBLIC_SERPAPI_KEY || process.env.SERPAPI_KEY

export class SerpAPIService {
  private apiKey: string | null

  constructor() {
    // Do not throw at import time. In local/dev builds we may not have SerpAPI keys.
    // When keys are missing, methods will return empty arrays so builds and previews work.
    this.apiKey = SERPAPI_KEY || null
    if (!this.apiKey) {
      // Keep a console hint for local debugging; production (Vercel) will have the key.
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('SerpAPI key not found. SerpAPIService will return empty results until NEXT_PUBLIC_SERPAPI_KEY or SERPAPI_KEY is set.')
      }
    }
  }

  /**
   * Search for mining industry news
   */
  async getMiningNews(query: string = 'mining industry news', timeRange: string = 'h'): Promise<NewsResult[]> {
    try {
  if (!this.apiKey) return []
      const searchParams = new URLSearchParams({
        engine: "google_news",
        q: query,
        api_key: this.apiKey,
        tbm: "nws", // News search
        tbs: `qdr:${timeRange}`, // Time range: h=hour, d=day, w=week, m=month
        num: "20", // Number of results
        hl: "en", // Language
        gl: "za" // Country (South Africa)
      })

      const response = await fetch(`https://serpapi.com/search?${searchParams}`)
      
      if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as MiningNewsResponse
      return data.news_results || []
    } catch (error) {
      console.error('Error fetching news from SerpAPI:', error)
      return []
    }
  }

  /**
   * Search for specific mining company news
   */
  async getCompanyNews(companies: string[]): Promise<Record<string, NewsResult[]>> {
    const results: Record<string, NewsResult[]> = {}
    if (!this.apiKey) {
      // Return empty results when key is absent
      for (const company of companies) {
        results[company] = []
      }
      return results
    }

    for (const company of companies) {
      try {
        const query = `"${company}" mining production earnings stock`
        const news = await this.getMiningNews(query, 'd') // Last day
        results[company] = news.slice(0, 5) // Top 5 articles per company
        
        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error fetching news for ${company}:`, error)
        results[company] = []
      }
    }

    return results
  }

  /**
   * Search for commodity-specific news
   */
  async getCommodityNews(commodities: string[]): Promise<Record<string, NewsResult[]>> {
    const results: Record<string, NewsResult[]> = {}
    if (!this.apiKey) {
      for (const commodity of commodities) {
        results[commodity] = []
      }
      return results
    }

    for (const commodity of commodities) {
      try {
        const query = `${commodity} price market mining production`
        const news = await this.getMiningNews(query, 'd')
        results[commodity] = news.slice(0, 3) // Top 3 articles per commodity
        
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error fetching news for ${commodity}:`, error)
        results[commodity] = []
      }
    }

    return results
  }

  /**
   * Search for mining safety news
   */
  async getSafetyNews(): Promise<NewsResult[]> {
    try {
      const query = 'mining safety accident incident fatality South Africa'
      return await this.getMiningNews(query, 'w') // Last week
    } catch (error) {
      console.error('Error fetching safety news:', error)
      return []
    }
  }

  /**
   * Search for mining regulation and policy news
   */
  async getRegulationNews(): Promise<NewsResult[]> {
    try {
      const query = 'mining regulation policy DMRE South Africa legislation'
      return await this.getMiningNews(query, 'w')
    } catch (error) {
      console.error('Error fetching regulation news:', error)
      return []
    }
  }
}

// Export singleton instance
export const serpAPIService = new SerpAPIService()

// Helper function to categorize news
export function categorizeNews(newsItem: NewsResult): 'safety' | 'production' | 'regulation' | 'market' | 'exploration' {
  const title = newsItem.title.toLowerCase()
  const snippet = newsItem.snippet.toLowerCase()
  const content = `${title} ${snippet}`

  if (content.includes('safety') || content.includes('accident') || content.includes('fatality') || content.includes('incident')) {
    return 'safety'
  }
  if (content.includes('production') || content.includes('output') || content.includes('mining') || content.includes('extraction')) {
    return 'production'
  }
  if (content.includes('regulation') || content.includes('policy') || content.includes('legislation') || content.includes('dmre')) {
    return 'regulation'
  }
  if (content.includes('exploration') || content.includes('discovery') || content.includes('deposit') || content.includes('resource')) {
    return 'exploration'
  }
  return 'market'
}

// Helper function to determine news impact
export function determineImpact(newsItem: NewsResult): 'high' | 'medium' | 'low' {
  const title = newsItem.title.toLowerCase()
  const snippet = newsItem.snippet.toLowerCase()
  const content = `${title} ${snippet}`

  // High impact keywords
  const highImpactKeywords = ['fatality', 'accident', 'record', 'surge', 'plunge', 'emergency', 'shutdown', 'strike', 'acquisition', 'merger']
  if (highImpactKeywords.some(keyword => content.includes(keyword))) {
    return 'high'
  }

  // Medium impact keywords
  const mediumImpactKeywords = ['increase', 'decrease', 'production', 'earnings', 'regulation', 'policy', 'discovery']
  if (mediumImpactKeywords.some(keyword => content.includes(keyword))) {
    return 'medium'
  }

  return 'low'
}
