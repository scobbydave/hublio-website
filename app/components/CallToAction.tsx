import Link from "next/link"

export default function CallToAction() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 relative overflow-hidden">
      {/* Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img src="/images/hublio-logo-light.png" alt="" className="h-96 w-auto" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Transform Your Mining Operations?</h2>
        <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
          Join hundreds of mining companies that trust Hublio to optimize their operations and drive growth.
        </p>
        <Link
          href="/contact/"
          className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Request a Demo
        </Link>
      </div>
    </section>
  )
}
