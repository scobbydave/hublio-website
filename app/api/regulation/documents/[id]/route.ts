import { NextRequest, NextResponse } from 'next/server';
import { documentAnalysisService } from '@/lib/regulation-data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await documentAnalysisService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Document analysis rejected successfully',
    });

  } catch (error: any) {
    console.error('Reject document error:', error);
    
    return NextResponse.json(
      { error: 'Failed to reject document analysis' },
      { status: 500 }
    );
  }
}
