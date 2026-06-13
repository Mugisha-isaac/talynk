# Talynk - Complete Setup & Usage Guide

## 📦 What's New

### ✅ Yarn Support
- Updated to use **Yarn 4.0.0** instead of npm
- All dependencies compatible
- Faster installs and better dependency resolution

### ✅ New Pages
- **Home** (`/`) - Beautiful landing page with hero, features, CTA
- **Talents** (`/talents`) - Browse all talents with search and sector filtering
- **Sponsors** (`/sponsors`) - Browse companies with search and sector filtering
- **Talent Profile** (`/talents/[id]`) - Individual talent showcase
- **Sponsor Profile** (`/sponsors/[id]`) - Company details page
- **About** (`/about`) - Company mission, values, team, stats

### ✅ New Components
- **Navigation** - Sticky header with mobile menu
- **Footer** - Professional footer with links
- **TalentCard** - Reusable talent display card with hover effects
- **SponsorCard** - Company card with rating and sectors
- **useAuth** Hook - Authentication state management

### ✅ Unsplash Integration
- Utility functions for generating optimized Unsplash image URLs
- Professional images across all pages
- Sample image IDs for each creative sector

### ✅ UI/UX Improvements
- Clean, modern design across all pages
- Responsive layouts (mobile-first)
- Smooth animations and transitions
- Professional color gradients
- Accessibility-first components

---

## 🚀 Quick Start with Yarn

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
```

Then fill in your Supabase credentials:
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
HUGGINGFACE_API_KEY=...
```

### 3. Database Setup
```bash
# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate

# Seed initial data (8 sectors)
yarn prisma:seed
```

### 4. Start Development Server
```bash
yarn dev
```

Visit: **http://localhost:3000**

---

## 📱 Page Structure & Features

### Landing Page (`/`)
- ✨ Hero section with statistics
- 📋 How it works - 3 step process
- 🎯 Why Talynk - 4 feature cards
- 📢 Call-to-action section
- Professional navigation & footer

**Features:**
- Responsive grid layouts
- Gradient backgrounds
- Unsplash hero image
- Stats counter

### Talents Directory (`/talents`)
- 🔍 Search by name or skill
- 🏷️ Filter by 8 creative sectors
- 📊 Showing count of results
- Card-based gallery view
- Individual talent profiles

**Features:**
- Live filtering
- Portfolio count display
- Sector badges
- Match score (when authenticated)

### Sponsors Directory (`/sponsors`)
- 🔍 Search by company name or role
- 🏷️ Filter by sector interests
- ⭐ Company ratings
- Connected talents count
- Website and contact links

**Features:**
- Sector multi-select
- Professional cards
- External links
- Contact information

### About Page (`/about`)
- 📖 Company story
- 💎 Core values (4 pillars)
- 👥 Team members (4 featured)
- 📈 Key statistics
- 📞 Contact section

**Features:**
- Team showcase cards
- Statistics section
- Mission statement
- Call-to-actions

### Individual Profile Pages
- **Talent Profile** (`/talents/[id]`)
  - Profile information
  - Portfolio gallery
  - Contact options
  - Save/Share buttons

- **Sponsor Profile** (`/sponsors/[id]`)
  - Company details
  - Sector interests
  - Contact information
  - Company statistics

---

## 🎨 Components Reference

### Navigation Component
```typescript
<Navigation
  isAuthenticated={boolean}
  userRole={'TALENT' | 'SPONSOR' | 'ADMIN'}
  userName={string}
/>
```

**Features:**
- Responsive desktop & mobile menu
- User account dropdown
- Links to all main pages
- Logo with gradient

### TalentCard Component
```typescript
<TalentCard
  id={string}
  name={string}
  bio={string}
  sector={string}
  imageUrl={string}
  portfolioCount={number}
  matchScore={number}
  onConnect={() => void}
  showAction={boolean}
/>
```

### SponsorCard Component
```typescript
<SponsorCard
  id={string}
  name={string}
  company={string}
  bio={string}
  sectors={string[]}
  logoUrl={string}
  website={string}
  talentCount={number}
  rating={number}
  showAction={boolean}
/>
```

---

## 🖼️ Unsplash Integration

### Image Utility Functions

```typescript
// Generate optimized Unsplash URL
getUnsplashUrl(photoId, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp',
  crop: 'faces'
})

// Get image by search query
getUnsplashQueryUrl('photography', 800, 600)

// Get random sector image
getRandomSectorImage('Photography')

// Get placeholder while loading
getPlaceholderImage('#e5e7eb')
```

### Sample Sector Images
```typescript
UNSPLASH_SAMPLES = {
  visualArts: [...],
  photography: [...],
  design: [...],
  music: [...],
  filmVideo: [...],
  fashion: [...],
  performance: [...],
  sports: [...],
  talent: [...],
  sponsor: [...]
}
```

---

## 🔐 Authentication Integration

