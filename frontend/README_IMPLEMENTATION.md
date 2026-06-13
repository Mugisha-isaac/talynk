# 🎵 TALYNK - AI-Powered Talent Discovery Platform

## Overview

**Talynk** is a premium, AI-powered talent discovery and showcase platform for emerging African creators (musicians, comedians, dancers, athletes, visual artists, performers, content creators). The platform helps creators get discovered fairly through intelligent AI matching and personalized recommendations while maintaining fair visibility scoring.

**Mission**: Connect talent with opportunity through intelligent AI matching and equitable visibility.

---

## 🎯 Platform Features

### Core Features

#### 🔐 Authentication & Onboarding
- Email/password and OAuth authentication (Google, GitHub)
- Role-based signup (Creator, Scout/Sponsor, Fan)
- Customized onboarding flows per role
- Profile setup and verification badges

#### 🏠 Home Feed & Discovery
- Personalized AI-powered recommendations
- Infinite scroll discovery feed
- Trending section with trend indicators
- Smart filtering and categorization
- Search with AI-powered suggestions

#### 👤 Creator Profiles
- Professional portfolio galleries
- Multiple media types (video, audio, images)
- Social media integration
- Follower/following system
- Engagement metrics and analytics
- AI Visibility Score with explanation
- Verification badges and achievements
- Booking/contact functionality

#### 📤 Content System
- Drag-and-drop media uploads
- AI-generated tags and captions
- Multi-format support (video, audio, image, documents)
- Content performance analytics
- Sharing and discovery tools

#### 🤖 AI Features
- **Smart Recommendations**: Match creators with scouts/audiences based on talent, category, location, engagement
- **AI Tagging & Captioning**: Automatic tag and caption generation for uploaded content
- **Visibility Scoring**: Fair, transparent scoring system explaining why creators are visible
- **Trending Prediction**: Identify emerging talent before it goes mainstream
- **Content Classification**: ML-powered content categorization

#### 📊 Analytics Dashboard
For creators:
- Real-time view, engagement, and follower metrics
- Growth analytics and trending insights
- Audience demographics and location data
- Top-performing content analysis
- AI visibility score explanation and optimization tips
- Daily/weekly/monthly performance breakdowns

#### 💬 Social Features
- Follow/unfollow system
- Like, comment, share, save functionality
- Direct messaging and conversations
- Notification system with real-time updates
- Activity feed

#### ⚙️ User Settings & Privacy
- Profile customization
- Privacy controls (public/followers-only/private)
- Notification preferences
- Account security
- Content moderation preferences

#### 🛡️ Admin & Moderation
- Moderation dashboard
- Report management system
- Content review tools
- User management
- Featured creator management
- Analytics on platform health

---

## 🏗️ Project Structure

