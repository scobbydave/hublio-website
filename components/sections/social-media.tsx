import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getAllSocialMediaLinks } from "@/lib/social-media"
import { SocialIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons"
import { Users, TrendingUp, MessageSquare } from "lucide-react"

export function SocialMediaSection() {
  const socialLinks = getAllSocialMediaLinks()

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Stay Connected
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Mining Community</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow Hublio across social platforms for the latest mining industry insights, AI technology updates, and
            behind-the-scenes content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Instagram */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <SocialIcon platform="instagram" className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Instagram</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Behind-the-scenes content, team updates, and mining industry visuals
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Users className="h-4 w-4" />
                <span>@hublioapp</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://www.instagram.com/hublioapp/" target="_blank" rel="noopener noreferrer">
                  Follow
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* TikTok */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center mx-auto mb-4">
                <TikTokIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">TikTok</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Quick mining tech tips, AI insights, and industry trends in short-form content
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>@hublio</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://www.tiktok.com/@hublio" target="_blank" rel="noopener noreferrer">
                  Follow
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Business */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-green-500 flex items-center justify-center mx-auto mb-4">
                <WhatsAppIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp Business</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Direct communication for business inquiries and quick support
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <MessageSquare className="h-4 w-4" />
                <span>+27 60 873 1659</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://wa.me/27608731659" target="_blank" rel="noopener noreferrer">
                  Message
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* All Links CTA */}
        <div className="text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">All Social Links</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find all our social media profiles and links in one place
              </p>
              <Button asChild className="hublio-gradient border-0 text-white">
                <Link href="https://linktr.ee/Hublio" target="_blank" rel="noopener noreferrer">
                  Visit linktr.ee/Hublio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
