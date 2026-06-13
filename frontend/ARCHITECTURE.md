# Talynk Architecture

## System Overview

Talynk is a full-stack web application that matches talented creators with sponsors through AI-powered media classification.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  Landing Page │ Auth Pages │ Dashboards │ UI Components          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js Routes)                    │
│ /api/media │ /api/recommendations │ /api/health                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌────────┐      ┌─────────┐    ┌──────────┐
    │Supabase│      │Supabase │    │Hugging   │
    │Storage │      │Auth     │    │Face API  │
    └────────┘      └─────────┘    └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│         Database Layer (Supabase PostgreSQL)                     │
│ Users │ Talents │ Sponsors │ Media │ Sectors │ Recommendations  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form + Zod
- **Notifications:** react-hot-toast

### Backend
- **Runtime:** Node.js
- **API Routes:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth

### External Services
- **Media Classification:** Hugging Face API
- **Hosting:** Vercel (or similar)
- **Database Hosting:** Supabase

## Data Flow

### 1. Media Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Talent User                               │
│                   Selects Media File                             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MediaUploadDialog Component                    │
│              Collects Title, Description, Type                  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POST /api/media                              │
│              FormData: file, talentId, metadata                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
┌─────────────┐         ┌──────────────────┐
│Upload to    │         │Extract           │
│Supabase     │         │File Metadata     │
│Storage      │         │(type, size, etc) │
└────────────┬┘         └────────┬─────────┘
    │                           │
    └───────────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │Call Classification   │
         │Engine               │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
    ┌────┤Hugging Face API      │
    │    │(if available)        │
    │    └──────────────────────┘
    │
    └────┐
         │ ┌──────────────────────┐
         └─┤Local Fallback        │
           │Classification       │
           └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │Create/Update Sector  │
         │in Database          │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │Create Media Record   │
         │in Database          │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │Find Matching Sponsors│
         │by Sector            │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │Create Recommendation │
         │Records              │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │Response to User      │
         │Success Message      │
         └──────────────────────┘
```

### 2. Recommendation Discovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       Sponsor User                               │
│                  Opens Recommendations Page                      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 GET /api/recommendations                        │
│              Query: sponsorId, status (optional)                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│         Prisma Query Database                                   │
│   SELECT recommendations                                        │
│   WHERE sponsorId = ? AND (status = ? OR all)                  │
│   INCLUDE talent, media, sector                                │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│      Return Recommendations Sorted by Match Score               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│   Frontend Renders Recommendation Cards                         │
│   Display: Talent Name, Media Preview, Match Score, Sector    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│     Sponsor Interacts (Heart, Message, Save)                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│         PATCH /api/recommendations                             │
│      Update status: VIEWED, INTERESTED, REJECTED, etc          │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Design

### Entity Relationship Diagram

```
┌────────────────┐
│     User       │
├────────────────┤
│ id (PK)        │
│ email          │
│ name           │
│ role           │ ──┐
│ avatarUrl      │   │
└────────────────┘   │
    ▲        ▲       │
    │        │       │
    │ 1:1    │       │
    │        └───────┼────────────┐
    │                │            │
    │            ┌───────────┐    │
    │            │  Talent   │    │
    │            ├───────────┤    │
    │            │ id        │    │
    │            │ userId(FK)│────┘ 1:1
    │            │ bio       │
    │            └─────┬─────┘
    │                  │ 1:N
    │                  │
    │            ┌─────▼─────┐
    │            │   Media   │
    │            ├───────────┤
    │            │ id        │
    │            │ talentId  │
    │            │ sectorId  │
    │            │ fileUrl   │
    │            │ confidence│
    │            └─────┬─────┘
    │                  │
    │                  │ N:M
    │                  │
    │            ┌─────▼──────────────┐
    │            │ Recommendation     │
    │            ├────────────────────┤
    │            │ id                 │
    │            │ talentId (FK)      │
    │            │ sponsorId (FK)     │
    │            │ mediaId (FK)       │
    │            │ matchScore         │
    │            │ status             │
    │            └─────┬──────────────┘
    │                  │
    │                  │ N:1
    │                  │
    │     ┌────────────┴───────────┐
    │     │                        │
┌───┴───────┐              ┌──────────────┐
│  Sponsor  │              │    Sector    │
├───────────┤              ├──────────────┤
│ id        │              │ id           │
│ userId(FK)│──1:1─────┐   │ name         │
│ companyName          │   │ description  │
│ logo      │          │   │ icon         │
│ website   │          │   └──────────────┘
└─────┬─────┘          │         ▲
      │                │         │
      │ N:M            └─────────┤
      │                     N:M  │
      └────────────────────┐     │
                           │     │
                  ┌────────┴─────┴─────┐
                  │ SectorSponsors(   │
                  │   many-to-many)   │
                  └───────────────────┘
