import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Call the safety tips generation endpoint
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ai/safety-tips`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to generate safety tips: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      message: "Daily safety tips generated successfully",
      ...result 
    })
  } catch (error) {
    console.error("Error in daily safety tips cron:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to generate daily safety tips" 
    }, { status: 500 })
  }
}
