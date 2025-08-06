"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Google Analytics is now loaded in layout.tsx
    // Just track the initial page view and custom events
    if (typeof window !== 'undefined' && window.gtag) {
      // Track initial page view
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      })

      // Set up custom dimensions
      window.gtag("config", "G-LFH6YSTQ70", {
        custom_map: {
          'custom_parameter_1': 'section',
          'custom_parameter_2': 'user_engagement'
        }
      })

      // Track site section based on pathname
      let section = 'home'
      if (pathname.includes('/vacancies')) section = 'vacancies'
      else if (pathname.includes('/blog')) section = 'blog'
      else if (pathname.includes('/regulation')) section = 'regulation'
      else if (pathname.includes('/about')) section = 'about'
      else if (pathname.includes('/contact')) section = 'contact'
      else if (pathname.includes('/services')) section = 'services'
      else if (pathname.includes('/admin')) section = 'admin'

      window.gtag("event", "section_view", {
        section: section,
        page_path: pathname
      })
    }
  }, [pathname])

  // Track page changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      })
    }
  }, [pathname])

  return null
}

// Utility functions for custom event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag("event", eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters
    })
  }
}

export const trackUserInteraction = (action: string, section: string, details?: Record<string, any>) => {
  trackEvent('user_interaction', {
    action,
    section,
    event_category: 'user_engagement',
    ...details
  })
}

export const trackBusinessGoal = (goal: string, value?: number) => {
  trackEvent('business_goal', {
    goal_name: goal,
    value: value || 1,
    event_category: 'business_conversion'
  })
}

// Mining-specific event tracking
export const trackMiningEvent = (eventType: 'vacancy_view' | 'compliance_check' | 'chat_interaction' | 'document_download' | 'contact_inquiry', details?: Record<string, any>) => {
  trackEvent('mining_activity', {
    activity_type: eventType,
    event_category: 'mining_operations',
    ...details
  })
}
