# Talynk Project - Complete File Tree

```
capstone/
│
├── 📄 Configuration Files
├── package.json              # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── .npmrc                   # NPM configuration
├── .gitignore               # Git ignore rules
│
├── 🔐 Environment
├── .env.example             # Environment variables template
├── .env.local               # Local development variables (DO NOT COMMIT)
│
├── 📚 Documentation
├── README.md                # Project overview & features
├── DEVELOPMENT.md           # Development guide & setup
├── DEPLOYMENT.md            # Deployment instructions
├── ARCHITECTURE.md          # System design & data flows
├── IMPLEMENTATION.md        # Implementation summary
├── QUICK_REFERENCE.md       # Quick reference guide
│
├── 📂 prisma/
│   ├── schema.prisma        # Database schema (all models)
│   ├── seed.ts              # Database seed script
│   └── migrations/          # Database migrations (auto-generated)
│
├── 📂 public/
│   └── ...                  # Static files, images
│
├── 📂 src/
│   │
│   ├── 📂 app/              # Next.js App Router
│   │   │
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Landing page (/)
│   │   ├── globals.css      # Global styles
│   │   │
│   │   ├── 📂 api/          # API Routes
│   │   │   ├── 📂 media/
│   │   │   │   └── route.ts ✨ # Upload & classify media
│   │   │   ├── 📂 recommendations/
│   │   │   │   └── route.ts ✨ # Recommendation management
│   │   │   └── 📂 health/
│   │   │       └── route.ts     # Health check
│   │   │
│   │   ├── 📂 auth/         # Authentication pages
│   │   │   ├── 📂 signup/
│   │   │   │   └── page.tsx     # User signup page
│   │   │   ├── 📂 login/
│   │   │   │   └── page.tsx     # User login page
│   │   │   └── 📂 callback/
│   │   │       └── page.tsx     # Auth callback handler
│   │   │
│   │   └── 📂 dashboard/    # User dashboards
│   │       ├── page.tsx         # Dashboard redirect
│   │       ├── setup/
│   │       │   └── page.tsx     # Profile setup page
│   │       ├── 📂 talent/
│   │       │   ├── page.tsx ✨  # Talent dashboard
│   │       │   └── 📂 settings/
│   │       │       └── page.tsx # Talent settings
│   │       └── 📂 sponsor/
│   │           ├── page.tsx ✨  # Sponsor dashboard
│   │           └── 📂 settings/
│   │               └── page.tsx # Sponsor settings
│   │
│   ├── 📂 components/       # React components
│   │   │
│   │   ├── 📂 ui/           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📂 forms/        # Form components
│   │   │   └── ...
│   │   │
│   │   └── MediaUploadDialog.tsx ✨ # Main media upload component
│   │
│   ├── 📂 lib/              # Library/utility functions
│   │   │
│   │   ├── prisma.ts        # Prisma client singleton
│   │   │
│   │   ├── classification.ts ✨ # Media classification logic
│   │   │   ├── classifyMediaWithHuggingFace()
│   │   │   ├── classifyMediaLocally()
│   │   │   └── mapLabelToSector()
│   │   │
│   │   └── 📂 supabase/     # Supabase utilities
│   │       ├── client.ts    # Browser Supabase client
│   │       ├── server.ts    # Server Supabase client
│   │       └── storage.ts   # File upload/storage functions
│   │
│   ├── 📂 types/            # TypeScript type definitions
│   │   └── index.ts         # All application types
│   │
│   └── 📂 utils/            # Utility functions
│       └── helpers.ts       # Formatting, styling helpers
│
└── 🎉 Ready to Start!
```

## Legend
- ✨ = Core features
- 📂 = Directory
- 📄 = File
- 🔐 = Security-related
- 🎓 = Educational/Documentation

---

## Key Files by Purpose

### 🔑 Most Important Files

1. **prisma/schema.prisma** - Database schema (defines all data models)
2. **src/app/api/media/route.ts** - Media upload & classification
3. **src/lib/classification.ts** - AI classification logic
4. **src/components/MediaUploadDialog.tsx** - Upload UI component
5. **src/app/page.tsx** - Landing page

### 📚 Documentation Files

1. **README.md** - Start here for project overview
2. **DEVELOPMENT.md** - Setup and development guide
3. **DEPLOYMENT.md** - How to deploy
4. **ARCHITECTURE.md** - System design
5. **QUICK_REFERENCE.md** - Fast lookup

### 🔐 Security Files

1. **.env.example** - Environment template
2. **.env.local** - Your local secrets (never commit)
3. **.gitignore** - Files to ignore in Git

### 🎨 UI Component Files

All in `src/components/ui/`:
- button.tsx
- card.tsx
- input.tsx
- label.tsx
- badge.tsx
- dialog.tsx
- textarea.tsx

### 🗄️ Database Files

1. **prisma/schema.prisma** - Database schema
2. **prisma/seed.ts** - Initial data
3. **src/lib/prisma.ts** - Prisma client

---

## Getting Started Path

1. Read: **README.md** (overview)
2. Read: **QUICK_REFERENCE.md** (quick lookup)
3. Run: `npm install`
4. Setup: `.env.local` (copy from `.env.example`)
5. Read: **DEVELOPMENT.md** (setup details)
6. Run: `npm run dev`
7. Explore: `http://localhost:3000`

---

## Feature Implementation Locations

### Authentication
- Files: `src/app/auth/`, `src/lib/supabase/`
- Provider: Supabase Auth

### Media Upload
- Files: `src/components/MediaUploadDialog.tsx`
- API: `src/app/api/media/route.ts`
- Storage: `src/lib/supabase/storage.ts`

### Classification
- Files: `src/lib/classification.ts`
- Methods: Hugging Face API + Local fallback

### Recommendations
- Files: `src/app/api/recommendations/route.ts`
- Database: Prisma models

### Dashboards
- Talent: `src/app/dashboard/talent/page.tsx`
- Sponsor: `src/app/dashboard/sponsor/page.tsx`

---

## Database Schema Quick View

```
User (authentication)
├── Talent (one user)
│   └── Media (many)
│       └── Sector
└── Sponsor (one user)
    └── Sectors (many)

Recommendation
├── Talent
├── Sponsor
└── Media
```

---

## Commands Reference

```bash
npm install                 # Install dependencies
npm run dev                # Start development server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio
```

---

## Next Steps After Setup

1. ✅ Install dependencies: `npm install`
2. ✅ Setup database: `npm run prisma:migrate`
3. ✅ Seed data: `npm run prisma:seed`
4. ✅ Start dev: `npm run dev`
5. ✅ Test signup/login
6. ✅ Test media upload
7. ✅ View recommendations

Then customize:
- Add database connection logic
- Implement messaging system
- Add analytics
- Deploy to production

---

For detailed information on any file or feature, see the documentation files!
