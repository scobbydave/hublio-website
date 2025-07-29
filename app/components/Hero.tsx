"use client"
import Link from "next/link"

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-orange-900/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Large Hublio Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <img
                src="/images/hublio-logo-dark.png"
                alt="Hublio"
                className="h-24 sm:h-32 lg:h-40 w-auto transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-[0_0_20px_rgba(255,102,0,0.6)]"
              />
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-150"></div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-orange-400 bg-clip-text text-transparent">
            Streamline Mining & Logistics with Hublio
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            An intelligent hub for smarter mining operations. Transform your data into actionable insights with
            AI-powered analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              Get Started
            </button>
            <Link
              href="/learn-more/"
              className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        
      </div>
    </section>
  )
}
