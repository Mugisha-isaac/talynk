// src/app/api/talents/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/talents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    // const category = searchParams.get('category');
    // const search = searchParams.get('search');

    // Mock data - replace with Prisma queries
    const mockTalents = [
      {
        id: 'talent-1',
        name: 'Amara Movements',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        category: 'Choreography',
        verified: true,
        followers: 125400,
        engagementRate: 8.2,
        visibilityScore: 92,
        bio: 'Contemporary dance choreographer and performer',
        location: 'Kigali, Rwanda',
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: mockTalents,
        pagination: {
          page,
          limit,
          total: mockTalents.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talents' },
      { status: 500 }
    );
  }
}

// POST /api/talents - Create talent profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate and create talent
    return NextResponse.json(
      {
        success: true,
        data: { id: 'talent-new', ...body },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create talent' },
      { status: 500 }
    );
  }
}
