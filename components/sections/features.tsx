import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, Users, Clock, FileText, Calendar } from "lucide-react"
import AnimatedHeader, { MiningSection } from "@/components/AnimatedHeader"

const features = [
  {
    title: "AI-Enhanced HR Operations",
    description:
      "Intelligent automation streamlines leave approvals, document processing, and employee onboarding with machine learning optimization.",
    icon: Brain,
  },
  {
    title: "Comprehensive Compliance",
    description:
      "Automated POPIA compliance, audit trails, and safety documentation ensure regulatory adherence across all mining operations.",
    icon: Shield,
  },
  {
    title: "Seamless Integration",
    description:
      "Connect existing clocking systems, medical facilities, and payroll platforms through our unified HR ecosystem.",
    icon: Clock,
  },
  {
    title: "Mining Industry Expertise",
    description: "Purpose-built for mining operations with shift management, occupational health tracking, and industry-specific workflows.",
    icon: Users,
  },
  {
    title: "Smart Document Management",
    description:
      "AI-powered document categorization, automated acknowledgments, and intelligent search across all company resources.",
    icon: FileText,
  },
  {
    title: "Intelligent Scheduling",
    description:
      "Advanced algorithms optimize shift patterns, medical appointments, and training sessions for maximum operational efficiency.",
    icon: Calendar,
  },
]

export function Features() {
  return (
    <MiningSection className="py-20 bg-muted/50" id="features">
      <div className="container">
        <div className="text-center mb-16">
          <AnimatedHeader>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Hublio?</h2>
          </AnimatedHeader>
          <AnimatedHeader delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground">
              Transform your mining workforce management with AI-powered HR solutions designed for the industry
            </p>
          </AnimatedHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedHeader key={feature.title} delay={0.1 * index}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/20 hover:border-l-primary/60 h-full">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </AnimatedHeader>
          ))}
        </div>
      </div>
    </MiningSection>
  )
}
