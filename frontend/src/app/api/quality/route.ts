import { NextRequest, NextResponse } from 'next/server';
import { resolveUserId } from '@/lib/auth-request';
import {
  evaluateMediaQuality,
  mapFrontendMediaType,
} from '@/lib/ml-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sector = (formData.get('sector') as string)?.trim().toLowerCase();
    const mediaType = formData.get('mediaType') as string;
    const userId = resolveUserId(
      request,
      formData.get('userId') as string | null
    );

    if (!file || !sector || !mediaType) {
      return NextResponse.json(
        { error: 'file, sector, and mediaType are required' },
        { status: 400 }
      );
    }

    const mlMediaType = mapFrontendMediaType(mediaType);
    if (!mlMediaType) {
      return NextResponse.json(
        { error: `Media type ${mediaType} is not supported for ML scoring` },
        { status: 400 }
      );
    }

    const result = await evaluateMediaQuality(
      userId,
      file,
      mlMediaType,
      sector,
      file.name
    );

    return NextResponse.json({
      success: true,
      data: {
        visibilityScore: result.visibility_score,
        mediaType: result.media_type,
        sector: result.sector,
        recordedByUser: result.recorded_by_user,
      },
    });
  } catch (error) {
    console.error('Quality evaluation error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to evaluate media quality',
      },
      { status: 502 }
    );
  }
}
