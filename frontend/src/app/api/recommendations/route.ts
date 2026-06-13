import { NextRequest, NextResponse } from 'next/server';

// Mock recommendations data
const mockRecommendations = [
  {
    id: 'rec-1',
    talentId: 'talent-1',
    sponsorId: 'sponsor-1',
    mediaId: 'media-1',
    matchScore: 92,
    status: 'PENDING',
    reason: 'Your content style matches brand aesthetics',
  },
  {
    id: 'rec-2',
    talentId: 'talent-2',
    sponsorId: 'sponsor-1',
    mediaId: 'media-2',
    matchScore: 87,
    status: 'VIEWED',
    reason: 'High engagement rate fits campaign goals',
  },
];

export async function GET(request: NextRequest) {
  try {
    const sponsorId = request.nextUrl.searchParams.get('sponsorId');

    if (!sponsorId) {
      return NextResponse.json(
        { error: 'sponsorId is required' },
        { status: 400 }
      );
    }

    const recommendations = mockRecommendations.filter(r => r.sponsorId === sponsorId);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendationId, status } = body;

    if (!recommendationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const rec = mockRecommendations.find(r => r.id === recommendationId);
    if (rec) {
      rec.status = status;
    }

    return NextResponse.json(rec || { error: 'Not found' });
  } catch (error) {
    console.error('Recommendation update error:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}
