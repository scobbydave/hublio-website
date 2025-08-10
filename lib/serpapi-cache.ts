// Smart caching system for SerpAPI to maximize 250 free searches
import { NewsResult, MiningNewsResponse } from './serpapi'

interface CachedNewsData {
  data: NewsResult[]
  timestamp: number
  category: string
  expiresAt: number
}

interface APIUsageStats {
  searchesUsed: number
  searchesRemaining: number
  lastReset: number
  dailyUsage: number
}

export class SerpAPICacheManager {
  private cache: Map<string, CachedNewsData> = new Map()
  private usageStats: APIUsageStats
  private readonly MAX_MONTHLY_SEARCHES = 250
  private readonly MAX_DAILY_SEARCHES = 8 // Conservative daily limit

  constructor() {
    this.usageStats = this.loadUsageStats()
  }

  /**
   * Check if we should make an API call based on usage limits
   */
  canMakeAPICall(): boolean {
    this.updateDailyUsage()
    
    // Check monthly limit
    if (this.usageStats.searchesUsed >= this.MAX_MONTHLY_SEARCHES) {
      console.warn('Monthly SerpAPI limit reached (250 searches)')
      return false
    }

    // Check daily limit
    if (this.usageStats.dailyUsage >= this.MAX_DAILY_SEARCHES) {
      console.warn('Daily SerpAPI limit reached (8 searches)')
      return false
    }

    return true
  }

  /**
   * Get cached news or fetch from API if needed
   */
  async getNewsCached(
    category: string,
    searchFunction: () => Promise<NewsResult[]>,
    cacheMinutes: number = 180 // 3 hours default cache
  ): Promise<NewsResult[]> {
    const cacheKey = category
    const cached = this.cache.get(cacheKey)
    const now = Date.now()

    // Return cached data if fresh
    if (cached && now < cached.expiresAt) {
      // Silent caching - no visitor-facing logs
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log(`📋 Using cached ${category} news (${Math.round((cached.expiresAt - now) / 60000)} minutes remaining)`)
      }
      return cached.data
    }

    // Check if we can make API call
    if (!this.canMakeAPICall()) {
      // Return stale cache if available, or empty array
      if (cached) {
        // Silent fallback - visitors just see data without knowing it's stale
        return cached.data
      }
      return []
    }

