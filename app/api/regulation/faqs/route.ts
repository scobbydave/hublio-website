import { NextRequest, NextResponse } from 'next/server';
import { regulationFAQService } from '@/lib/regulation-data';
import { geminiService } from '@/lib/gemini';

// Get FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    
    const approvedValue = approved === 'true' ? true : approved === 'false' ? false : undefined;
    const faqs = await regulationFAQService.getAll(approvedValue);

    return NextResponse.json({
      faqs,
      total: faqs.length,
    });

  } catch (error: any) {
    console.error('FAQs API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch regulation FAQs' },
      { status: 500 }
    );
  }
}

// Generate FAQ answer
export async function POST(request: NextRequest) {
  try {
    const { question, category, manual, answer } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    let faq;

    if (manual && answer) {
      // Manual FAQ creation
      faq = await regulationFAQService.create({
        question,
        answer,
        category: category || 'general',
        aiGenerated: false,
        approved: true, // Manual FAQs are auto-approved
      });
    } else {
      // AI-generated FAQ answer
      const generatedAnswer = await geminiService.generateFAQAnswer(question);
      
      faq = await regulationFAQService.create({
        question,
        answer: generatedAnswer,
        category: category || 'general',
        aiGenerated: true,
        approved: false, // AI FAQs need approval
      });
    }

    return NextResponse.json(faq);

  } catch (error: any) {
    console.error('Create FAQ error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
