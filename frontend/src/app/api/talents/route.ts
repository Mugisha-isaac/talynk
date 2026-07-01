// src/app/api/talents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { sectorIdToDiscipline, disciplineToLabel } from '@/lib/sectors';

// GET /api/talents?page=&limit=&category=&search=
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category'); // sector id, e.g. "music"
    const search = searchParams.get('search');

    const discipline = category ? sectorIdToDiscipline(category) : null;

    const where: Prisma.CreatorWhereInput = {
      ...(discipline && { discipline }),
      ...(search && {
        OR: [
          { bio: { contains: search, mode: 'insensitive' } },
          { user: { username: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [creators, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { visibilityScoreCurrent: 'desc' },
        include: { user: true },
      }),
      prisma.creator.count({ where }),
    ]);

    const data = creators.map((creator) => ({
      id: creator.id,
      name: creator.user.username,
      avatar: creator.user.profilePicture,
      category: creator.discipline,
      categoryLabel: disciplineToLabel(creator.discipline),
      verified: false,
      followers: creator.followerCount,
      visibilityScore: creator.visibilityScoreCurrent,
      bio: creator.bio,
      location: creator.location,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
        pagination: { page, limit, total },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/talents error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talents' },
      { status: 500 }
    );
  }
}

// POST /api/talents - Create/update talent profile for the current user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bio, discipline, sector, location, gender } = body;

    const resolvedDiscipline = discipline || (sector ? sectorIdToDiscipline(sector) : null);

    if (!userId || !resolvedDiscipline) {
      return NextResponse.json(
        { success: false, error: 'userId and discipline (or sector) are required' },
        { status: 400 }
      );
    }

    const creator = await prisma.creator.upsert({
      where: { userId },
      update: { bio, discipline: resolvedDiscipline, location, gender },
      create: { userId, bio, discipline: resolvedDiscipline, location, gender },
    });

    return NextResponse.json({ success: true, data: creator }, { status: 201 });
  } catch (error) {
    console.error('POST /api/talents error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create talent' },
      { status: 500 }
    );
  }
}
