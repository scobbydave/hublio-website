import { UserPlus, Upload, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your Hublio account and set up your mining operation profile in minutes.",
  },
  {
    icon: Upload,
    title: "Upload Data",
    description: "Connect your systems and upload your operational data securely to our platform.",
  },
  {
    icon: TrendingUp,
    title: "Get Actionable Insights",
    description: "Receive AI-powered recommendations and real-time analytics to optimize your operations.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get started with Hublio in three simple steps and transform your mining operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent transform translate-x-1/2 z-0"></div>
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 max-w-sm mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
