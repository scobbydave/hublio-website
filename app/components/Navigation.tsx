"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-orange-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group relative">
            
            {/* Optional: Add company name with hover effect */}
            <span className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300 hidden sm:block">
              Hublio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-500 transition-colors duration-200">
              Home
            </Link>
            <Link href="/about/" className="text-white hover:text-orange-500 transition-colors duration-200">
              About
            </Link>
            <Link href="/learn-more/" className="text-white hover:text-orange-500 transition-colors duration-200">
              Learn More
            </Link>
            <Link href="/contact/" className="text-white hover:text-orange-500 transition-colors duration-200">
              Contact
            </Link>
            <Link
              href="/contact/"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-orange-500 transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-orange-600/20">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about/"
                className="text-white hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/learn-more/"
                className="text-white hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Learn More
              </Link>
              <Link
                href="/contact/"
                className="text-white hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/contact/"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 inline-block text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
