import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, formType } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Hublio Website <noreply@hublio.co.za>",
      to: ["admin@hublio.co.za"],
      subject: `New ${formType} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New ${formType}</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              ${company ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>` : ""}
              ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0;">This email was sent from the Hublio website contact form.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        {
          success: false,
          message:
            "Sorry, there was an error sending your message. Please try again or contact us directly at admin@hublio.co.za",
        },
        { status: 500 },
      )
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      {
        success: false,
        message:
          "Sorry, there was an error sending your message. Please try again or contact us directly at admin@hublio.co.za",
      },
      { status: 500 },
    )
  }
}
