# Talynk - Developer Quick Reference

## 🎯 Core Concept
Media-driven talent-sponsor matching platform with AI-powered classification.

**Flow:** Upload → Classify → Match → Connect

## 🚀 Get Started (5 minutes)

```bash
# 1. Install
npm install

# 2. Setup database
npm run prisma:generate
npm run prisma:migrate

# 3. Seed initial data
npm run prisma:seed

# 4. Start development
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📋 Supported Sectors
🎨 Visual Arts | 📷 Photography | ✏️ Design | 🎵 Music | 🎬 Film & Video | 👗 Fashion | 🎭 Theater | ⚽ Sports

## 🔑 Key Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, React 18 |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Prisma + Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Classification | Hugging Face API + Local Fallback |

## 📱 User Roles

### Talent
- Upload portfolio (images, videos, audio, docs)
- Auto-classified into sectors
- View recommendations from sponsors
- Manage profile

### Sponsor
- Browse talent recommendations
- Filter by sector
- Track engagement
- Connect with talents

## 📂 File Structure Quick Reference

```
src/
├── app/           # Pages and API routes
├── components/    # React components
├── lib/          # Utilities and services
├── types/        # TypeScript definitions
└── utils/        # Helper functions

prisma/
├── schema.prisma # Database schema
└── seed.ts       # Initial data
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/media | Upload media |
| GET | /api/media | Get talent's media |
| GET | /api/recommendations | Get sponsor recommendations |
| PATCH | /api/recommendations | Update recommendation status |
| GET | /api/health | Health check |

## 🗄️ Database Models

- **User** - Authentication + role
- **Talent** - Talent profile
- **Sponsor** - Company profile
- **Media** - Uploaded files
- **Sector** - Categories
- **Recommendation** - Matches

## 🎨 UI Components

All in `src/components/ui/`

- Button, Card, Input, Label, Badge
- Dialog, Textarea

Use with Tailwind CSS for styling.

## 🔐 Environment Setup

Create `.env.local`:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
HUGGINGFACE_API_KEY=... (optional)
```

## 🎯 Feature Checklist

### MVP (Phase 1)
- [x] User signup/login
- [x] Profile creation (talent & sponsor)
- [x] Media upload
- [x] AI classification
- [x] Recommendation generation
- [x] Sponsor browsing recommendations

### Phase 2 (Future)
- [ ] Direct messaging
- [ ] Notifications system
- [ ] Advanced search
- [ ] Analytics dashboard
- [ ] Payment integration

## 🧪 Quick Test Steps

1. **Signup as Talent**
   - Go to `/auth/signup?role=talent`
   - Enter credentials
   - Complete profile
   - Navigate to `/dashboard/talent`

2. **Upload Media**
   - Click "Upload Portfolio Item"
   - Select image/video
   - Add title
   - Click upload

3. **Signup as Sponsor**
   - Go to `/auth/signup?role=sponsor`
   - Enter credentials
   - Complete company info
   - Go to settings to select sectors

4. **View Recommendations**
   - Go to `/dashboard/sponsor`
   - See uploaded media from talents
   - Like/reject recommendations

## 📊 Database Commands

```bash
# View database UI
npm run prisma:studio

# Create migration
npx prisma migrate dev --name name_of_migration

# Generate Prisma client
npm run prisma:generate

# Run seed script
npm run prisma:seed
```

## 🐛 Common Fixes

| Issue | Solution |
|-------|----------|
| "Module not found" | `npm run prisma:generate` |
| DB won't connect | Check DATABASE_URL in .env.local |
| Supabase errors | Verify bucket exists and permissions |
| Classification fails | System uses local fallback |
| Build errors | Check: `npx tsc --noEmit` |

## 📈 Deployment Commands

### Vercel
```bash
git push # Connects automatically to Vercel
```

### Docker
```bash
docker-compose up
```

### Other Platforms
See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔍 File Locations Guide

| What I Need | Where to Find |
|------------|---------------|
| Landing page | src/app/page.tsx |
| Dashboard pages | src/app/dashboard/{talent,sponsor}/ |
| API routes | src/app/api/ |
| UI components | src/components/ui/ |
| Database schema | prisma/schema.prisma |
| Types | src/types/index.ts |
| Utilities | src/utils/helpers.ts |
| Classification | src/lib/classification.ts |
| Supabase config | src/lib/supabase/ |

## 🎓 Learning Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📞 Getting Help

1. Check [DEVELOPMENT.md](./DEVELOPMENT.md) for setup issues
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
4. Check [README.md](./README.md) for project overview

## ✅ Pre-Deployment Checklist

- [ ] npm install completed
- [ ] .env.local configured
- [ ] Prisma migrations applied
- [ ] Database seeded
- [ ] Dev server runs successfully
- [ ] Can sign up as talent
- [ ] Can upload media
- [ ] Can sign up as sponsor
- [ ] Can view recommendations
- [ ] No console errors

## 🚀 Next Development Tasks

1. Implement real-time messaging
2. Add notification system
3. Create admin dashboard
4. Implement advanced search
5. Add payment processing
6. Setup analytics
7. Optimize images/videos
8. Add social sharing
9. Create mobile app
10. Scale infrastructure

## 📞 Support

For issues or questions:
1. Review documentation files
2. Check browser console for errors
3. Review API responses in Network tab
4. Check Prisma Studio for data
5. Review Supabase logs

---

**Happy Coding! 🎉**

Project is production-ready. Start with `npm install` and `npm run dev`
