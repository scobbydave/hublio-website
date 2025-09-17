import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('🔄 Starting comprehensive cache revalidation and content refresh...')
    
    // 1. Revalidate all cached paths
    revalidatePath('/blog')
    revalidatePath('/vacancies')
    revalidatePath('/admin-dashboard')
    
    // 2. Revalidate specific cache tags
    revalidateTag('blog-data')
    revalidateTag('vacancy-data')
    revalidateTag('news-feed')
    revalidateTag('fresh-vacancies')
    revalidateTag('safety-tips')

    // 3. Trigger fresh news content fetch (simulates blog generation)
    try {
      const newsRefresh = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/news-feed`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0'
        }
      })
      console.log(`✅ News content refresh: ${newsRefresh.ok ? 'Success' : 'Failed'}`)
    } catch (error) {
      console.error('⚠️ News refresh failed:', error)
    }

    // 4. Trigger fresh vacancy data (simulates vacancy generation)  
    try {
      const vacancyRefresh = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/vacancies/fresh`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, max-age=0'
        }
      })
      console.log(`✅ Vacancy content refresh: ${vacancyRefresh.ok ? 'Success' : 'Failed'}`)
    } catch (error) {
      console.error('⚠️ Vacancy refresh failed:', error)
    }
    
    console.log('✅ Comprehensive cache invalidation and content refresh completed')
    
    return Response.json({ 
      message: 'Cache revalidated and content refreshed successfully',
      timestamp: new Date().toISOString(),
      actions: [
        'Cache paths revalidated: /blog, /vacancies, /admin-dashboard',
        'Cache tags revalidated: blog-data, vacancy-data, news-feed, fresh-vacancies, safety-tips',
        'Fresh news content fetched',
        'Fresh vacancy data fetched'
      ]
    })
  } catch (error) {
    console.error('❌ Cache revalidation failed:', error)
    return Response.json(
      { message: 'Cache revalidation failed', error: String(error) },
      { status: 500 }
    )
  }
}
