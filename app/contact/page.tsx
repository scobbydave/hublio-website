import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactForm } from "@/components/sections/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 hublio-gradient">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Contact Us</h1>
              <p className="mt-6 text-lg leading-8 opacity-90">
                Ready to transform your mining operations? Get in touch with our team of experts.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Mail className="h-6 w-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Email</h3>
                            <p className="text-muted-foreground">info@hublio.co.za</p>
                            <p className="text-muted-foreground">admin@hublio.co.za</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Phone className="h-6 w-6 text-secondary mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Phone</h3>
                            <p className="text-muted-foreground">+27 60 873 1659</p>
                            <p className="text-muted-foreground">+27 76 443 3250 (Emergency)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <MapPin className="h-6 w-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Head Office</h3>
                            <p className="text-muted-foreground">
                              
                              65 Fairways Pinnacle point
                              
                              <br />
                              Golf Estate Mosselbay, Western Cape
                              <br />
                              6500
                              <br />
                              South Africa
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Clock className="h-6 w-6 text-secondary mt-1" />
                          <div>
                            <h3 className="font-semibold mb-1">Office Hours</h3>
                            <p className="text-muted-foreground">
                              Monday - Friday: 8:00 AM - 5:00 PM
                              <br />
                              Saturday: 9:00 AM - 2:00 PM
                              <br />
                              Sunday: Closed
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Emergency Support</h3>
                  <Card className="border-destructive/20">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">
                        24/7 emergency support available for critical mining operations and safety incidents.
                      </p>
                      <div className="flex items-center space-x-2 text-destructive font-semibold">
                        <Phone className="h-4 w-4" />
                        <span>Emergency Hotline: +27 86 001 0111</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
