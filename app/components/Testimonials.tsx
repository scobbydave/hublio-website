"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "Operations Manager",
    company: "MineCore Industries",
    content:
      "Hublio has revolutionized our mining operations. The real-time insights have helped us increase efficiency by 35% while reducing operational costs.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=SJ",
  },
  {
    name: "Michael Chen",
    position: "Logistics Director",
    company: "Global Mining Solutions",
    content:
      "The AI-powered analytics provided by Hublio have given us unprecedented visibility into our supply chain. Highly recommended for any mining operation.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=MC",
  },
  {
    name: "Emma Rodriguez",
    position: "CEO",
    company: "EcoMine Technologies",
    content:
      "Implementation was seamless, and the results were immediate. Hublio's platform has become an essential tool for our decision-making process.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=ER",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how mining companies worldwide are transforming their operations with Hublio
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-black/50 p-8 rounded-xl border border-orange-600/20">
            <div className="flex items-center justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
              ))}
            </div>

            <blockquote className="text-xl text-gray-300 text-center mb-8 italic">
              "{testimonials[currentIndex].content}"
            </blockquote>

            <div className="flex items-center justify-center">
              <img
                src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                alt={testimonials[currentIndex].name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="text-center">
                <div className="text-white font-semibold">{testimonials[currentIndex].name}</div>
                <div className="text-orange-500">{testimonials[currentIndex].position}</div>
                <div className="text-gray-400 text-sm">{testimonials[currentIndex].company}</div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-orange-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
