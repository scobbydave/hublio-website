import Link from "next/link"
import { HublioLogo } from "@/components/ui/hublio-logo"
import { Button } from "@/components/ui/button"
import { getFooterSocialLinks } from "@/lib/social-media"
import { SocialIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons"

export function Footer() {
  const socialLinks = getFooterSocialLinks()

  return (
    <footer className="border-t bg-muted/50 relative overflow-hidden">
      {/* Mining Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 border border-primary rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-20 h-20 border border-secondary rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-primary/50 rotate-45"></div>
      </div>

      <div className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <HublioLogo />
            <p className="text-sm text-muted-foreground">
              AI-powered mining solutions for South African enterprises. Transforming the industry through innovation
              and technology.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>AI Systems Online</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-4">
              <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      {social.icon === "tiktok" ? (
                        <TikTokIcon className="h-4 w-4" />
                      ) : social.icon === "whatsapp" ? (
                        <WhatsAppIcon className="h-4 w-4" />
                      ) : (
                        <SocialIcon platform={social.icon} className="h-4 w-4" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <Link
                  href="https://linktr.ee/Hublio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  🔗 All links: linktr.ee/Hublio
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Mining Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">AI Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Mining Analytics</span>
              </li>
              <li>
                <span className="text-muted-foreground">Safety Systems</span>
              </li>
              <li>
                <span className="text-muted-foreground">Process Optimization</span>
              </li>
              <li>
                <span className="text-muted-foreground">24/7 Support</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="mailto:info@hublio.co.za" className="hover:text-primary transition-colors">
                  info@hublio.co.za
                </Link>
              </li>
              <li>
                <Link href="tel:+27215550123" className="hover:text-primary transition-colors">
                  +27 21 555 0123
                </Link>
              </li>
              <li>Cape Town, South Africa</li>
              <li className="text-xs pt-2">
                <span className="text-destructive">Emergency:</span>{" "}
                <Link href="tel:+27215550123" className="hover:text-primary transition-colors">
                  +27 21 555 0123
                </Link>
              </li>
            </ul>

            {/* WhatsApp Business */}
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="text-xs bg-transparent">
                <Link href="https://wa.me/27215550123" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-3 w-3 mr-2" />
                  WhatsApp Business
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; 2025 Hublio. All rights reserved. | Built for Mining</p>
            <div className="flex items-center space-x-4 text-xs">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link
                href="https://linktr.ee/Hublio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Social Links
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
