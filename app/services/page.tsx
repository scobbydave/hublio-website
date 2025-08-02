import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Shield, TrendingUp, Database, Settings, HeadphonesIcon } from "lucide-react"

const services = [
  {
    title: "AI-Powered Analytics",
    description:
      "Advanced machine learning algorithms that analyze your mining data to provide actionable insights and optimize operations in real-time.",
    icon: Brain,
    features: ["Predictive maintenance", "Resource optimization", "Performance analytics", "Risk assessment"],
    color: "primary",
  },
  {
    title: "Safety Management Systems",
    description:
      "Comprehensive safety solutions that use AI to monitor conditions, predict hazards, and ensure compliance with safety regulations.",
    icon: Shield,
    features: ["Real-time monitoring", "Hazard prediction", "Compliance tracking", "Incident reporting"],
    color: "secondary",
  },
  {
    title: "Operational Efficiency",
    description:
      "Streamline your mining operations with intelligent automation and optimization tools that reduce costs and maximize productivity.",
    icon: TrendingUp,
    features: ["Process automation", "Resource allocation", "Downtime reduction", "Cost optimization"],
    color: "primary",
  },
  {
    title: "Data Integration",
    description:
      "Seamlessly integrate data from multiple sources to create a unified view of your mining operations and enable better decision-making.",
    icon: Database,
    features: ["Multi-source integration", "Real-time dashboards", "Custom reporting", "Data visualization"],
    color: "secondary",
  },
  {
    title: "Custom Solutions",
    description:
      "Tailored AI solutions designed specifically for your unique mining challenges and operational requirements.",
    icon: Settings,
    features: ["Bespoke development", "Industry expertise", "Scalable architecture", "Ongoing support"],
    color: "primary",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical support and consultation from our team of mining and AI experts.",
    icon: HeadphonesIcon,
    features: ["Emergency support", "Technical consultation", "Training programs", "Maintenance services"],
    color: "secondary",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 hublio-gradient">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Our Services</h1>
              <p className="mt-6 text-lg leading-8 opacity-90">
                Comprehensive AI-powered solutions designed to transform your mining operations and drive sustainable
                growth.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Offer</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Cutting-edge solutions tailored for the mining industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={service.title} className={`border-${service.color}/20 hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div
                      className={`h-12 w-12 rounded-lg bg-${service.color}/10 flex items-center justify-center mb-4`}
                    >
                      <service.icon className={`h-6 w-6 text-${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full bg-${service.color} mr-2`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Process</h2>
              <p className="mt-4 text-lg text-muted-foreground">How we work with you to deliver exceptional results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  We analyze your current operations and identify opportunities for improvement.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  We develop a customized AI strategy tailored to your specific needs and goals.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Implementation</h3>
                <p className="text-sm text-muted-foreground">
                  We deploy and integrate our solutions with minimal disruption to your operations.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously monitor and optimize performance to ensure maximum ROI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact us today to learn how our AI-powered solutions can transform your mining operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
