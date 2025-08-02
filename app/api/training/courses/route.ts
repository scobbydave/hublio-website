import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In production, this would query your training courses database
    return NextResponse.json({
      success: true,
      courses: [], // No dummy data - real courses would be fetched from database
      message: "Training courses database is being configured"
    })
  } catch (error) {
    console.error('Training courses API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch training courses' },
      { status: 500 }
    )
  }
}