```
talynk/
├── prisma/                          # Database schema
│   ├── schema.prisma               # Full data models
│   └── seed.ts                      # Database seeding
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                 # Auth pages (public)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── onboarding/
│   │   │
│   │   ├── (dashboard)/            # Protected creator dashboard
│   │   │   ├── home/              # Personalized feed
│   │   │   ├── studio/            # Upload & management
│   │   │   ├── analytics/         # Dashboard & analytics
│   │   │   ├── messages/          # Messaging
│   │   │   ├── notifications/     # Notifications
│   │   │   └── settings/          # Profile settings
│   │   │
│   │   ├── (discovery)/           # Public discovery pages
│   │   │   ├── explore/           # Browse all creators
│   │   │   ├── search/            # Search & filters
│   │   │   ├── trending/          # Trending creators
│   │   │   └── [category]/        # Category pages
│   │   │
│   │   ├── (public)/              # Public pages
│   │   │   ├── profile/[id]/      # Creator public profile
│   │   │   └── gallery/[talentId]/ # Creator gallery
│   │   │
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Auth endpoints
│   │   │   ├── users/             # User endpoints
│   │   │   ├── media/             # Media endpoints
│   │   │   ├── recommendations/   # Recommendation engine
│   │   │   ├── analytics/         # Analytics endpoints
│   │   │   ├── search/            # Search endpoints
│   │   │   └── ai/                # AI service endpoints
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home/landing page
│   │   └── globals.css            # Global styles
│   │
│   ├── components/                  # React components
│   │   ├── layout/
│   │   │   ├── Navigation.tsx      # Top navigation
│   │   │   ├── Sidebar.tsx         # Desktop sidebar (if used)
│   │   │   ├── BottomNav.tsx       # Mobile bottom nav
│   │   │   ├── MainLayout.tsx      # Main wrapper
│   │   │   ├── DashboardLayout.tsx # Dashboard wrapper
│   │   │   └── PageHeader.tsx      # Page headers
│   │   │
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (shadcn imports)
│   │   │
│   │   ├── auth/                  # Auth-specific components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── RoleSelector.tsx
│   │   │
│   │   ├── media/                 # Media components
│   │   │   ├── MediaCard.tsx
│   │   │   ├── MediaGrid.tsx
│   │   │   ├── MediaPlayer.tsx
│   │   │   ├── UploadDropZone.tsx
│   │   │   └── MediaUploadDialog.tsx
│   │   │
│   │   ├── discovery/             # Discovery components
│   │   │   ├── FeedCard.tsx
│   │   │   ├── TrendingCard.tsx
│   │   │   ├── CreatorCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterPanel.tsx
│   │   │
│   │   ├── profile/               # Profile components
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileStats.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── ProfilePortfolio.tsx
│   │   │
│   │   ├── dashboard/             # Dashboard components
│   │   │   ├── StatCard.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   ├── EngagementStats.tsx
│   │   │   └── TopContent.tsx
│   │   │
│   │   └── common/                # Common components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Skeleton.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/                       # React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useUser.ts              # User data hook
│   │   ├── useMedia.ts             # Media management
│   │   ├── useRecommendations.ts   # Recommendations
│   │   ├── useAnalytics.ts         # Analytics data
│   │   └── usePagination.ts        # Pagination logic
│   │
│   ├── lib/                         # Utilities & libraries
│   │   ├── prisma.ts               # Prisma client
│   │   ├── supabase.ts             # Supabase client
│   │   ├── api.ts                  # API client
│   │   ├── ai-service.ts           # AI/ML service integration
│   │   ├── utils.ts                # General utilities
│   │   ├── constants.ts            # App constants
│   │   └── validators.ts           # Form validators
│   │
│   ├── types/                       # TypeScript types
│   │   └── index.ts                # All type definitions
│   │
│   ├── styles/                      # Stylesheets
│   │   ├── globals.css             # Global styles
│   │   ├── design-system.css       # Design system & variables
│   │   ├── animations.css          # Animations & transitions
│   │   └── glassmorphism.css       # Glass effect styles
│   │
│   └── utils/                       # Utilities
│       ├── helpers.ts              # Helper functions
│       ├── formatters.ts           # Format utilities
│       ├── validators.ts           # Validation functions
│       └── constants.ts            # Constants
│
├── public/                          # Static assets
├── .env.local                       # Environment variables (git ignored)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts              # Tailwind config
├── next.config.js                  # Next.js config
└── TALYNK_COMPLETE_ARCHITECTURE.md # Architecture documentation
```

---

## 🎨 Design System

### Color Palette (Dark Theme)
- **Primary Blue**: #3B82F6 (main CTA, highlights)
- **Purple Accent**: #A78BFA (creative, premium feel)
- **Background**: #0F1419 (darkest)
- **Surface**: #1A1F2E (cards, elevated)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #94A3B8
- **Accent Colors**: Rose (#EC4899), Gold (#FBBF24), Success (#10B981), Error (#EF4444)

### Typography
- **Font**: Geist (system-ui fallback)
- **Heading XL**: 56px, 700 weight
- **Heading LG**: 44px, 700 weight
- **Body Regular**: 16px, 400 weight
- **Caption**: 12px, 500 weight, uppercase

### Spacing
- **Base Unit**: 4px
- Scales: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), 2xl (32px), 3xl (48px), 4xl (64px)

### Components
- **Border Radius**: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), full (9999px)
- **Shadows**: xs through xl levels for elevation
- **Animations**: 250ms base duration, spring easing for premium feel

---

## 📊 Database Schema

### Core Models
- **User** - Authentication & profile
- **UserFollow** - Social following system
- **Talent** - Creator profiles
- **Sponsor** - Scout/brand profiles
- **Media** - User-uploaded content
- **Sector** - Categories/talents
- **Engagement** - Likes, comments, shares, saves
- **Recommendation** - AI matching results
- **AIVisibilityScore** - Fair visibility metric
- **Analytics** - Daily performance metrics
- **Notification** - User notifications
- **Message & Conversation** - Direct messaging
- **Report** - Content moderation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL or compatible database
- Supabase account (for auth and file storage)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/talynk.git
cd talynk
```

2. **Install dependencies**
```bash
yarn install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

4. **Setup database**
```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
```

5. **Run development server**
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to start developing.

---

