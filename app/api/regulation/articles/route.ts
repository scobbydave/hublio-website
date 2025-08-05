import { NextRequest, NextResponse } from 'next/server';
import { regulationArticleService } from '@/lib/regulation-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const search = searchParams.get('search');

    let articles;

    if (search) {
      articles = await regulationArticleService.search(search);
    } else {
      articles = await regulationArticleService.getAll({
        category: category as any,
        region: region || undefined,
        published: true,
      });
    }

    return NextResponse.json({
      articles,
      total: articles.length,
    });

  } catch (error: any) {
    console.error('Articles API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch regulation articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.body || !data.category) {
      return NextResponse.json(
        { error: 'Title, body, and category are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const article = await regulationArticleService.create({
      ...data,
      slug: { current: slug },
      published: data.published || false,
    });

    return NextResponse.json(article);

  } catch (error: any) {
    console.error('Create article error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create regulation article' },
      { status: 500 }
    );
  }
}
