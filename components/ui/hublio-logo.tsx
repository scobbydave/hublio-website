import Image from "next/image"

interface HublioLogoProps {
  className?: string
  variant?: "full" | "icon"
}

export function HublioLogo({ className = "h-8 w-auto", variant = "full" }: HublioLogoProps) {
  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="/logos/hublio-logo-dark.png"
          alt="Hublio Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative h-8 w-8">
        <Image
          src="/logos/hublio-logo-dark.png"
          alt="Hublio Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Hublio
      </span>
    </div>
  )
}
