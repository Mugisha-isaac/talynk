import { NextRequest, NextResponse } from 'next/server';

// Mock media data
const mockMedia = [
  {
    id: 'media-1',
    talentId: 'talent-1',
    title: 'Amara Studio Sessions',
    description: 'Professional recording session',
    type: 'VIDEO',
    fileUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    sector: { id: 'music', name: 'Music' },
    confidenceScore: 95,
    createdAt: new Date(),
  },
  {
    id: 'media-2',
    talentId: 'talent-2',
    title: 'Visual Arts Showcase',
    description: 'Digital art collection',
    type: 'IMAGE',
    fileUrl: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
    sector: { id: 'art', name: 'Visual Art' },
    confidenceScore: 88,
    createdAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const talentId = formData.get('talentId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const mediaType = formData.get('type') as string;

    if (!file || !talentId || !title || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMedia = {
      id: `media-${mockMedia.length + 1}`,
      talentId,
      title,
      description,
      type: mediaType,
      fileUrl: URL.createObjectURL(file),
      sector: { id: 'music', name: 'Music' },
      confidenceScore: 85,
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

    const media = mockMedia.filter(m => m.talentId === talentId);
    return NextResponse.json(media);
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
