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
    const gaId = process.env.NEXT_PUBLIC_GA_ID

    if (gaId) {
      // Google Analytics implementation
      const script = document.createElement("script")
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      window.gtag = gtag
      
      gtag("js", new Date())
      gtag("config", gaId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        // Enhanced ecommerce and custom tracking
        custom_map: {
          'custom_parameter_1': 'user_type'
        },
        // For better attribution
        allow_ad_personalization_signals: false,
        allow_google_signals: true,
        // Track site interactions
        enhanced_ecommerce: true
      })

      // Track initial page view
      gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      })

      // Set up custom dimensions
      gtag("config", gaId, {
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

      gtag("event", "section_view", {
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
