import { NextResponse } from 'next/server';
import { ensureMlServiceToken } from '@/lib/ml-auth';

export async function POST() {
  try {
    await ensureMlServiceToken();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ML bootstrap auth failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to authenticate with ML service',
    }, { status: 502 });
  }
}
