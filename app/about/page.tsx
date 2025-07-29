import { Target, Eye } from "lucide-react"

const teamMembers = [
  {
    name: "Ngoasheng Molefi",
    position: "CEO & Founder",
    bio: "Former mining engineer with 15+ years of experience in operations optimization.",
    avatar: "/placeholder.svg?height=200&width=200&text=JS",
  },
  {
    name: "Maredi Davidson",
    position: "CTO",
    bio: "AI and machine learning expert specializing in industrial applications.",
    avatar: "/placeholder.svg?height=200&width=200&text=SD",
  },
  {
    name: "Mike Johnson",
    position: "Head of Operations",
    bio: "Logistics specialist with deep expertise in supply chain optimization.",
    avatar: "/placeholder.svg?height=200&width=200&text=MJ",
  },
]

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About Hublio</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're revolutionizing the mining industry through intelligent data analytics and AI-powered insights.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2020, Hublio emerged from a simple observation: the mining industry was drowning in data but
                starving for insights. Our founders, with decades of combined experience in mining operations and
                technology, recognized the need for a platform that could transform raw operational data into actionable
                intelligence.
              </p>
              <p className="text-gray-300 mb-6">
                Today, Hublio serves mining companies worldwide, helping them optimize operations, reduce costs, and
                make data-driven decisions that drive sustainable growth. Our AI-powered platform processes millions of
                data points daily, providing real-time insights that keep operations running smoothly and efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-black/50 p-6 rounded-xl border border-orange-600/20">
                <Target className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                <p className="text-gray-400">
                  To empower mining companies with intelligent data insights that drive operational excellence and
                  sustainable growth.
                </p>
              </div>
              <div className="bg-black/50 p-6 rounded-xl border border-orange-600/20">
                <Eye className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
                <p className="text-gray-400">
                  To be the leading platform for mining intelligence, transforming how the industry operates through AI
                  and data analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The experts behind Hublio's innovative mining intelligence platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-orange-600/20 text-center">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-orange-500"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-orange-500 font-medium mb-4">{member.position}</p>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
