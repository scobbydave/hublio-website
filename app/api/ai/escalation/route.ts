import { type NextRequest, NextResponse } from "next/server"
import { sendLeadNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, originalQuestion, userMessage, escalationType } = body

    // Log escalation to admin
    console.log("AI Escalation:", {
      sessionId,
      originalQuestion,
      escalationType,
      timestamp: new Date().toISOString(),
    })

    // Send notification to admin about the escalation
    await sendLeadNotification({
      name: "AI Chat User",
      email: "unknown@escalation.ai",
      message: `AI ESCALATION REQUIRED:

Original Question: "${originalQuestion}"
Full Message: "${userMessage}"
Escalation Type: ${escalationType}
Session ID: ${sessionId}
Timestamp: ${new Date().toISOString()}

The AI was unable to provide a satisfactory answer and escalated this inquiry to human experts. Please follow up with this user.`,
      source: "chat", // Change to valid source type
      sessionId,
    })

    return NextResponse.json({
      success: true,
      message: "Escalation logged successfully",
    })
  } catch (error) {
    console.error("Escalation logging error:", error)
    return NextResponse.json(
      { error: "Failed to log escalation" },
      { status: 500 }
    )
  }
}
