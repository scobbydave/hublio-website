"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HublioLogo } from "@/components/ui/hublio-logo"
import { Menu, X, Moon, Sun, Instagram } from "lucide-react"
import { useTheme } from "next-themes"
import { getSocialMediaLink } from "@/lib/social-media"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const instagramLink = getSocialMediaLink("instagram")

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Vacancies", href: "/vacancies" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <HublioLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6600] to-[#0066FF] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild className="hover:text-primary">
            <Link
              href={instagramLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild className="bg-gradient-to-r from-[#FF6600] to-[#0066FF] text-white border-0 hover:opacity-90">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {mounted && (
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark mode
                    </>
                  )}
                </Button>
              )}

              <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                <Link href={instagramLink.url} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4 mr-2" />
                  Follow on Instagram
                </Link>
              </Button>

              <Button asChild className="w-full bg-gradient-to-r from-[#FF6600] to-[#0066FF] text-white border-0">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
