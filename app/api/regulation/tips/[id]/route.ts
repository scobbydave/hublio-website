import { NextRequest, NextResponse } from 'next/server';
import { complianceTipService } from '@/lib/regulation-data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await complianceTipService.reject(id);

    return NextResponse.json({
      success: true,
      message: 'Compliance tip rejected successfully',
    });

  } catch (error: any) {
    console.error('Reject tip error:', error);
    
    return NextResponse.json(
      { error: 'Failed to reject compliance tip' },
      { status: 500 }
    );
  }
}
