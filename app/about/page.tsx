import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 hublio-gradient">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">About Hublio</h1>
              <p className="mt-6 text-lg leading-8 opacity-90">
                Transforming South Africa's mining industry through innovative AI-powered solutions and cutting-edge
                technology.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-primary mr-3" />
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To revolutionize the mining industry in South Africa by providing cutting-edge AI solutions that
                    enhance safety, optimize operations, and drive sustainable growth. We're committed to empowering
                    mining companies with the tools they need to thrive in an increasingly competitive landscape.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-secondary mr-3" />
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading provider of AI-powered mining solutions in Africa, setting new standards for
                    innovation, safety, and efficiency. We envision a future where technology and human expertise work
                    together to create a more sustainable and prosperous mining industry.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for excellence in every solution we deliver, ensuring the highest quality and performance
                    standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                  <p className="text-muted-foreground">
                    We believe in the power of partnership, working closely with our clients to achieve shared success.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously push the boundaries of what's possible, bringing cutting-edge technology to
                    traditional industries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Meet the experts behind Hublio's innovative solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-1">Florence Kholofelo Mabilo</h3>
                  <p className="text-primary font-medium mb-2">CEO & Founder</p>
                  <p className="text-sm text-muted-foreground">
                    A respected South African entrepreneur and business leader with multiple directorship under the La Fancy Kay Group banner. Her ventures span IT, financial services, sanotation, agribusiness, and home support
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-1">Thabo Sephuma</h3>
                  <p className="text-secondary font-medium mb-2">Social Media Manager</p>
                  <p className="text-sm text-muted-foreground">
                    developed and implemented successful social media strategies that drive engagement, brand awareness and conversations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-1">Grey Emiaha</h3>
                  <p className="text-primary font-medium mb-2">Head of Operations</p>
                  <p className="text-sm text-muted-foreground">
                    Operations expert with deep knowledge of South African mining regulations and safety standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 hublio-gradient">
          <div className="container">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to Transform Your Mining Operations?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join the growing number of mining companies that trust Hublio to optimize their operations and enhance
                safety.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
