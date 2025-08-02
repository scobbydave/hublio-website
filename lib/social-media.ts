// Hublio's Official Social Media Links
// Source: https://linktr.ee/Hublio

export const socialMediaLinks = {
  instagram: {
    url: "https://www.instagram.com/hublioapp/",
    label: "Instagram",
    icon: "instagram",
    handle: "@hublioapp",
  },
  tiktok: {
    url: "https://www.tiktok.com/@hublio",
    label: "TikTok",
    icon: "tiktok",
    handle: "@hublio",
  },
  facebook: {
    url: "https://www.facebook.com/p/Hublio-App-61578776044208/",
    label: "Facebook",
    icon: "facebook",
    handle: "HublioApp",
  },
  whatsapp: {
    url: "https://api.whatsapp.com/send?phone=27608731659",
    label: "WhatsApp",
    icon: "whatsapp",
    handle: "+27 60 873 1659",
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
