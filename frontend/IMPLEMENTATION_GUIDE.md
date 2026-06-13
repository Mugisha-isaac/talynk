# TALYNK Implementation & Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Local Development Setup](#local-development-setup)
4. [Authentication Implementation](#authentication-implementation)
5. [Database & Prisma](#database--prisma)
6. [API Routes](#api-routes)
7. [Component Development](#component-development)
8. [Styling System](#styling-system)
9. [Performance Optimization](#performance-optimization)
10. [Deployment](#deployment)
11. [Common Tasks](#common-tasks)

---

## Project Overview

**Talynk** is a Next.js 14+ full-stack application with:
- **Frontend**: React 18 with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth (email/password + OAuth)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (subscriptions)

### Tech Stack
```
Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
Backend: Next.js API Routes, Prisma ORM
Database: PostgreSQL
Auth: Supabase Auth
Hosting: Vercel (recommended)
UI Library: shadcn/ui, lucide-react
State Management: React hooks (consider Redux/Zustand for scale)
```

---

## Architecture Overview

### File Structure
```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities & library integrations
├── types/           # TypeScript type definitions
├── styles/          # Global styles & design tokens
└── utils/           # Helper functions
```

### Route Structure

```
Auth Routes (Public)
  /auth/login              - Login page
  /auth/signup             - Signup with role selection
  /auth/onboarding/[role]  - Role-specific onboarding

Dashboard Routes (Protected)
  /dashboard/home          - Personalized feed
  /dashboard/studio        - Upload & media management
  /dashboard/analytics     - Creator analytics
  /dashboard/messages      - Direct messages
  /dashboard/notifications - Notifications
  /dashboard/settings      - Profile settings

Discovery Routes (Public)
  /discover/explore        - Browse creators
  /discover/search         - Search results
  /discover/trending       - Trending creators

Profile Routes (Public)
  /profile/[id]            - Creator public profile
  /sponsors/[id]           - Scout profile
```

### Route Groups

- `(auth)` - Authentication pages (public)
- `(dashboard)` - Protected creator/user dashboard
- `(discovery)` - Public discovery pages

---

## Local Development Setup

### 1. Prerequisites
```bash
Node.js 18+
PostgreSQL 12+
npm or yarn or pnpm
```

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/talynk.git
cd talynk
yarn install
```

### 3. Environment Setup

Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/talynk"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxx"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate dev --name init

# Seed database (optional)
yarn prisma:db:seed

# Open Prisma Studio
yarn prisma:studio
```

### 5. Start Development Server
```bash
yarn dev
```

Visit `http://localhost:3000`

---

## Authentication Implementation

### Supabase Setup

1. Create Supabase account at https://supabase.com
2. Create new project
3. Copy URL and keys to `.env.local`

### Sign Up Flow

```typescript
// src/app/(auth)/signup/page.tsx
const handleSignup = async (email, password, role) => {
  // 1. Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  // 2. Create user profile in database
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      id: data.user.id,
      email,
      role,
    }),
  });
  
  // 3. Redirect to onboarding
  router.push(`/auth/onboarding/${role}`);
};
```

### Protected Routes

Use middleware to protect dashboard routes:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Redirect to login if not authenticated
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

---

## Database & Prisma

### Prisma Commands

```bash
# Generate Prisma client
yarn prisma:generate

# Create migration
yarn prisma:migrate dev --name add_feature

# Reset database
yarn prisma:migrate reset

# Open Prisma Studio
yarn prisma:studio

# Format schema
yarn prisma:format
```

### Working with Models

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### Example: Create User
```typescript
import prisma from '@/lib/prisma';

const user = await prisma.user.create({
  data: {
    id: 'user-id',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'TALENT',
    talent: {
      create: {
        bio: 'Creator bio',
        category: 'Music',
      },
    },
  },
  include: {
    talent: true,
  },
});
```

### Example: Query with Relations
```typescript
// Get creator with media and engagement
const creator = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    talent: true,
    media: {
      include: {
        engagement: true,
      },
    },
    _count: {
      select: { followers: true },
    },
  },
});
```

---

## API Routes

### API Route Structure

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── signup/route.ts
│   └── logout/route.ts
├── users/
│   ├── route.ts              # POST create, GET list
│   ├── [id]/route.ts         # GET, PUT, DELETE
│   └── [id]/profile/route.ts # GET profile details
├── media/
│   ├── route.ts              # POST upload, GET list
│   ├── [id]/route.ts         # GET, DELETE
│   └── [id]/engage/route.ts  # POST like/comment/share
├── recommendations/
│   └── route.ts              # GET personalized feed
└── search/
    └── route.ts              # GET search results
```

### Example: API Route

```typescript
// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { talent: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
    });
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
```

### Error Handling Pattern

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

function successResponse<T>(data: T, status = 200): ApiResponse<T> {
  return { success: true, data, status };
}

function errorResponse(error: string, status = 500): ApiResponse<null> {
  return { success: false, error, status };
}
```

---

## Component Development

### Component Structure

```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { MyComponentProps } from '@/types';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

/**
 * MyComponent - Brief description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}

export default MyComponent;
```

### Component Best Practices

1. **Type Everything**
   ```typescript
   interface Props {
     title: string;
     onClick: (id: string) => void;
     items: Array<{ id: string; name: string }>;
   }
   
   export function Component({ title, onClick, items }: Props) {
     // ...
   }
   ```

2. **Use Custom Hooks for Logic**
   ```typescript
   // src/hooks/useMedia.ts
   export function useMedia() {
     const [media, setMedia] = useState([]);
     // Logic here
     return { media, uploadMedia };
   }
   ```

3. **Document with JSDoc**
   ```typescript
   /**
    * Renders a creator card with profile and follow button
    * @param creator - Creator data
    * @param onFollow - Callback when follow button clicked
    * @returns React component
    */
   ```

---

## Styling System

### CSS Variables (Design Tokens)

All styling uses CSS custom properties defined in `src/styles/design-system.css`:

```css
/* Colors */
--primary-blue: #3B82F6;
--primary-purple: #A78BFA;
--bg-darkest: #0F1419;
--text-primary: #FFFFFF;

/* Spacing (4px base unit) */
--sp-1: 4px;
--sp-2: 8px;
--sp-3: 12px;

/* Animations */
--duration-base: 250ms;
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Tailwind + CSS Variables

```tsx
// Uses CSS variables through Tailwind
<div className="bg-bg-darkest text-text-primary p-sp-4 rounded-lg shadow-lg">
  Content
</div>
```

### Creating Themed Components

```tsx
// Component with design system integration
<button 
  className="
    bg-gradient-primary 
    text-white 
    py-sp-3 
    px-sp-4 
    rounded-lg 
    hover:shadow-lg 
    transition-all 
    duration-base
  "
>
  Click Me
</button>
```

### Animation Classes

```tsx
// Use predefined animations
<div className="animate-fade-in">Fades in on mount</div>
<div className="animate-slide-up">Slides up</div>
<div className="hover-lift">Lifts on hover</div>
<button className="active-scale:active">Scales on click</button>
```

---

## Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
  quality={80}
/>
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <Skeleton />,
});
```

### Memoization

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(function Component(props) {
  // Only re-renders if props change
  return <div>{props.content}</div>;
});
```

### Data Fetching with SWR

```tsx
import useSWR from 'swr';

function Component() {
  const { data, error, isLoading } = useSWR(
    '/api/recommendations',
    fetch
  );
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return <div>{/* render data */}</div>;
}
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Or use CLI
vercel deploy
```

### Environment Variables

Set in Vercel project settings:
```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Database Migration

```bash
# Before deploying
yarn prisma:migrate deploy
```

---

## Common Tasks

### Adding a New Page

1. Create file: `src/app/[route]/page.tsx`
2. Add route type in `src/types/index.ts`
3. Add navigation link if needed

```typescript
// src/app/features/page.tsx
'use client';

export default function FeaturesPage() {
  return <div>Features page</div>;
}
```

### Creating a New API Endpoint

1. Create file: `src/app/api/[route]/route.ts`
2. Export handler: `GET`, `POST`, `PUT`, `DELETE`

```typescript
// src/app/api/features/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ features: [] });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ created: true }, { status: 201 });
}
```

### Using Database in Component

```typescript
'use client';

import { useEffect, useState } from 'react';

export function Component() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
  
  return <div>{/* Render data */}</div>;
}
```

### Authenticating API Routes

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Process request
  return NextResponse.json({ success: true });
}
```

### Form Validation

```typescript
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

type SignupData = z.infer<typeof signupSchema>;

// In handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);
    
    // Process valid data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue**: `getStaticProps` not working
- **Solution**: Use `fetch` in page component with `cache: 'no-store'` or ISR revalidate

**Issue**: Prisma client errors
- **Solution**: Run `yarn prisma:generate` after schema changes

**Issue**: Supabase authentication fails
- **Solution**: Check `.env.local` variables match project settings

**Issue**: Images not loading in production
- **Solution**: Update `next.config.js` to allow Supabase image domains

```javascript
images: {
  remotePatterns: [
    { hostname: '*.supabase.co' },
    { hostname: 'images.unsplash.com' },
  ],
}
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Happy coding! 🚀**
