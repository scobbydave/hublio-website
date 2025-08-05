import { NextRequest, NextResponse } from 'next/server';
import { documentAnalysisService } from '@/lib/regulation-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approvedBy } = await request.json();
    const { id } = params;

    if (!approvedBy) {
      return NextResponse.json(
        { error: 'Approved by field is required' },
        { status: 400 }
      );
    }

    const result = await documentAnalysisService.approve(id, approvedBy);

    return NextResponse.json({
      success: true,
      message: 'Document analysis approved successfully',
      data: result,
    });

  } catch (error: any) {
    console.error('Approve document error:', error);
    
    return NextResponse.json(
      { error: 'Failed to approve document analysis' },
      { status: 500 }
    );
  }
}
