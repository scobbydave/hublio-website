import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hublio - Intelligent Mining & Logistics Management",
  description:
    "Hublio – The hub for intelligent mining and logistics management. Streamline your operations with real-time data insights and AI-powered analytics.",
  keywords: "mining, logistics, management, AI analytics, data insights, cloud hosting",
  authors: [{ name: "Hublio Team" }],
  openGraph: {
    title: "Hublio - Intelligent Mining & Logistics Management",
    description: "Streamline mining & logistics operations with intelligent data insights and AI-powered analytics.",
    url: "https://hublio.com",
    siteName: "Hublio",
    images: [
      {
        url: "/images/hublio-logo-light.png",
        width: 1200,
        height: 630,
        alt: "Hublio - Mining & Logistics Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hublio - Intelligent Mining & Logistics Management",
    description: "Streamline mining & logistics operations with intelligent data insights.",
    images: ["/images/hublio-logo-light.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/hublio-logo-dark.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/hublio-logo-light.png" />
        <link rel="shortcut icon" href="/images/hublio-logo-dark.png" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
