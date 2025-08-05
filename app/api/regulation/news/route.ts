import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';
import axios from 'axios';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'mining';
    const region = searchParams.get('region') || 'south africa';

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API not configured' },
        { status: 500 }
      );
    }

    // Fetch mining-related news
    const query = `${category} compliance OR ${category} regulation OR ${category} safety ${region}`;
    const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey,
      },
    });

    const articles: NewsArticle[] = newsResponse.data.articles;

    // Summarize articles with Gemini
    const summarizedArticles = await Promise.all(
      articles.slice(0, 5).map(async (article) => {
        try {
          const fullText = `${article.title}\n\n${article.description}\n\n${article.content || ''}`;
          const summary = await geminiService.summarizeNews(fullText);
          
          return {
            ...article,
            aiSummary: summary,
            tags: extractTags(article.title + ' ' + article.description),
          };
        } catch (error) {
          console.error(`Failed to summarize article: ${article.title}`, error);
          return {
            ...article,
            aiSummary: article.description,
            tags: extractTags(article.title + ' ' + article.description),
          };
        }
      })
    );

    return NextResponse.json({
      articles: summarizedArticles,
      total: newsResponse.data.totalResults,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('News API error:', error);
    
    if (error.response?.status === 426) {
      return NextResponse.json(
        { error: 'News API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch mining news. Please try again.' },
      { status: 500 }
    );
  }
}

function extractTags(text: string): string[] {
  const keywords = [
    'safety', 'environmental', 'compliance', 'regulation', 'licensing',
    'mining', 'coal', 'gold', 'platinum', 'diamond', 'iron ore',
    'south africa', 'johannesburg', 'cape town', 'dmr', 'samrad'
  ];
  
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => lowerText.includes(keyword));
}
