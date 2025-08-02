import { Resend } from "resend"
import { env } from "./env"

const resend = new Resend(env.RESEND_API_KEY)

export interface LeadData {
  name: string
  email: string
  message?: string
  source: "chat" | "contact-form" | "newsletter"
  sessionId?: string
}

// Use a development-friendly sender address
function getSenderEmail(): string {
  // In development, use the default Resend domain
  if (process.env.NODE_ENV === "development") {
    return "onboarding@resend.dev"
  }

  // In production, you would use your verified domain
  // return "noreply@yourdomain.com"
  return "onboarding@resend.dev"
}

function getRecipientEmail(): string {
  // In development, send to a test email or the same sender
  if (process.env.NODE_ENV === "development") {
    return "test@example.com" // This won't actually send, but won't error
  }

  // In production, use your actual business email
  return "info@hublio.co.za"
}

export async function sendLeadNotification(lead: LeadData) {
  try {
    console.log("Attempting to send lead notification:", lead)

    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: [getRecipientEmail()],
      subject: `New Lead: ${lead.name} (${lead.source})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6600;">New Lead Captured - Hublio Mining Solutions</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Source:</strong> ${lead.source}</p>
            ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ""}
            ${lead.sessionId ? `<p><strong>Session ID:</strong> ${lead.sessionId}</p>` : ""}
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This lead was automatically captured by Hublio AI system.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Email send error:", error)

      // Don't throw error for domain verification issues in development
      if (error.message?.includes("domain is not verified")) {
        console.log("Domain not verified - this is expected in development")
        return { success: true, data: null, warning: "Email not sent - domain not verified" }
      }

      return { success: false, error }
    }

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    console.log("Attempting to send welcome email to:", email)

    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: [email],
      subject: "Welcome to Hublio - Your Mining Solutions Partner",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6600;">Welcome to Hublio, ${name}!</h1>
          <p>Thank you for your interest in our mining solutions. Our team will be in touch with you shortly.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>Our sales team will contact you within 24 hours</li>
              <li>We'll schedule a consultation to understand your needs</li>
              <li>You'll receive a customized solution proposal</li>
            </ul>
          </div>
          
          <p>In the meantime, feel free to explore our latest insights on mining technology and industry trends.</p>
          
          <p>Best regards,<br>The Hublio Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Contact us:</p>
            <p>📧 info@hublio.co.za | 📞 +27 11 123 4567</p>
            <p>📍 Johannesburg, South Africa</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Welcome email error:", error)

      // Don't throw error for domain verification issues in development
      if (error.message?.includes("domain is not verified")) {
        console.log("Domain not verified - welcome email not sent")
        return { success: true, data: null, warning: "Email not sent - domain not verified" }
      }

      return { success: false, error }
    }

    console.log("Welcome email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Welcome email error:", error)
    return { success: false, error }
  }
}

export async function sendFAQNotification(faq: { question: string; answer: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: [getRecipientEmail()],
      subject: "New AI-Generated FAQ Added",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6600;">New FAQ Generated</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-bottom: 10px;">Question:</h3>
            <p style="margin-bottom: 20px;">${faq.question}</p>
            
            <h3 style="color: #1e293b; margin-bottom: 10px;">AI-Generated Answer:</h3>
            <p>${faq.answer}</p>
            
            <p style="margin-top: 20px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This FAQ was automatically generated and added to your CMS. Please review and edit if necessary.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("FAQ notification error:", error)
      if (error.message?.includes("domain is not verified")) {
        return { success: true, data: null, warning: "Email not sent - domain not verified" }
      }
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("FAQ notification error:", error)
    return { success: false, error }
  }
}

export async function sendSocialMediaApproval(data: {
  blogPost: any
  socialPosts: Array<{ platform: string; content: string }>
}) {
  try {
    const postsHtml = data.socialPosts
      .map(
        (post) => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="color: #1e293b; margin-bottom: 10px;">${post.platform}</h4>
          <p style="white-space: pre-wrap; font-family: monospace; background: #f8fafc; padding: 10px; border-radius: 4px;">${post.content}</p>
        </div>
      `,
      )
      .join("")

    const { data: emailData, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: [getRecipientEmail()],
      subject: `Social Media Posts Ready for Approval - ${data.blogPost.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6600;">Social Media Posts Generated</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Blog Post:</h3>
            <p><strong>Title:</strong> ${data.blogPost.title}</p>
            <p><strong>Summary:</strong> ${data.blogPost.summary}</p>
          </div>

          <h3 style="color: #1e293b;">Generated Social Media Posts:</h3>
          ${postsHtml}
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            These posts were automatically generated by Hublio AI system. Please review and approve before publishing.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Social media approval email error:", error)
      if (error.message?.includes("domain is not verified")) {
        return { success: true, data: null, warning: "Email not sent - domain not verified" }
      }
      return { success: false, error }
    }

    return { success: true, data: emailData }
  } catch (error) {
    console.error("Social media approval email error:", error)
    return { success: false, error }
  }
}
