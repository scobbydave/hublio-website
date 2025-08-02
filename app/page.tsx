import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Testimonials } from "@/components/sections/testimonials"
import { Blog } from "@/components/sections/blog"
import { SocialMediaSection } from "@/components/sections/social-media"
import { Contact } from "@/components/sections/contact"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Blog />
        <SocialMediaSection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
