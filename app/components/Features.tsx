import { BarChart3, Brain, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Real-time Data Insights",
    description: "Monitor your operations with live data visualization and comprehensive analytics dashboards.",
  },
  {
    icon: Brain,
    title: "AI-powered Analytics",
    description: "Leverage machine learning algorithms to predict trends and optimize your mining operations.",
  },
  {
    icon: Zap,
    title: "Easy System Integration",
    description: "Seamlessly connect with your existing systems through our robust API and integration tools.",
  },
  {
    icon: Shield,
    title: "Secure Cloud Hosting",
    description: "Enterprise-grade security with 99.9% uptime guarantee and encrypted data storage.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Smaller logo in features section */}
          <div className="mb-6 flex justify-center">
            <img
              src="/images/hublio-logo-dark.png"
              alt="Hublio"
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features for Modern Mining</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how Hublio transforms your mining and logistics operations with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/50 p-6 rounded-xl border border-orange-600/20 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
