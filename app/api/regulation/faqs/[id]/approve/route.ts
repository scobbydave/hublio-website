import { NextRequest, NextResponse } from 'next/server';
import { regulationFAQService } from '@/lib/regulation-data';

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

    const result = await regulationFAQService.approve(id, approvedBy);

    return NextResponse.json({
      success: true,
      message: 'FAQ approved successfully',
      data: result,
    });

  } catch (error: any) {
    console.error('Approve FAQ error:', error);
    
    return NextResponse.json(
      { error: 'Failed to approve FAQ' },
      { status: 500 }
    );
  }
}
