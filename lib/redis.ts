import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedisClient() {
  if (!redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

// Chat memory functions
export async function saveChatMemory(sessionId: string, messages: any[]) {
  const client = getRedisClient()
  if (!client) return false
  
  try {
    // Store chat history for 24 hours
    await client.setex(`chat:${sessionId}`, 86400, JSON.stringify(messages))
    return true
  } catch (error) {
    console.error('Failed to save chat memory:', error)
    return false
  }
}

export async function getChatMemory(sessionId: string): Promise<any[]> {
  const client = getRedisClient()
  if (!client) return []
  
  try {
    const data = await client.get(`chat:${sessionId}`)
    return data ? JSON.parse(data as string) : []
  } catch (error) {
    console.error('Failed to get chat memory:', error)
    return []
  }
}

export async function clearChatMemory(sessionId: string) {
  const client = getRedisClient()
  if (!client) return false
  
  try {
    await client.del(`chat:${sessionId}`)
    return true
  } catch (error) {
    console.error('Failed to clear chat memory:', error)
    return false
  }
}

// Rate limiting functions
export async function checkRateLimit(identifier: string, limit: number = 20, window: number = 3600): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return true // Allow if Redis is not available
  
  try {
    const key = `rate_limit:${identifier}`
    const current = await client.incr(key)
    
    if (current === 1) {
      await client.expire(key, window)
    }
    
    return current <= limit
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return true // Allow on error
  }
}

// Analytics functions
export async function trackEvent(event: string, data: any = {}) {
  const client = getRedisClient()
  if (!client) return
  
  try {
    const timestamp = new Date().toISOString()
    const eventData = {
      event,
      timestamp,
      ...data
    }
    
    // Store event for 7 days
    await client.lpush(`analytics:${event}`, JSON.stringify(eventData))
    await client.expire(`analytics:${event}`, 604800) // 7 days
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export async function getAnalytics(event: string, limit: number = 100) {
  const client = getRedisClient()
  if (!client) return []
  
  try {
    const data = await client.lrange(`analytics:${event}`, 0, limit - 1)
    return data.map((item: any) => JSON.parse(item))
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return []
  }
}
