import { BarChart3, Brain, Zap, Shield, Users, Globe } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description: "Transform raw operational data into actionable insights with our advanced analytics platform.",
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Leverage machine learning algorithms to predict equipment failures and optimize resource allocation.",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description: "Monitor your entire operation in real-time with customizable dashboards and instant alerts.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance with industry standards.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enable seamless collaboration across departments with role-based access and shared insights.",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Scale your operations globally with our cloud-based infrastructure and multi-site support.",
  },
]

const stats = [
  { number: "500+", label: "Mining Operations" },
  { number: "99.9%", label: "Uptime Guarantee" },
  { number: "35%", label: "Average Efficiency Increase" },
  { number: "24/7", label: "Expert Support" },
]

const features = [
  {
    category: "Analytics & Reporting",
    items: [
      "Real-time operational dashboards",
      "Predictive maintenance alerts",
      "Production optimization reports",
      "Cost analysis and tracking",
      "Environmental impact monitoring",
    ],
  },
  {
    category: "Integration & Connectivity",
    items: [
      "ERP system integration",
      "IoT device connectivity",
      "Third-party API support",
      "Legacy system compatibility",
      "Mobile app access",
    ],
  },
  {
    category: "AI & Machine Learning",
    items: [
      "Equipment failure prediction",
      "Resource allocation optimization",
      "Quality control automation",
      "Supply chain optimization",
      "Risk assessment modeling",
    ],
  },
]

export default function LearnMore() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">The Future of Mining Intelligence</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover how Hublio's comprehensive platform transforms mining operations through intelligent data
            analytics, AI-powered insights, and seamless integration capabilities.
          </p>
          <Link
            href="/contact/"
            className="inline-block bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose Hublio?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform delivers measurable results that transform your mining operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-xl border border-orange-600/20 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Comprehensive Feature Set</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to optimize your mining operations in one integrated platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-xl border border-orange-600/20">
                <h3 className="text-xl font-semibold text-white mb-4">{feature.category}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Implementation Process</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our proven methodology ensures smooth deployment and rapid time-to-value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Assessment",
                description: "We analyze your current systems and identify optimization opportunities.",
              },
              {
                step: "02",
                title: "Planning",
                description: "Custom implementation plan tailored to your specific operational needs.",
              },
              {
                step: "03",
                title: "Deployment",
                description: "Seamless integration with minimal disruption to your operations.",
              },
              {
                step: "04",
                title: "Optimization",
                description: "Ongoing support and optimization to maximize your ROI.",
              },
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{phase.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{phase.title}</h3>
                <p className="text-gray-400">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Join the mining companies that have already revolutionized their operations with Hublio's intelligent
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact/"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Request a Demo
            </Link>
            <Link
              href="/about/"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
