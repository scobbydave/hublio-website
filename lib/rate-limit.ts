import type { NextRequest } from "next/server"

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory rate limiting (replace with Redis in production)
const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up old entries
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < windowStart) {
        delete store[key]
      }
    })

    // Get or create entry for this identifier
    if (!store[identifier] || store[identifier].resetTime < windowStart) {
      store[identifier] = {
        count: 0,
        resetTime: now + config.windowMs,
      }
    }

    const entry = store[identifier]

    if (entry.count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    entry.count++

    return {
      success: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for different proxy setups)
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"

  return ip
}

// Rate limit configurations
export const rateLimits = {
  chat: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
  contact: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 submissions per minute
}
