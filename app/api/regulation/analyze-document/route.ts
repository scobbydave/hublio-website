import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';
import { documentAnalysisService } from '@/lib/regulation-data';

export async function POST(request: NextRequest) {
  try {
    const { text, fileName, uploadedBy } = await request.json();

    if (!text || !fileName || !uploadedBy) {
      return NextResponse.json(
        { error: 'Text, fileName, and uploadedBy are required' },
        { status: 400 }
      );
    }

    // Analyze document with Gemini
    const analysis = await geminiService.analyzeDocument(text);

    // Save to Sanity CMS for admin review
    const savedAnalysis = await documentAnalysisService.create({
      fileName,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      checklist: analysis.complianceChecklist,
      uploadedBy,
      approved: false,
    });

    return NextResponse.json({
      id: savedAnalysis._id,
      ...analysis,
      message: 'Document analyzed successfully. Results are pending admin review.'
    });

  } catch (error: any) {
    console.error('Document analysis error:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze document. Please try again.' },
      { status: 500 }
    );
  }
}
