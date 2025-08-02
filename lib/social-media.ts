// Hublio's Official Social Media Links
// Source: https://linktr.ee/Hublio

export const socialMediaLinks = {
  instagram: {
    url: "https://www.instagram.com/hublio_official/",
    label: "Instagram",
    icon: "instagram",
    handle: "@hublio_official",
  },
  tiktok: {
    url: "https://www.tiktok.com/@hublio",
    label: "TikTok",
    icon: "tiktok",
    handle: "@hublio",
  },
  facebook: {
    url: "https://www.facebook.com/HublioOfficial",
    label: "Facebook",
    icon: "facebook",
    handle: "HublioOfficial",
  },
  whatsapp: {
    url: "https://wa.me/27821234567", // Business WhatsApp
    label: "WhatsApp",
    icon: "whatsapp",
    handle: "+27 82 123 4567",
  },
  website: {
    url: "https://hublio.co.za",
    label: "Website",
    icon: "globe",
    handle: "hublio.co.za",
  },
  linktree: {
    url: "https://linktr.ee/Hublio",
    label: "Linktree",
    icon: "link",
    handle: "linktr.ee/Hublio",
  },
}

export const socialMediaArray = Object.values(socialMediaLinks)

// Get social media links for specific platforms
export function getSocialMediaLink(platform: keyof typeof socialMediaLinks) {
  return socialMediaLinks[platform]
}

// Get all social media links as array
export function getAllSocialMediaLinks() {
  return socialMediaArray
}

// Get social media links for footer (excluding website)
export function getFooterSocialLinks() {
  return Object.entries(socialMediaLinks)
    .filter(([key]) => key !== "website")
    .map(([, value]) => value)
}
