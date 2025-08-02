import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, TrendingUp, Users } from "lucide-react"
import AnimatedHeader, { MiningSection } from "@/components/AnimatedHeader"

const features = [
  {
    title: "AI-Powered Analytics",
    description:
      "Advanced machine learning algorithms analyze your mining data to provide actionable insights and optimize operations.",
    icon: Brain,
  },
  {
    title: "Enhanced Safety",
    description:
      "Real-time monitoring and predictive analytics help identify potential safety risks before they become incidents.",
    icon: Shield,
  },
  {
    title: "Increased Efficiency",
    description:
      "Optimize resource allocation, reduce downtime, and maximize productivity with intelligent automation.",
    icon: TrendingUp,
  },
  {
    title: "Expert Support",
    description: "Our team of mining and AI experts provide ongoing support and consultation for your specific needs.",
    icon: Users,
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
              Discover how our AI solutions can transform your mining operations
            </p>
          </AnimatedHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedHeader key={feature.title} delay={0.1 * index}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/20 hover:border-l-primary/60">
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
