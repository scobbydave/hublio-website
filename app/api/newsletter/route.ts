import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Please enter your email address." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 })
    }

    // Send notification email to admin
    await resend.emails.send({
      from: "Hublio Website <noreply@hublio.co.za>",
      to: ["admin@hublio.co.za"],
      subject: "New Newsletter Subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Newsletter Subscription</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0;">Add this email to your newsletter list.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! You'll receive our latest updates soon.",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Sorry, there was an error. Please try again later.",
      },
      { status: 500 },
    )
  }
}
