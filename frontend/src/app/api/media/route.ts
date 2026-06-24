import { NextRequest, NextResponse } from 'next/server';
import { resolveUserId } from '@/lib/auth-request';
import { classifyMediaLocally } from '@/lib/classification';
import {
  evaluateMediaQuality,
  mapFrontendMediaType,
} from '@/lib/ml-service';

const mockMedia: Array<{
  id: string;
  talentId: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  sector: { id: string; name: string };
  confidenceScore: number;
  visibilityScore?: number;
  mlScored: boolean;
  createdAt: Date;
}> = [
  {
    id: 'media-1',
    talentId: 'talent-1',
    title: 'Amara Studio Sessions',
    description: 'Professional recording session',
    type: 'VIDEO',
    fileUrl:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    sector: { id: 'music', name: 'Music' },
    confidenceScore: 95,
    visibilityScore: 95,
    mlScored: false,
    createdAt: new Date(),
  },
  {
    id: 'media-2',
    talentId: 'talent-2',
    title: 'Visual Arts Showcase',
    description: 'Digital art collection',
    type: 'IMAGE',
    fileUrl:
      'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
    sector: { id: 'art', name: 'Visual Art' },
    confidenceScore: 88,
    visibilityScore: 88,
    mlScored: false,
    createdAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const talentId = formData.get('talentId') as string;
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const mediaType = formData.get('type') as string;
    const sectorId =
      (formData.get('sector') as string)?.trim().toLowerCase() || 'music';

    if (!file || !talentId || !title || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userId = resolveUserId(request, talentId);
    const localMediaType =
      mediaType === 'AUDIO'
        ? 'audio'
        : mediaType === 'VIDEO'
          ? 'video'
          : 'image';
    const classification = await classifyMediaLocally(file, localMediaType);
    let visibilityScore: number | undefined;
    let mlScored = false;

    const mlMediaType = mapFrontendMediaType(mediaType);
    if (mlMediaType) {
      try {
        const mlResult = await evaluateMediaQuality(
          userId,
          file,
          mlMediaType,
          sectorId,
          file.name
        );
        visibilityScore = mlResult.visibility_score;
        mlScored = true;
      } catch (mlError) {
        console.warn('ML service unavailable, using local classification:', mlError);
        visibilityScore = Math.round(classification.confidence * 100);
      }
    } else {
      visibilityScore = Math.round(classification.confidence * 100);
    }

    const newMedia = {
      id: `media-${mockMedia.length + 1}`,
      talentId,
      title,
      description,
      type: mediaType,
      fileUrl: `/uploads/${file.name}`,
      sector: { id: sectorId, name: sectorId },
      confidenceScore: visibilityScore,
      visibilityScore,
      mlScored,
      classification: {
        sector: classification.sector,
        labels: classification.labels,
      },
      createdAt: new Date(),
    };

    mockMedia.push(newMedia);
    return NextResponse.json(newMedia);
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const talentId = request.nextUrl.searchParams.get('talentId');

    if (!talentId) {
      return NextResponse.json(
        { error: 'talentId is required' },
        { status: 400 }
      );
    }

    const media = mockMedia
      .filter((m) => m.talentId === talentId)
      .sort(
        (a, b) =>
          (b.visibilityScore ?? b.confidenceScore) -
          (a.visibilityScore ?? a.confidenceScore)
      );

    return NextResponse.json(media);
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
