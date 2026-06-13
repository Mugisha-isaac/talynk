# 🖼️ Image Integration Strategy - Talynk Platform

**Date:** May 13, 2026  
**Source:** Unsplash (Free High-Quality Images)  
**Next.js Image Optimization:** ✅ Enabled

---

## 📸 Image Categories & Curated Photo IDs

### 1. Performance & Talent Categories

**Music & Audio**
- Background: `1470225620905` (Music producer)
- Category Hero: `1506157786151` (DJ with equipment)
- Alternative: `1511379938547` (Sound equipment)

**Visual Arts & Design**
- Background: `1535016120894` (Artist at work)
- Category Hero: `1561070791-2526d30994b5` (Designer)
- Alternative: `1547471080-7cc2d3c3f9c0` (Painting)

**Dance & Performance**
- Background: `1516738901601` (Dancer in motion)
- Category Hero: `1495379957154` (Performance stage)
- Alternative: `1492684223066` (Theatrical performance)

**Sports & Fitness**
- Background: `1517836357207` (Athlete)
- Category Hero: `1461896836934` (Sports action)
- Alternative: `1552674605-5dca6dd5e07d` (Fitness training)

**Comedy & Entertainment**
- Background: `1495521821757` (Comedian on stage)
- Category Hero: `1514525253161` (Stage spotlight)
- Alternative: `1540575467063` (Performance energy)

**Fashion & Style**
- Background: `1595938894655` (Fashion model)
- Category Hero: `1509631179647` (Fashion design)
- Alternative: `1544967497-c4d5a8d7e6f` (Style showcase)

**Photography & Video**
- Background: `1484807550052` (Photographer)
- Category Hero: `1502920917128` (Camera equipment)
- Alternative: `1612198188060` (Video production)

**Content Creation**
- Background: `1491462853556` (Content creator setup)
- Category Hero: `1516738901601` (Creator workspace)
- Alternative: `1552664730-d307ca884978` (Studio setup)

### 2. Profile & Avatar Images

**Talent Profiles**
- Avatar default: `1494790108377` (Professional headshot)
- Background: `1507003211169` (Modern professional)
- Gallery: `1438761681033` (Creative workspace)

**Sponsor/Brand Profiles**
- Avatar default: `1552664730-d307ca884978` (Corporate)
- Background: `1454165804606` (Business environment)
- Gallery: `1516534775068` (Collaboration)

**Fan/Viewer Profiles**
- Avatar default: `150784272-200` (User profile)
- Background: `1489749798305` (Community)

### 3. Landing Page & Marketing

**Hero Section**
- Main: `1517694712202` (Creative inspiration)
- Overlay: `1486312338219` (Collaboration)
- Mobile: `1552664730-d307ca884978` (Professional)

**Feature Sections**
- For Talents: `1516738901601` (Creator journey)
- For Sponsors: `1552664730-d307ca884978` (Business growth)
- Discovery: `1498050108023` (Exploration)

### 4. Content & Media Thumbnails

**Default Media Covers**
- Music: `1470225620905` (Audio visual)
- Video: `1506157786151` (Production)
- Photo: `1484807550052` (Photography)
- Art: `1535016120894` (Artwork)

### 5. Empty States & Placeholders

- No Results: `1516738901601` (Inspirational)
- Loading: `1559592413-cd4628902c4` (Abstract)
- Error: `1500516185335` (Calm)

---

## 🎨 Image Usage by Page

### Public Pages

| Page | Hero Image | Category | Width x Height | Use Case |
|------|-----------|----------|---|----------|
| `/` Landing | `1517694712202` | Inspiration | 1600x900 | Page background |
| `/about` | `1498050108023` | Discovery | 1400x600 | Section background |
| `/talents` | `1494790108377` | Gallery | Responsive | Avatar defaults |
| `/sponsors` | `1552664730-d307ca884978` | Corporate | Responsive | Avatar defaults |
| `/explore` | Dynamic | Category | 600x400 | Category cards |
| `/search` | `1516738901601` | Inspiration | 1200x500 | Empty state |
| `/trending` | `1498050108023` | Popular | Responsive | Trending items |
| `/sitemap` | `1498050108023` | Navigation | 1200x600 | Section hero |

### Dashboard Pages

| Page | Hero Image | Category | Use Case |
|------|-----------|----------|----------|
| `/home` | Dynamic | Feed | Recommendation cards |
| `/studio` | `1491462853556` | Creator | Upload area background |
| `/profile` | User Avatar | Profile | Profile header |
| `/dashboard/talent` | `1516738901601` | Creator Tools | Section heroes |
| `/dashboard/sponsor` | `1552664730-d307ca884978` | Business | Section heroes |

---

## 🔧 Implementation Examples