    try {
      // Make API call silently
      const data = await searchFunction()
      
      // Update usage stats
      this.trackAPIUsage()
      
      // Cache the results
      this.cache.set(cacheKey, {
        data,
        timestamp: now,
        category,
        expiresAt: now + (cacheMinutes * 60 * 1000)
      })

      return data
    } catch (error) {
      console.error(`Failed to fetch ${category} news:`, error)
      
      // Return stale cache if available - visitors never know about the error
      if (cached) {
        return cached.data
      }
      
      return []
    }
  }

  /**
   * Smart news refresh strategy based on time and usage
   */
  getRefreshStrategy(): {
    shouldRefreshGeneral: boolean
    shouldRefreshSafety: boolean
    shouldRefreshCompanies: boolean
    shouldRefreshRegulation: boolean
    nextRefreshIn: number
  } {
    const now = new Date()
    const hour = now.getHours()
    const isBusinessHours = hour >= 9 && hour <= 17
    const isMarketOpen = hour >= 9 && hour <= 16
    
    // Conservative refresh during business hours only
    const shouldRefresh = isBusinessHours && this.canMakeAPICall()
    
    // Prioritize by importance and cache age
    const generalCache = this.cache.get('general')
    const safetyCache = this.cache.get('safety')
    const companiesCache = this.cache.get('companies')
    const regulationCache = this.cache.get('regulation')
    
    const isGeneralStale = !generalCache || Date.now() > generalCache.expiresAt
    const isSafetyStale = !safetyCache || Date.now() > safetyCache.expiresAt
    const isCompaniesStale = !companiesCache || Date.now() > companiesCache.expiresAt
    const isRegulationStale = !regulationCache || Date.now() > regulationCache.expiresAt
    
    return {
      shouldRefreshGeneral: shouldRefresh && isGeneralStale,
      shouldRefreshSafety: shouldRefresh && isSafetyStale && hour % 6 === 0, // Every 6 hours
      shouldRefreshCompanies: shouldRefresh && isCompaniesStale && hour % 4 === 0, // Every 4 hours
      shouldRefreshRegulation: shouldRefresh && isRegulationStale && hour % 12 === 0, // Twice daily
      nextRefreshIn: this.getNextRefreshTime()
    }
  }

  /**
   * Get time until next refresh window
   */
  private getNextRefreshTime(): number {
    const now = new Date()
    const hour = now.getHours()
    
    // Next business hour: 9 AM, 1 PM, or 5 PM
    const refreshHours = [9, 13, 17]
    const nextHour = refreshHours.find(h => h > hour) || (24 + refreshHours[0])
    
    const nextRefresh = new Date(now)
    nextRefresh.setHours(nextHour % 24, 0, 0, 0)
    if (nextHour >= 24) {
      nextRefresh.setDate(nextRefresh.getDate() + 1)
    }
    
    return nextRefresh.getTime() - now.getTime()
  }

  /**
   * Track API usage (internal only - no visitor exposure)
   */
  private trackAPIUsage(): void {
    this.usageStats.searchesUsed++
    this.usageStats.dailyUsage++
    this.saveUsageStats()
    
    // Internal logging only - visitors never see this
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`📊 SerpAPI Usage: ${this.usageStats.searchesUsed}/${this.MAX_MONTHLY_SEARCHES} monthly, ${this.usageStats.dailyUsage}/${this.MAX_DAILY_SEARCHES} daily`)
    }
  }

  /**
   * Update daily usage counter
   */
  private updateDailyUsage(): void {
    const now = Date.now()
    const daysSinceLastReset = Math.floor((now - this.usageStats.lastReset) / (24 * 60 * 60 * 1000))
    
    if (daysSinceLastReset >= 1) {
      this.usageStats.dailyUsage = 0
      this.usageStats.lastReset = now
      this.saveUsageStats()
    }
  }

  /**
   * Load usage stats from localStorage
   */
  private loadUsageStats(): APIUsageStats {
    if (typeof window === 'undefined') {
      return {
        searchesUsed: 0,
        searchesRemaining: this.MAX_MONTHLY_SEARCHES,
        lastReset: Date.now(),
        dailyUsage: 0
      }
    }

    const saved = localStorage.getItem('serpapi_usage_stats')
    if (saved) {
      const stats = JSON.parse(saved)
      
      // Reset monthly counter if it's a new month
      const now = new Date()
      const lastReset = new Date(stats.lastReset)
      if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        stats.searchesUsed = 0
        stats.dailyUsage = 0
        stats.lastReset = Date.now()
      }
      
      stats.searchesRemaining = this.MAX_MONTHLY_SEARCHES - stats.searchesUsed
      return stats
    }

    return {
      searchesUsed: 0,
      searchesRemaining: this.MAX_MONTHLY_SEARCHES,
      lastReset: Date.now(),
      dailyUsage: 0
    }
  }

  /**
   * Save usage stats to localStorage
   */
  private saveUsageStats(): void {
    if (typeof window !== 'undefined') {
      this.usageStats.searchesRemaining = this.MAX_MONTHLY_SEARCHES - this.usageStats.searchesUsed
      localStorage.setItem('serpapi_usage_stats', JSON.stringify(this.usageStats))
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): APIUsageStats & { efficiency: number; daysRemaining: number } {
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysRemaining = Math.ceil((endOfMonth.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    
    return {
      ...this.usageStats,
      efficiency: (this.usageStats.searchesUsed / this.MAX_MONTHLY_SEARCHES) * 100,
      daysRemaining
    }
  }

  /**
   * Clear cache (internal development only)
   */
  clearCache(): void {
    this.cache.clear()
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('🗑️ SerpAPI cache cleared')
    }
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { category: string; age: string; size: number; fresh: boolean }[] {
    const now = Date.now()
    return Array.from(this.cache.entries()).map(([category, data]) => ({
      category,
      age: `${Math.round((now - data.timestamp) / 60000)} minutes`,
      size: data.data.length,
      fresh: now < data.expiresAt
    }))
  }
}

// Export singleton instance
export const serpAPICacheManager = new SerpAPICacheManager()
