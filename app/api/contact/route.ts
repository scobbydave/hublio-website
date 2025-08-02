import { type NextRequest, NextResponse } from "next/server"
import { sendLeadNotification, sendWelcomeEmail } from "@/lib/email"
import { rateLimit, getClientIdentifier, rateLimits } from "@/lib/rate-limit"

const contactRateLimit = rateLimit(rateLimits.contact)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = contactRateLimit(identifier)

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { firstName, lastName, email, company, message } = body

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: "First name, email, and message are required" }, { status: 400 })
    }

    console.log("Processing contact form submission:", { firstName, lastName, email, company })

    const leadData = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      message: `Company: ${company || "Not specified"}\n\nMessage: ${message}`,
      source: "contact-form" as const,
    }

    // Try to send lead notification (don't fail if email fails)
    let emailStatus = "Email notifications disabled"
    try {
      const leadResult = await sendLeadNotification(leadData)
      if (leadResult.success) {
        if (leadResult.warning) {
          emailStatus = "Form submitted successfully (email notifications not configured)"
        } else {
          emailStatus = "Form submitted and team notified"
        }
      } else {
        console.error("Lead notification failed:", leadResult.error)
        emailStatus = "Form submitted (notification email failed)"
      }
    } catch (emailError) {
      console.error("Email service error:", emailError)
      emailStatus = "Form submitted (email service unavailable)"
    }

    // Try to send welcome email (don't fail if email fails)
    try {
      const welcomeResult = await sendWelcomeEmail(email, leadData.name)
      if (!welcomeResult.success && !welcomeResult.warning) {
        console.error("Welcome email failed:", welcomeResult.error)
      }
    } catch (emailError) {
      console.error("Welcome email service error:", emailError)
    }

    // Always return success to the user
    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll be in touch soon.",
      details: emailStatus,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({
      success: true, // Still return success to avoid user confusion
      message: "Thank you for your message! We've received your inquiry and will be in touch soon.",
      details: "Form submitted successfully",
    })
  }
}
