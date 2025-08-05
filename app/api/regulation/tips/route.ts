import { NextRequest, NextResponse } from 'next/server';
import { complianceTipService, regulationFAQService } from '@/lib/regulation-data';
import { geminiService } from '@/lib/gemini';

// Get compliance tips
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    
    const approvedValue = approved === 'true' ? true : approved === 'false' ? false : undefined;
    const tips = await complianceTipService.getAll(approvedValue);

    return NextResponse.json({
      tips,
      total: tips.length,
    });

  } catch (error: any) {
    console.error('Tips API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch compliance tips' },
      { status: 500 }
    );
  }
}

// Generate new compliance tip
export async function POST(request: NextRequest) {
  try {
    const { manual, title, description, category } = await request.json();

    let tip;

    if (manual) {
      // Manual tip creation
      if (!title || !description || !category) {
        return NextResponse.json(
          { error: 'Title, description, and category are required for manual tips' },
          { status: 400 }
        );
      }

      tip = await complianceTipService.create({
        title,
        description,
        category,
        aiGenerated: false,
        approved: true, // Manual tips are auto-approved
      });
    } else {
      // AI-generated tip
      const generatedDescription = await geminiService.generateComplianceTip();
      
      tip = await complianceTipService.create({
        title: 'AI Generated Compliance Tip',
        description: generatedDescription,
        category: 'general',
        aiGenerated: true,
        approved: false, // AI tips need approval
      });
    }

    return NextResponse.json(tip);

  } catch (error: any) {
    console.error('Create tip error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create compliance tip' },
      { status: 500 }
    );
  }
}
