# Development Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Setup database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed  # Populate initial sectors
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Supabase Configuration

### Create Storage Buckets

1. Go to Supabase dashboard → Storage
2. Create these public buckets:

**portfolio**
- Purpose: Store talent portfolio items (images, videos, etc.)
- Access: Public (anyone with link can view)

**avatars**
- Purpose: User profile pictures
- Access: Public

**logos**
- Purpose: Sponsor company logos
- Access: Public

### Enable Authentication

1. Go to Authentication → Providers
2. Enable Email/Password provider
3. Configure redirect URLs in Auth settings:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### Row Level Security (RLS)

Create RLS policies to secure data access:

```sql
-- Users can only access their own profile
CREATE POLICY "Users can access own profile"
  ON public.user
  USING (auth.uid() = user_id);

-- Talents can only upload media to their own portfolio
CREATE POLICY "Talents can upload own media"
  ON public.media
  USING (auth.uid() = talent_id);
```

## Database Operations

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create Migration
```bash
npx prisma migrate dev --name add_new_field
```

### View Database
```bash
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555

### Seed Database
```bash
npm run prisma:seed
```

## Project Structure Deep Dive

### App Router
- `/app/page.tsx` - Landing page
- `/app/auth/` - Authentication pages
- `/app/dashboard/` - User dashboards
- `/app/api/` - API routes

### API Routes

**POST /api/media**
- Upload new media
- Triggers classification
- Auto-creates recommendations

```typescript
// Request
{
  file: File,
  talentId: string,
  title: string,
  description?: string,
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'
}

// Response
{
  id: string,
  title: string,
  fileUrl: string,
  sector: { name: string },
  confidenceScore: number
}
```

**GET /api/media**
- Fetch talent's media
- Query: `talentId`

**GET /api/recommendations**
- Fetch sponsor recommendations
- Query: `sponsorId`, `status?`

**PATCH /api/recommendations**
- Update recommendation status
- Body: `{ recommendationId, status }`

## Component Development

### UI Components
All shadcn/ui components are in `src/components/ui/`

### Creating New Components

1. Create component file: `src/components/MyComponent.tsx`
2. Use TypeScript interfaces for props
3. Import shadcn components as needed
4. Export component

Example:
```typescript
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return <div onClick={onClick}>{title}</div>;
}
```

### Form Components

Use `react-hook-form` + `zod` for validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

## Media Classification

### Using Hugging Face API

1. Get API key from [huggingface.co](https://huggingface.co)
2. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_xxxxx
   ```
3. System automatically uses it in production

### Local Fallback
If Hugging Face API fails, the system falls back to heuristic-based classification using file metadata.

### Custom Implementation
To implement custom classification:

1. Edit `src/lib/classification.ts`
2. Modify `classifyMediaWithHuggingFace()` function
3. Return `ClassificationResult` object:
   ```typescript
   {
     sector: string,
     confidence: number,
     labels: Array<{ label: string, score: number }>,
     rawData?: any
   }
   ```

## Authentication Flow

### Signup
1. User enters email/password
2. Supabase creates auth user
3. Redirect to profile setup
4. Talent/Sponsor profile created
5. Redirect to dashboard

### Login
1. User enters credentials
2. Supabase validates
3. Session token stored in cookies
4. Redirect to dashboard

### Protected Routes
Use middleware or client-side checks:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/auth/login');
    };
    checkAuth();
  }, []);

  // Component content
}
```

## Testing

### Manual Testing Checklist
- [ ] Signup flow (talent and sponsor)
- [ ] Login flow
- [ ] Media upload
- [ ] Classification works
- [ ] Recommendations generated
- [ ] Sponsor can view recommendations
- [ ] Status updates work
- [ ] Settings save correctly

### API Testing with curl

```bash
# Test media upload
curl -X POST http://localhost:3000/api/media \
  -F "file=@image.jpg" \
  -F "talentId=123" \
  -F "title=My Art" \
  -F "type=IMAGE"

# Get media
curl http://localhost:3000/api/media?talentId=123

# Get recommendations
curl http://localhost:3000/api/recommendations?sponsorId=456

# Update recommendation
curl -X PATCH http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"xyz","status":"INTERESTED"}'
```

## Performance Tips

1. **Database Queries**
   - Use `include` for related data
   - Avoid N+1 queries
   - Add indexes on frequently queried fields

2. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Generate thumbnails

3. **API Calls**
   - Implement caching with SWR/React Query
   - Batch requests when possible
   - Use pagination for large datasets

4. **Frontend**
   - Code split components with dynamic imports
   - Optimize bundle size
   - Use production builds

## Debugging

### Enable Prisma Logging
In `src/lib/prisma.ts`, change:
```typescript
log: ['query', 'info', 'warn', 'error']
```

### Check Supabase Logs
- Go to Supabase dashboard → Logs
- View auth, database, and storage logs

### Browser DevTools
- Network tab: Check API calls
- Console: View client-side errors
- React DevTools: Inspect component state

### Common Issues

**"Missing DATABASE_URL"**
- Check `.env.local` file exists
- Verify DATABASE_URL value

**"Unauthorized" from Supabase**
- Check auth token in localStorage
- Verify RLS policies
- Check service role key in server routes

**"Classification fails"**
- Check HUGGINGFACE_API_KEY
- Verify file URL is accessible
- Check network connectivity

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Static files optimized
- [ ] API routes working
- [ ] Authentication configured
- [ ] Storage buckets created
- [ ] RLS policies applied
- [ ] Error handling in place
- [ ] Monitoring set up
- [ ] Backups configured

## Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Happy coding! 🚀