```

### Key Models

**User Model**
- Base model for all users
- Stores authentication data via Supabase Auth
- Role determines access level and dashboard

**Talent Model**
- One user can be one talent
- Stores professional information
- One-to-many relationship with Media

**Sponsor Model**
- One user can be one sponsor
- Stores company information
- Many-to-many relationship with Sectors

**Media Model**
- Files uploaded by talents
- Includes classification results
- Links to sectors and talents

**Sector Model**
- Categories for media
- Many-to-many with sponsors and media
- Includes icons for UI display

**Recommendation Model**
- Join table with additional fields
- Tracks relationship between talent media and sponsors
- Stores match score and status

## API Architecture

### Middleware & Validation

```typescript
// API Route Pattern
export async function POST(request: NextRequest) {
  try {
    // 1. Parse Request
    const data = await request.json();
    
    // 2. Validate Input
    if (!data.required_field) {
      return NextResponse.json(
        { error: 'Missing field' },
        { status: 400 }
      );
    }
    
    // 3. Check Authentication (via Supabase token)
    // 4. Process Business Logic
    // 5. Database Operations (Prisma)
    // 6. Return Response
    
    return NextResponse.json(result);
  } catch (error) {
    // 7. Error Handling & Logging
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### API Error Handling

```typescript
// Consistent error responses
{
  error: string,         // Error message
  code?: string,         // Error code
  details?: object,      // Additional info
  timestamp: string      // When error occurred
}
```

## Authentication & Security

### Authentication Flow

```
1. User enters email/password
   ↓
2. POST /auth/signup or /auth/login
   ↓
3. Supabase validates credentials
   ↓
4. Session token returned
   ↓
5. Token stored in localStorage (client)
   ↓
6. Token sent with API requests
   ↓
7. Server validates token
   ↓
8. Grant/Deny access
```

### Security Layers

1. **Frontend:** Redirect unauthenticated users
2. **API:** Validate tokens on each request
3. **Database:** Row-level security policies
4. **Network:** HTTPS only in production

## Performance Considerations

### Database Optimization

```sql
-- Strategic Indexes
CREATE INDEX idx_media_talent ON media(talent_id);
CREATE INDEX idx_recommendations_sponsor ON recommendations(sponsor_id);
CREATE INDEX idx_sector_name ON sector(name);
```

### Query Optimization

```typescript
// Efficient: Eager loading
const recs = await prisma.recommendation.findMany({
  include: {
    talent: { include: { user: true } },
    media: true,
    sponsor: true,
  },
});

// Inefficient: N+1 queries
const recs = await prisma.recommendation.findMany();
for (const rec of recs) {
  await prisma.talent.findUnique({ where: { id: rec.talentId } });
}
```

### Caching Strategy

1. **Client-side:** React Query / SWR for API calls
2. **Server-side:** Consider Redis for frequently accessed data
3. **Static:** Next.js static generation for public pages

## Scalability Path

### Current Architecture
- Suitable for: 1,000-10,000 users
- Single database instance
- Direct API calls

### Scale to 100,000+ Users
1. **Database:** Add read replicas, sharding
2. **Cache:** Implement Redis layer
3. **Storage:** Optimize Supabase buckets
4. **API:** Add rate limiting, pagination
5. **Search:** Implement Elasticsearch
6. **Workers:** Background jobs with Bull/BullMQ

## Deployment Architecture

### Current (Single Region)

```
Vercel
├── API Routes
├── Static Pages
└── Next.js SSR
    │
    ├─→ Supabase (Postgres)
    ├─→ Supabase Storage
    ├─→ Supabase Auth
    └─→ Hugging Face API
```

### Future (Multi-Region)

```
CDN (Cloudflare)
│
├─→ Vercel (US-East)
├─→ Vercel (EU-West)
└─→ Vercel (APAC)
     │
     └─→ Supabase (Primary) + Replicas
```

## Monitoring & Observability

### Logging Levels
- **ERROR:** Critical issues, failures
- **WARN:** Potential problems
- **INFO:** Important events
- **DEBUG:** Detailed information

### Metrics to Track
- API response times
- Database query performance
- Classification API latency
- User signup/login success rate
- Media upload success rate
- Recommendation generation time

## Future Enhancements

1. **Real-time Features:** WebSockets for live notifications
2. **Advanced Search:** Full-text search with Elasticsearch
3. **Machine Learning:** Better matching algorithm
4. **Messaging:** Direct messaging between talents and sponsors
5. **Payments:** Opportunity postings and transactions
6. **Analytics:** Dashboard for user insights

---

For implementation details, see [DEVELOPMENT.md](./DEVELOPMENT.md)
