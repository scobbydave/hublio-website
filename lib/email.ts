import { Resend } from "resend"
import { env } from "./env"

// Initialize Resend only if API key is available
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

export interface LeadData {
  name: string
  email: string
  message?: string
  source: "chat" | "contact-form" | "newsletter"
  sessionId?: string
  phone?: string
  company?: string
}

// Use proper sender configuration for Resend
function getSenderEmail(): string {
  // For Resend, you can use onboarding@resend.dev for testing
  // Or use your verified domain like noreply@yourdomain.com
  return "onboarding@resend.dev"
}

function getRecipientEmail(): string {
  // For Resend testing, use the same email as your Resend account
  // Once you verify a domain, you can use maredidtb@gmail.com
  return "admin@hublio.co.za" // This should match your Resend account email
}

export async function sendLeadNotification(lead: LeadData) {
  try {
    console.log("Attempting to send lead notification:", lead)

    // If no Resend API key, log the lead but don't fail
    if (!resend) {
      console.log("No Resend API key - lead notification logged:", lead)
      return { success: true, data: null, warning: "Email service not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: [getRecipientEmail()],
      replyTo: lead.email !== "unknown@escalation.ai" ? lead.email : undefined,
      subject: `🔥 New Lead: ${lead.name} from ${lead.source}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ff6600; margin: 0; font-size: 28px;">🚀 New Lead Alert!</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Hublio Mining Solutions</p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #ff6600;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">👤 Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${lead.email}" style="color: #ff6600; text-decoration: none;">${lead.email}</a></td>
                </tr>
                ${lead.phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="tel:${lead.phone}" style="color: #ff6600; text-decoration: none;">${lead.phone}</a></td>
                </tr>` : ''}
                ${lead.company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
                  <td style="padding: 8px 0; color: #333;">${lead.company}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Source:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #ff6600; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">${lead.source}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                </tr>
              </table>
            </div>
            
            ${lead.message ? `
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">💬 Message:</h3>
              <p style="color: #856404; margin: 0; font-style: italic; line-height: 1.6;">"${lead.message}"</p>
            </div>` : ''}
            
            ${lead.sessionId ? `
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; font-size: 14px; color: #1976d2;"><strong>Session ID:</strong> ${lead.sessionId}</p>
            </div>` : ''}
            
            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 2px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                🤖 This lead was automatically captured by Hublio AI system
              </p>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
                Reply directly to this email to contact the lead
              </p>
            </div>
          </div>
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

    if (!resend) {
      console.log("No Resend API key - welcome email not sent")
      return { success: true, data: null, warning: "Email service not configured" }
    }

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
            <p>📧 info@hublio.co.za | 📞 +27 60 873 1659</p>
            <p>📍 Cape Town, South Africa</p>
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
    if (!resend) {
      console.log("No Resend API key - FAQ notification not sent")
      return { success: true, data: null, warning: "Email service not configured" }
    }

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
    if (!resend) {
      console.log("No Resend API key - social media approval not sent")
      return { success: true, data: null, warning: "Email service not configured" }
    }

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
