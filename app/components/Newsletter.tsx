"use client"

import type React from "react"

import { useState } from "react"

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      setResult(result)

      if (result.success) {
        // Reset form on success
        e.currentTarget.reset()
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Sorry, there was an error. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay Updated with Hublio</h2>
          <p className="text-xl text-gray-400 mb-8">
            Get the latest insights on mining technology, industry trends, and Hublio updates delivered to your inbox.
          </p>

          <div className="bg-gray-900 p-6 rounded-xl border border-orange-600/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {result && (
                <div
                  className={`p-3 rounded-lg text-sm ${result.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
                >
                  {result.message}
                </div>
              )}
            </form>
            <p className="text-gray-500 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
