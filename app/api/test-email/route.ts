import { NextRequest, NextResponse } from "next/server"
import { sendLeadNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Test lead data
    const testLead = {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message from the AI chat system to verify email delivery is working properly.",
      source: "chat" as const,
      sessionId: "test-session-123",
      phone: "+27 60 873 1659",
      company: "Test Mining Company"
    }

    console.log("Testing email system with lead:", testLead)

    // Send test notification
    const result = await sendLeadNotification(testLead)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
        result: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Email test failed",
        error: result.error
      }, { status: 400 })
    }

  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({
      success: false,
      message: "Email test failed with error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