## 🔌 API Architecture

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/session` - Get current session

### User Endpoints
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update profile
- `GET /api/users/[id]/followers` - List followers
- `POST /api/users/[id]/follow` - Follow user
- `DELETE /api/users/[id]/follow` - Unfollow user

### Media Endpoints
- `POST /api/media/upload` - Upload media
- `GET /api/media/[id]` - Get media details
- `DELETE /api/media/[id]` - Delete media
- `POST /api/media/[id]/engage` - Like/comment/share/save

### Discovery Endpoints
- `GET /api/recommendations` - Get personalized feed
- `GET /api/search?q=...&category=...` - Search creators
- `GET /api/trending` - Get trending creators

### Analytics Endpoints
- `GET /api/analytics/talent/[id]` - Get creator analytics
- `GET /api/analytics/talent/[id]/daily` - Daily breakdown

---

## 🤖 AI & ML Features

### Implemented
1. **Content Classification** - Automatic media categorization
2. **Tag Generation** - AI-generated tags from visual/audio content
3. **Caption Suggestions** - Smart caption generation

### To Implement
1. **Recommendation Engine** - Collaborative filtering + content-based matching
2. **Visibility Scoring** - ML model scoring creator visibility fairness
3. **Trending Prediction** - Time-series prediction of emerging talent
4. **Engagement Prediction** - Predict content performance

**Recommended**: Integrate TensorFlow.js, Azure ML, or AWS SageMaker

---

## 📱 Responsive Behavior

### Breakpoints
- **Mobile**: < 640px (single column, bottom nav)
- **Tablet**: 640px - 1024px (2 columns, flexible)
- **Desktop**: > 1024px (3-4 columns, top nav + sidebar optional)

### Mobile-First Approach
- Bottom navigation for main actions
- Full-width cards with padding
- Vertical scrolling feeds
- Floating upload button
- Sheet/drawer menus

---

## ✨ Premium Features & Interactions

### Animations
- **Page Transitions**: Fade + slide up
- **Card Hover**: Lift effect + shadow increase
- **Like Animation**: Heart beat bounce
- **Load State**: Skeleton pulse animation
- **Staggered Lists**: Sequential fade-in

### UI Elements Inspired By
- **Spotify**: Personalized recommendations, follow/playlist concept
- **TikTok**: Infinite vertical feed, quick interactions
- **Behance**: Portfolio showcases, professional design
- **Netflix**: Carousel rows, preview on hover
- **Dribbble**: Beautiful card designs, engagement animations

### Glassmorphism
- Backdrop blur + semi-transparent backgrounds
- Used on modals, overlays, and premium cards
- Premium dark theme with vibrant accents

---

## 🔒 Security & Best Practices

- ✅ JWT token authentication
- ✅ CORS properly configured
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS prevention (React escaping)
- ✅ CSRF tokens for forms
- ✅ Rate limiting on sensitive endpoints
- ✅ Environment variables for secrets
- ✅ HTTPS only in production
- ✅ Content Security Policy headers
- ✅ Regular security audits

---

## 🧪 Testing

```bash
# Run tests
yarn test

# Run with coverage
yarn test:coverage

# E2E tests
yarn test:e2e
```

---

## 📈 Performance Optimization

- Image optimization with WebP + responsive srcsets
- Route-based code splitting
- Component lazy loading
- Browser caching strategy
- SWR for API data caching
- Redis for recommendation caching
- Core Web Vitals monitoring

---

## 🚢 Deployment

### Vercel (Recommended for Next.js)
```bash
vercel deploy
```

### Docker
```bash
docker build -t talynk .
docker run -p 3000:3000 talynk
```

### Environment Setup
Set environment variables in your hosting platform's dashboard

---

## 📝 Documentation

- **[TALYNK_COMPLETE_ARCHITECTURE.md](./TALYNK_COMPLETE_ARCHITECTURE.md)** - Full architecture & design system
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation
- **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - Component library guide

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

---

## 👥 Authors & Credits

Built with ❤️ for African creators by [Your Name/Team]

---

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@talynk.io
- Join our Discord community: [Link]

---

## 🎯 Roadmap

### Phase 1 (MVP - Current)
- Core authentication and profiles
- Basic media upload and storage
- Simple recommendation feed
- Creator discovery

### Phase 2 (Engagement)
- Follow/unfollow system
- Advanced engagement (likes, comments, shares)
- Direct messaging
- Notifications

### Phase 3 (AI & Discovery)
- Advanced recommendation engine
- AI visibility scoring
- Trending prediction
- Smart search

### Phase 4 (Premium & Growth)
- Monetization features
- Admin dashboard
- Advanced analytics
- Creator tools

---

**Let's build something amazing! 🚀**
