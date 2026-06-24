import { NextRequest, NextResponse } from 'next/server';
import { resolveUserId } from '@/lib/auth-request';
import {
  getSectorRecommendations,
  mapMlToRecommendation,
} from '@/lib/ml-service';

const mockRecommendations = [
  {
    id: 'rec-1',
    talentId: 'talent-1',
    sponsorId: 'sponsor-1',
    mediaId: 'media-1',
    matchScore: 92,
    status: 'PENDING',
    reason: 'Your content style matches brand aesthetics',
    createdAt: new Date(),
  },
  {
    id: 'rec-2',
    talentId: 'talent-2',
    sponsorId: 'sponsor-1',
    mediaId: 'media-2',
    matchScore: 87,
    status: 'VIEWED',
    reason: 'High engagement rate fits campaign goals',
    createdAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sponsorId = searchParams.get('sponsorId');
    const sector =
      searchParams.get('sector') ||
      searchParams.get('category') ||
      'music';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const userId = resolveUserId(request, sponsorId);

    if (sponsorId && !searchParams.get('sector') && !searchParams.get('category')) {
      const recommendations = mockRecommendations.filter(
        (r) => r.sponsorId === sponsorId
      );
      return NextResponse.json(recommendations);
    }

    try {
      const mlResponse = await getSectorRecommendations(userId, sector);
      const mapped = mlResponse.results.map((item) =>
        mapMlToRecommendation(item, mlResponse.sector)
      );

      const start = (page - 1) * limit;
      const paginated = mapped.slice(start, start + limit);

      return NextResponse.json({
        data: paginated,
        pagination: {
          page,
          limit,
          total: mapped.length,
          hasMore: start + limit < mapped.length,
        },
        source: mlResponse.source,
        sector: mlResponse.sector,
      });
    } catch (mlError) {
      console.warn('ML recommendations unavailable, using fallback:', mlError);

      const fallback = mockRecommendations.map((rec) => ({
        ...rec,
        matchScore: rec.matchScore,
      }));

      return NextResponse.json({
        data: fallback.slice(0, limit),
        pagination: {
          page,
          limit,
          total: fallback.length,
          hasMore: false,
        },
        source: 'fallback',
        sector,
      });
    }
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

    const rec = mockRecommendations.find((r) => r.id === recommendationId);
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
