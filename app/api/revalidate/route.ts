import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the path to revalidate from the request
    const body = await request.json()
    const { path = '/blog' } = body

    // Revalidate the specified path
    revalidatePath(path)
    
    // Also revalidate commonly updated paths
    revalidatePath('/blog')
    revalidatePath('/vacancies')
    
    console.log(`✅ Revalidated path: ${path}`)
    
    return Response.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString() 
    })
  } catch (err) {
    console.error('❌ Error revalidating:', err)
    return Response.json({ 
      revalidated: false, 
      error: String(err) 
    }, { status: 500 })
  }
}
