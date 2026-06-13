# Talynk - Connect Talent with Opportunity

A modern full-stack platform that matches talented creators with sponsors through intelligent media classification.

## 🎯 Core Concept

Talynk uses AI-powered media classification to create an automated matching pipeline:
1. **Upload** → Talents upload their creative work (images, videos, audio, etc.)
2. **Classify** → Pre-trained AI models automatically categorize content by sector
3. **Match** → Sponsors interested in those sectors discover relevant talents
4. **Connect** → Direct connections form between talents and sponsors

## ✨ What's New (Latest Update)

### 🎨 Beautiful UI/UX
- Clean, modern design across all pages
- Professional Unsplash image integration
- Responsive layouts (mobile-first)
- Smooth animations & transitions
- Accessibility-first components

### 📄 Complete Page Suite
- **Home** - Landing page with hero, features, CTA
- **Talents Directory** - Browse & search all talents
- **Sponsors Directory** - Browse & search companies
- **Talent Profiles** - Individual talent showcases
- **Sponsor Profiles** - Company details
- **About** - Company mission, team, values

### 🎁 New Components
- Navigation with mobile menu
- Professional footer
- TalentCard component
- SponsorCard component
- Search & filtering system

### 🚀 Package Manager
- **Yarn 4.0.0** - Faster, more reliable than npm
- All dependencies compatible
- Better dependency resolution

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Images:** Unsplash (free high-quality images)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Package Manager:** Yarn 4.0.0
- **Classification:** Hugging Face API (with local fallback)

## 📋 Features

### For Talents
- 📤 Upload portfolio items (images, videos, audio, documents)
- 🤖 Automatic AI classification into sectors
- 📊 Track recommendations from sponsors
- 👀 Monitor profile views and engagement
- 🎨 Sector-specific discovery
- 📱 Professional talent profile page

### For Sponsors
- 🔍 Browse talent recommendations by sector
- 💾 Save favorite talents
- 📬 Direct messaging with talents
- 🎯 Sector-focused talent discovery
- 📈 Track talent engagement
- 🏢 Professional company profile page

### General Features
- 🌐 Beautiful landing page
- 🔐 Secure authentication
- 📱 Fully responsive design
- 🎨 Modern gradient UI
- 🚀 Fast performance
- ♿ Accessibility compliant

### Supported Sectors
- Visual Arts
- Photography
- Design
- Music
- Film & Video
- Fashion
- Performance & Theater
- Sports

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── media/             # Media upload & retrieval
│   │   └── recommendations/    # Recommendation management
│   ├── auth/                  # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── dashboard/             # Dashboard pages
│   │   ├── talent/
│   │   ├── sponsor/
│   │   └── setup/
│   ├── talents/               # ✨ Talent directory
│   │   ├── page.tsx          # Browse page
│   │   └── [id]/page.tsx     # Individual profile
│   ├── sponsors/              # ✨ Sponsors directory
│   │   ├── page.tsx          # Browse page
│   │   └── [id]/page.tsx     # Company profile
│   ├── about/page.tsx         # ✨ About page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # ✨ Updated landing page
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Navigation.tsx         # ✨ Header component
│   ├── Footer.tsx             # ✨ Footer component
│   ├── TalentCard.tsx         # ✨ Talent display card
│   ├── SponsorCard.tsx        # ✨ Company display card
│   └── MediaUploadDialog.tsx
├── hooks/
│   └── useAuth.ts             # ✨ Authentication hook
├── lib/
│   ├── unsplash.ts            # ✨ Image utilities
│   ├── supabase/              # Supabase utilities
│   ├── classification.ts      # Media classification
│   └── prisma.ts              # Prisma client
├── types/
│   └── index.ts               # TypeScript types
└── utils/
    └── helpers.ts             # Utility functions
