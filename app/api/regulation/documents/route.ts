import { NextRequest, NextResponse } from 'next/server';
import { documentAnalysisService } from '@/lib/regulation-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    
    const approvedValue = approved === 'true' ? true : approved === 'false' ? false : undefined;
    const documents = await documentAnalysisService.getAll(approvedValue);

    return NextResponse.json({
      documents,
      total: documents.length,
    });

  } catch (error: any) {
    console.error('Documents API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch document analyses' },
      { status: 500 }
    );
  }
}
