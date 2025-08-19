import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import LatestVideo from "@/components/sections/LatestVideo.server"
import { Testimonials } from "@/components/sections/testimonials"
import { SocialMediaSection } from "@/components/sections/social-media"
import { Contact } from "@/components/sections/contact"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import dynamic from "next/dynamic"

// Lazy load the Blog component to improve initial page load
const Blog = dynamic(() => import("@/components/sections/blog").then(mod => ({ default: mod.Blog })), {
  loading: () => <div className="py-20 text-center">Loading latest articles...</div>,
  ssr: false
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
  <LatestVideo channelUrl="https://youtube.com/@hublioapp?si=S6o_8LUtMFo68TRC" />
        <Testimonials />
        <Blog />
        <SocialMediaSection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