```

## 📦 Database Schema

### Key Models

**User**
- id, email, name, role (TALENT, SPONSOR, ADMIN)
- Has relationship to Talent or Sponsor profile

**Talent**
- id, userId, bio, portfolioUrl, socialLinks
- One-to-many with Media

**Sponsor**
- id, userId, companyName, description, website, logo
- Many-to-many with Sectors

**Media**
- id, talentId, title, description, type (IMAGE, VIDEO, AUDIO, DOCUMENT)
- fileUrl, thumbnailUrl, sectorId
- classification (JSON), confidenceScore

**Sector**
- id, name, description, icon
- Many-to-many with Sponsors and Media

**Recommendation**
- id, talentId, sponsorId, mediaId
- matchScore, status (PENDING, VIEWED, INTERESTED, REJECTED, CONNECTED)
- Unique constraint: (talentId, sponsorId, mediaId)

## 🔧 Quick Start with Yarn

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Database Setup
```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
```

### 4. Start Development
```bash
yarn dev
# Visit http://localhost:3000
```

### Yarn Commands
```bash
yarn dev               # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn prisma:generate  # Generate Prisma client
yarn prisma:migrate   # Run migrations
yarn prisma:studio    # Open Prisma Studio
yarn prisma:seed      # Seed database
```

## 🔧 Setup Instructions (Detailed)

### Prerequisites
- Node.js 18+ & Yarn 4.0.0
- PostgreSQL database (Supabase)
- Hugging Face API key (optional)

### 1. Clone and Install Dependencies

```bash
cd capstone
yarn install  # Use Yarn instead of npm
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
HUGGINGFACE_API_KEY=your_hf_api_key (optional)
```

### 3. Database Setup

```bash
# Generate Prisma client
yarn prisma:generate

# Create and run migrations
yarn prisma:migrate

# Seed initial sectors
yarn prisma:seed

# Open Prisma Studio to inspect database
yarn prisma:studio
```

### 4. Supabase Configuration

1. Create buckets for media storage:
   - `portfolio` (public) - For talent portfolio items
   - `avatars` (public) - For user avatars
   - `logos` (public) - For sponsor logos

2. Enable Supabase Auth (Email/Password)

3. Set up Row Level Security (RLS) policies

### 5. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🤖 Media Classification

### Option 1: Hugging Face API (Production)
Uses pre-trained vision/audio models:
- Image: google/vit-base-patch16-224
- Audio: facebook/wav2vec2-base-960h

**Pros:** High accuracy, handles complex content
**Cons:** API costs, requires internet

### Option 2: Local Classification (Fallback)
Heuristic-based classification using file metadata and naming:
- Analyzes file extensions and MIME types
- Looks for keywords in filenames
- Fast and free

**Pros:** Free, works offline
**Cons:** Lower accuracy for ambiguous content

### Custom Implementation
You can implement custom classification using:
- TensorFlow.js models
- ONNX models
- Other ML frameworks
- Custom trained models

## 🔐 Authentication Flow

1. **User Registration:**
   - Email/password signup with Supabase Auth
   - Profile setup (Talent or Sponsor)
   - Optional: Social login integration

2. **Protected Routes:**
   - Dashboard routes require authentication
   - API routes validate Supabase tokens
   - Row-level security on database level

## 📤 Media Upload Flow

1. User selects media file
2. File uploaded to Supabase Storage
3. Metadata extracted from file
4. Classification API called (or local fallback)
5. Sector identified and stored
6. Media record created in database
7. Recommendations auto-generated for matching sponsors

```
Upload → Supabase Storage → Classification → Database → Recommendations
```

## 🎯 Recommendation Engine

When media is uploaded:
1. Classification determines the sector (e.g., "Music")
2. System finds all sponsors interested in that sector
3. For each matching sponsor:
   - Create a Recommendation record
   - Set matchScore based on classification confidence
   - Notification sent to sponsor (future feature)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
vercel
```

Environment variables at deployment:
- All `.env.local` variables
- Ensure DATABASE_URL points to production database

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 API Endpoints

### Media
- `POST /api/media` - Upload new media
- `GET /api/media?talentId=...` - Get talent's media

### Recommendations
- `GET /api/recommendations?sponsorId=...` - Get sponsor recommendations
- `PATCH /api/recommendations` - Update recommendation status

## 🎨 UI Components Used

Core shadcn/ui components:
- Button, Card, Input, Label, Badge
- Dialog, Textarea, Select
- All with Tailwind CSS styling

## 🔮 Future Enhancements

- [ ] Real-time messaging between talents and sponsors
- [ ] Video preview thumbnails
- [ ] Advanced search and filtering
- [ ] Notification system
- [ ] Payment integration for opportunities
- [ ] Analytics dashboard
- [ ] Portfolio templates
- [ ] Social features (follow, like, comment)
- [ ] AI-powered recommendations (ML model)
- [ ] Video/audio streaming optimization

## 🐛 Troubleshooting

### Supabase Connection Issues
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection with psql
psql $DATABASE_URL -c "SELECT 1"
```

### Media Upload Fails
- Check Supabase bucket permissions
- Verify file size limits (default: 100MB)
- Check MIME type support

### Classification Not Working
- Verify HUGGINGFACE_API_KEY is set
- Check file URL is accessible
- System falls back to local classification

## 📖 Documentation Links

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Hugging Face API](https://huggingface.co/api)

## 📄 License

MIT License - feel free to use for personal and commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for connecting talent with opportunity
