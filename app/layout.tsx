import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingChatWidget } from "@/components/ai/floating-chat-widget"
import { Analytics } from "@/components/analytics"
import { Toaster } from "@/components/ui/toaster"
import MiningParticles from "@/components/MiningParticles"
import MiningElevator from "@/components/MiningElevator"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hublio - AI-Powered Mining Solutions | South Africa",
  description:
    "Transform your mining operations with Hublio's AI-powered solutions. Enhance safety, optimize efficiency, and reduce costs with cutting-edge technology designed for South African mining enterprises.",
  keywords:
    "mining, South Africa, AI, enterprise, solutions, safety, analytics, automation, mining technology, Johannesburg",
  authors: [{ name: "Hublio Team" }],
  openGraph: {
    title: "Hublio - AI-Powered Mining Solutions",
    description:
      "AI-powered mining solutions for South African enterprises. Enhance safety, optimize operations, and drive sustainable growth.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Hublio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hublio - Mining AI Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hublio - AI-Powered Mining Solutions",
    description: "Transform your mining operations with AI-powered solutions designed for South African enterprises.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hublio Mining Hub",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF6B00" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} mining-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MiningParticles />
          <MiningElevator />
          <Suspense fallback={null}>
            {children}
            <FloatingChatWidget />
            <Analytics />
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
