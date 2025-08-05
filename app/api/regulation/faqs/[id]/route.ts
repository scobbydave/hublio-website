import { NextRequest, NextResponse } from 'next/server';
import { regulationFAQService } from '@/lib/regulation-data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await regulationFAQService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'FAQ rejected successfully',
    });

  } catch (error: any) {
    console.error('Reject FAQ error:', error);
    
    return NextResponse.json(
      { error: 'Failed to reject FAQ' },
      { status: 500 }
    );
  }
}
