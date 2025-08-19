import { Instagram, Facebook, MessageCircle, Globe, Link, Music } from "lucide-react"

interface SocialIconProps {
  platform: string
  className?: string
}

export function SocialIcon({ platform, className = "h-5 w-5" }: SocialIconProps) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className={className} />
    case "facebook":
      return <Facebook className={className} />
    case "whatsapp":
      return <MessageCircle className={className} />
    case "tiktok":
      return <Music className={className} />
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a2.88 2.88 0 00-2.03-2.036C19.644 3.5 12 3.5 12 3.5s-7.644 0-9.468.65A2.88 2.88 0 00.502 6.186 29.84 29.84 0 000 12a29.84 29.84 0 00.502 5.814 2.88 2.88 0 002.03 2.036C4.356 20.5 12 20.5 12 20.5s7.644 0 9.468-.65a2.88 2.88 0 002.03-2.036A29.84 29.84 0 0024 12a29.84 29.84 0 00-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      )
    case "website":
    case "globe":
      return <Globe className={className} />
    case "linktree":
    case "link":
      return <Link className={className} />
    default:
      return <Globe className={className} />
  }
}

// TikTok custom icon (since Lucide doesn't have TikTok)
export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

// WhatsApp custom icon
export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z" />
    </svg>
  )
}
