// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with real database queries after Prisma setup
const mockUsers = [
  {
    id: '1',
    name: 'Amara Okonkwo',
    email: 'amara@talynk.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    role: 'TALENT',
    followers: 1250,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Chioma Studios',
    email: 'chioma@talynk.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chioma',
    role: 'TALENT',
    followers: 890,
    createdAt: new Date('2024-02-10'),
  },
];

/**
 * GET /api/users - List users (with pagination)
 * Query params: page, limit, role, search
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const total = mockUsers.length;
    const skip = (page - 1) * limit;
    const users = mockUsers.slice(skip, skip + limit);

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      followers: 0,
      createdAt: new Date(),
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
