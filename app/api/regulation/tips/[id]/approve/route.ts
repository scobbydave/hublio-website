import { NextRequest, NextResponse } from 'next/server';
import { complianceTipService } from '@/lib/regulation-data';

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

    const result = await complianceTipService.approve(id, approvedBy);

    return NextResponse.json({
      success: true,
      message: 'Compliance tip approved successfully',
      data: result,
    });

  } catch (error: any) {
    console.error('Approve tip error:', error);
    
    return NextResponse.json(
      { error: 'Failed to approve compliance tip' },
      { status: 500 }
    );
  }
}
