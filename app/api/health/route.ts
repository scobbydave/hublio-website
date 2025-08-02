import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check various system components
    const healthChecks = await Promise.allSettled([
      // Check if key APIs are responding
      fetch('http://localhost:3000/api/ai/analytics', { method: 'HEAD' }),
      fetch('http://localhost:3000/api/blog', { method: 'HEAD' }),
      fetch('http://localhost:3000/api/vacancies', { method: 'HEAD' }),
    ])

    const healthyServices = healthChecks.filter(
      result => result.status === 'fulfilled' && result.value.ok
    ).length

    const systemHealth = Math.round((healthyServices / healthChecks.length) * 100)

    return NextResponse.json({
      success: true,
      systemHealth,
      services: {
        total: healthChecks.length,
        healthy: healthyServices,
        unhealthy: healthChecks.length - healthyServices
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        systemHealth: 0,
        error: 'Health check failed' 
      },
      { status: 500 }
    )
  }
}
