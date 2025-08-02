import { z } from "zod"

const envSchema = z.object({
  // Sanity (optional for development)
  SANITY_PROJECT_ID: z.string().optional(),
  SANITY_DATASET: z.string().optional(),
  SANITY_API_TOKEN: z.string().optional(),

  // AI (optional - will use fallback content if not provided)
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),

  // Email (optional - forms will work without it)
  RESEND_API_KEY: z.string().optional(),

  // News (optional - will use fallback content if not provided)
  NEWS_API_KEY: z.string().optional(),

  // Admin (required for admin dashboard)
  DASHBOARD_KEY: z.string().min(1),

  // Site (required)
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Rate limiting (optional)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Cron (optional)
  CRON_SECRET: z.string().optional(),
})

// Parse environment variables but don't fail if optional ones are missing
let env: any = {}

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.warn("Some environment variables are missing, using defaults")
  // Create a minimal env object with required fields
  env = {
    DASHBOARD_KEY: process.env.DASHBOARD_KEY || "demo-dashboard-key",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    // Optional fields
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CRON_SECRET: process.env.CRON_SECRET,
  }
}

export { env }

export function validateEnv() {
  try {
    envSchema.parse(process.env)
    return { success: true }
  } catch (error) {
    console.error("❌ Invalid environment variables:", error)
    return { success: false, error }
  }
}

export function getEmailStatus() {
  if (!env.RESEND_API_KEY) {
    return { enabled: false, reason: "RESEND_API_KEY not configured" }
  }

  return { enabled: true }
}