### Hero Section with Unsplash
```tsx
import { getUnsplashUrl } from '@/lib/unsplash';

export default function HeroSection() {
  const heroUrl = getUnsplashUrl('1517694712202', {
    width: 1600,
    height: 900,
    crop: 'entropy',
  });

  return (
    <div 
      className="relative w-full h-96 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold">Discover Talent</h1>
      </div>
    </div>
  );
}
```

### Category Card with Image
```tsx
import { getUnsplashUrl } from '@/lib/unsplash';

interface CategoryCardProps {
  title: string;
  photoId: string;
}

export function CategoryCard({ title, photoId }: CategoryCardProps) {
  const imageUrl = getUnsplashUrl(photoId, {
    width: 600,
    height: 400,
    crop: 'entropy',
  });

  return (
    <div className="relative rounded-lg overflow-hidden group">
      <img 
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end">
        <h3 className="text-white text-2xl font-bold p-4">{title}</h3>
      </div>
    </div>
  );
}
```

### Profile Avatar
```tsx
import { getUnsplashUrl } from '@/lib/unsplash';

interface ProfileAvatarProps {
  name: string;
  role: 'talent' | 'sponsor';
}

export function ProfileAvatar({ name, role }: ProfileAvatarProps) {
  const photoId = role === 'talent' 
    ? '1494790108377' 
    : '1552664730-d307ca884978';
    
  const avatarUrl = getUnsplashUrl(photoId, {
    width: 200,
    height: 200,
    crop: 'faces',
  });

  return (
    <img
      src={avatarUrl}
      alt={name}
      className="w-32 h-32 rounded-full object-cover border-4 border-accent"
    />
  );
}
```

---

## 📋 Implementation Checklist

### Phase 1: Core Images (Landing & Auth)
- [ ] Landing page hero image
- [ ] About page background
- [ ] Auth pages (login/signup) styling
- [ ] 404/error page imagery

### Phase 2: Discovery Section
- [ ] Category page heroes (Music, Dance, Art, etc.)
- [ ] Explore page category cards
- [ ] Search empty state
- [ ] Trending section images

### Phase 3: Profile & Talent Pages
- [ ] Talent avatar defaults
- [ ] Sponsor avatar defaults
- [ ] Profile background images
- [ ] Talent/Sponsor detail pages

### Phase 4: Dashboard
- [ ] Dashboard home feed images
- [ ] Studio upload section
- [ ] Creator tools imagery
- [ ] Sponsor dashboard imagery

### Phase 5: Media & Content
- [ ] Media thumbnail defaults
- [ ] Content preview images
- [ ] Gallery backgrounds
- [ ] Loading placeholders

---

## 🎯 Best Practices

### Image Optimization
✅ Always use `getUnsplashUrl()` function  
✅ Specify width and height for performance  
✅ Use appropriate crop mode (entropy, faces)  
✅ Use webp format (auto-converted by Unsplash)  
✅ Lazy load images when possible  

### Responsive Sizes
- Mobile: 400-600px width
- Tablet: 800-1000px width
- Desktop: 1200-1600px width
- Hero: 1600x900 desktop, 800x600 mobile

### Alt Text
- Always provide descriptive alt text
- Use dynamic alt text with content title
- Improves accessibility and SEO

### Performance
- Use Next.js Image component when possible
- Implement image lazy loading
- Specify srcSet for responsive images
- Use CDN (Unsplash auto-CDN optimized)

---

## 🔗 Unsplash Photo IDs Reference

### Ready-to-Use Curated IDs
```json
{
  "music": ["1470225620905", "1506157786151", "1511379938547"],
  "dance": ["1516738901601", "1495379957154", "1492684223066"],
  "art": ["1535016120894", "1561070791-2526d30994b5"],
  "sports": ["1517836357207", "1461896836934", "1552674605-5dca6dd5e07d"],
  "fashion": ["1595938894655", "1509631179647"],
  "photography": ["1484807550052", "1502920917128", "1612198188060"],
  "comedy": ["1495521821757", "1514525253161", "1540575467063"],
  "creation": ["1491462853556", "1516738901601", "1552664730-d307ca884978"],
  "landing": ["1517694712202", "1486312338219", "1498050108023"],
  "profiles": ["1494790108377", "1507003211169", "1552664730-d307ca884978"]
}
```

---

## 📚 Additional Resources

- **Unsplash API:** https://unsplash.com/developers
- **Search by Keyword:** https://source.unsplash.com/
- **Direct Image URL:** `https://images.unsplash.com/photo-{ID}?params`
- **Collections:** Explore category-specific collections on Unsplash

---

## ✅ Image Integration Status

- **Phase 1:** Core images ready
- **Phase 2:** Discovery images prepared
- **Phase 3:** Profile images optimized
- **Phase 4:** Dashboard images pending
- **Phase 5:** Content images pending

**Overall Progress:** 40% Complete  
**Next Step:** Implement Phase 1 across landing, auth, and core pages

