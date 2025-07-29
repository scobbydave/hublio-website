import Link from "next/link"
import { Linkedin, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-orange-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            
            <p className="text-gray-400 mb-4">
              Streamlining mining and logistics operations with intelligent data insights and AI-powered analytics.
            </p>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Hublio. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Home
              </Link>
              <Link href="/about/" className="block text-gray-400 hover:text-orange-500 transition-colors duration-200">
                About
              </Link>
              <Link
                href="/learn-more/"
                className="block text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Learn More
              </Link>
              <Link
                href="/contact/"
                className="block text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/company/hublio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com/hublio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://facebook.com/hublio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
