"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function Analytics() {
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
      gtag("config", gaId)
    }
  }, [])

  return null
}