### Using useAuth Hook
```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated && <p>Hello {user?.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎯 Yarn Commands

```bash
# Development
yarn dev              # Start dev server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint

# Database
yarn prisma:generate  # Generate Prisma client
yarn prisma:migrate   # Run migrations
yarn prisma:studio    # Open Prisma Studio UI
yarn prisma:seed      # Run seed script

# Other
yarn install          # Install dependencies
yarn upgrade          # Update dependencies
```

---

## 📐 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── talents/
│   │   ├── page.tsx         # Browse talents
│   │   └── [id]/page.tsx    # Talent profile
│   ├── sponsors/
│   │   ├── page.tsx         # Browse sponsors
│   │   └── [id]/page.tsx    # Sponsor profile
│   ├── about/page.tsx        # About page
│   ├── auth/                 # Auth pages
│   ├── dashboard/            # Dashboard pages
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # Base components
│   ├── Navigation.tsx        # Header
│   ├── Footer.tsx            # Footer
│   ├── TalentCard.tsx        # Talent display
│   └── SponsorCard.tsx       # Company display
├── lib/
│   ├── unsplash.ts          # Image utilities
│   ├── classification.ts    # AI classification
│   └── supabase/            # Supabase clients
├── hooks/
│   └── useAuth.ts           # Auth hook
└── types/
    └── index.ts             # TypeScript types
```

---

## 🧪 Testing Checklist

### Pages
- [ ] Landing page loads and renders correctly
- [ ] Navigation links work
- [ ] Footer displays on all pages
- [ ] Mobile menu works
- [ ] Talents page displays all 8 sample talents
- [ ] Sponsors page displays all 8 sample companies
- [ ] Search functionality works
- [ ] Sector filter works
- [ ] About page renders
- [ ] Individual profile pages load

### Components
- [ ] TalentCard displays correctly
- [ ] SponsorCard displays correctly
- [ ] Images load from Unsplash
- [ ] Hover effects work
- [ ] Responsive design (mobile, tablet, desktop)

### Authentication (after setup)
- [ ] Signup redirects to setup
- [ ] Login works
- [ ] Logout removes session
- [ ] Protected routes redirect to login

### API Endpoints
- [ ] `/api/health` - Health check
- [ ] `/api/media` - Media upload/retrieval
- [ ] `/api/recommendations` - Recommendations

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
yarn prisma:generate
yarn install
```

### Images not loading
- Check Supabase image optimization settings
- Verify image URLs in `.env.local`
- Check CORS settings for Unsplash domains

### Database connection issues
```bash
# Verify DATABASE_URL in .env.local
# Try reconnecting to Supabase
yarn prisma:migrate
```

### Yarn issues
```bash
# Clear cache
yarn cache clean

# Reinstall
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main  # Deploys automatically
```

### Docker
```bash
docker-compose up
```

### Manual Deploy
```bash
yarn build
yarn start  # Production server runs on port 3000
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📊 Sample Data

### Talents (8 total)
1. Sarah Anderson - Photography
2. Marcus Johnson - Design
3. Elena Rodriguez - Music
4. David Chen - Film & Video
5. Jessica Williams - Fashion
6. Alex Thompson - Visual Arts
7. Priya Patel - Performance & Theater
8. Chris Martin - Sports

### Sponsors (8 total)
1. Adobe Creative Studios - Design, Photography, Film
2. Netflix Productions - Film & Video, Visual Arts
3. Universal Music Group - Music, Performance
4. Vogue Fashion - Fashion, Photography, Design
5. Google Design - Design, Visual Arts
6. ESPN Sports Network - Sports, Film & Video
7. Sony Music Entertainment - Music, Film & Video
8. MoMA Contemporary Art - Visual Arts, Photography

---

## 🎓 Next Steps

1. **Setup Supabase**
   - Create PostgreSQL database
   - Configure Auth
   - Create Storage buckets (portfolio, avatars, logos)

2. **Test Features**
   - Run `yarn dev`
   - Test all pages
   - Test search/filter
   - Test authentication

3. **Configure Media Upload**
   - Setup Hugging Face API (optional)
   - Test media classification
   - Test recommendation generation

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Configure production environment variables

5. **Scale & Optimize**
   - Add real data
   - Setup analytics
   - Optimize images
   - Add caching
   - Setup CDN

---

## 💡 Tips

- **Images**: Unsplash provides free high-quality images. Customize sample image IDs for better sector-specific images
- **Data**: Replace sample data with real database queries for production
- **Performance**: Images are optimized with WebP format and responsive sizes
- **Accessibility**: All components follow WCAG guidelines
- **Responsive**: Design works perfectly on all screen sizes (mobile, tablet, desktop)

---

## 📞 Support

For issues or questions:
1. Check documentation files (README, DEVELOPMENT, DEPLOYMENT)
2. Review the sample components
3. Check Supabase documentation
4. Review Next.js documentation

---

**Ready to launch! Start with:** `yarn dev` 🚀
