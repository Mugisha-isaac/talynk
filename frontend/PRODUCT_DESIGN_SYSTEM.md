# Talynk: Premium AI-Powered Creator Discovery Platform
## Complete Product Design & Frontend Architecture

---

## TABLE OF CONTENTS
1. Design System
2. Color Palette & Theme
3. Typography System
4. Spacing & Layout Grid
5. Component Library
6. Page Architecture
7. User Flows
8. Folder Structure
9. Supabase Schema
10. API Architecture
11. Responsive Design Patterns
12. Animation Guidelines
13. Premium UI Patterns
14. Mobile Experience
15. Accessibility Guidelines

---

## 1. DESIGN SYSTEM FOUNDATION

### 1.1 Design Philosophy
- **Aesthetic**: Modern premium dark theme with African-inspired accents
- **Feel**: Spotify + TikTok + Behance meets Netflix SaaS
- **Approach**: Mobile-first, content-centric, AI-forward
- **Interaction**: Smooth, responsive, delightful
- **Accessibility**: WCAG AA compliant, keyboard navigable

### 1.2 Core Design Principles
1. **Creator-Centric**: Everything supports creator visibility and discovery
2. **Fair Visibility**: AI transparency in recommendations
3. **Performance**: Fast, responsive, no lag on content
4. **Engagement**: Addictive but healthy engagement patterns
5. **Simplicity**: Complex tech, simple UI
6. **Localization**: African context (Rwanda, East Africa focus)

---

## 2. COLOR PALETTE & THEME

### 2.1 Primary Colors (Premium Brand Colors)
```
PRIMARY_BLUE:     #3B82F6 (Interactive, CTAs, Primary actions)
PRIMARY_PURPLE:   #8B5CF6 (AI-related features, Premium elements)
ACCENT_GOLD:      #FCD34D (Achievements, Verified badges)
ACCENT_TEAL:      #14B8A6 (Trending, Hot content)
ACCENT_ORANGE:    #F97316 (Engagement, Activity)
```

### 2.2 Neutral Palette (Dark Theme Base)
```
BG_DARKEST:       #0F172A (Page background - almost black)
BG_DARK:          #1E293B (Card backgrounds)
BG_MEDIUM:        #334155 (Hover states, inputs)
BG_LIGHT:         #475569 (Secondary backgrounds)

TEXT_PRIMARY:     #F1F5F9 (Main text - off white)
TEXT_SECONDARY:   #CBD5E1 (Secondary text)
TEXT_TERTIARY:    #94A3B8 (Muted text)
TEXT_MUTED:       #64748B (Disabled, hints)

BORDER_LIGHT:     #475569 (Light borders)
BORDER_MEDIUM:    #334155 (Medium borders)
DIVIDER:          #1E293B (Subtle dividers)
```

### 2.3 Semantic Colors
```
SUCCESS:          #10B981 (Operations successful)
WARNING:          #F59E0B (Cautions)
ERROR:            #EF4444 (Errors, destructive)
INFO:             #3B82F6 (Informational)

GRADIENT_PRIMARY: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)
GRADIENT_ACCENT:  linear-gradient(135deg, #FCD34D 0%, #F97316 100%)
GRADIENT_COOL:    linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)
```

### 2.4 Glass Effects
```
GLASS_LIGHT:      rgba(255, 255, 255, 0.05)
GLASS_MEDIUM:     rgba(255, 255, 255, 0.1)
GLASS_STRONG:     rgba(255, 255, 255, 0.15)
BACKDROP_BLUR:    12px
```

### 2.5 Shadow System
```
SHADOW_SM:        0 1px 2px 0 rgba(0, 0, 0, 0.05)
SHADOW_BASE:      0 1px 3px 0 rgba(0, 0, 0, 0.1), 
                  0 1px 2px 0 rgba(0, 0, 0, 0.06)
SHADOW_MD:        0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                  0 2px 4px -1px rgba(0, 0, 0, 0.06)
SHADOW_LG:        0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                  0 4px 6px -2px rgba(0, 0, 0, 0.05)
SHADOW_XL:        0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04)

SHADOW_BLUE:      0 10px 25px -5px rgba(59, 130, 246, 0.2)
SHADOW_PURPLE:    0 10px 25px -5px rgba(139, 92, 246, 0.2)
SHADOW_GOLD:      0 10px 25px -5px rgba(252, 211, 77, 0.2)
```

---

## 3. TYPOGRAPHY SYSTEM

### 3.1 Font Stack
```css
/* Primary Font: Modern, Clean, Excellent readability */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display Font: Bold, Premium */
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;

/* Monospace: Code, metrics */
font-family: 'Fira Code', 'Roboto Mono', monospace;
```

### 3.2 Typography Scale
```
DISPLAY_2XL:  size: 60px, weight: 700, line-height: 1.2,  letter-spacing: -0.02em
DISPLAY_XL:   size: 48px, weight: 700, line-height: 1.25, letter-spacing: -0.02em
DISPLAY_LG:   size: 40px, weight: 700, line-height: 1.25, letter-spacing: -0.01em
DISPLAY_MD:   size: 36px, weight: 700, line-height: 1.25, letter-spacing: -0.01em

HEADING_1:    size: 32px, weight: 700, line-height: 1.3, letter-spacing: -0.01em
HEADING_2:    size: 28px, weight: 700, line-height: 1.3, letter-spacing: 0
HEADING_3:    size: 24px, weight: 600, line-height: 1.35, letter-spacing: 0
HEADING_4:    size: 20px, weight: 600, line-height: 1.4, letter-spacing: 0
HEADING_5:    size: 18px, weight: 600, line-height: 1.4, letter-spacing: 0

BODY_LG:      size: 18px, weight: 400, line-height: 1.6, letter-spacing: 0
BODY_BASE:    size: 16px, weight: 400, line-height: 1.6, letter-spacing: 0
BODY_SM:      size: 14px, weight: 400, line-height: 1.5, letter-spacing: 0
BODY_XS:      size: 12px, weight: 400, line-height: 1.5, letter-spacing: 0

LABEL_LG:     size: 14px, weight: 500, line-height: 1.5, letter-spacing: 0
LABEL_BASE:   size: 12px, weight: 500, line-height: 1.5, letter-spacing: 0.5px
LABEL_SM:     size: 11px, weight: 500, line-height: 1.4, letter-spacing: 0.5px

CAPTION:      size: 12px, weight: 400, line-height: 1.5, letter-spacing: 0
CAPTION_SM:   size: 10px, weight: 400, line-height: 1.4, letter-spacing: 0

MONO_BASE:    size: 14px, weight: 500, line-height: 1.6, letter-spacing: 0
MONO_SM:      size: 12px, weight: 500, line-height: 1.5, letter-spacing: 0
```

### 3.3 Font Weights Used
```
Light:      300
Regular:    400
Medium:     500
Semibold:   600
Bold:       700
ExtraBold:  800
```

---

## 4. SPACING & LAYOUT GRID

### 4.1 Spacing Scale (8px base unit)
```
0:    0px
1:    4px
2:    8px    (base unit)
3:    12px
4:    16px   (common padding)
5:    20px
6:    24px   (card padding, section spacing)
7:    28px
8:    32px   (section margins)
9:    36px
10:   40px
12:   48px   (large sections)
14:   56px
16:   64px   (hero sections)
20:   80px   (page sections)
24:   96px
```

### 4.2 Container Widths (Tailwind)
```
sm:  640px   (mobile tablet)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (ultra-wide)

Default Container: max-width: 1280px
Content Max-Width: max-width: 1024px
Narrow Container: max-width: 640px
```

### 4.3 Responsive Breakpoints
```
MOBILE:     0px    - 639px   (320, 375, 425)
TABLET:     640px  - 1023px  (768, 820, 1000)
DESKTOP:    1024px - 1535px  (1280, 1440)
ULTRA_HD:   1536px+          (1920, 2560)
```

### 4.4 Z-Index System
```
HIDE:             -1
BASE:             0
OVERLAY:          10
DROPDOWN:         50
STICKY:           100
MODAL_BACKDROP:   200
MODAL:            210
POPOVER:          300
TOOLTIP:          400
NOTIFICATION:     500
DEBUG:            999
```

---

## 5. COMPONENT LIBRARY

### 5.1 Core Components (shadcn/ui base)

#### Button Component
```tsx
// Variants: solid, outline, ghost, subtle
// Sizes: xs, sm, base, lg, xl
// States: default, hover, active, disabled, loading

export const BUTTON_STYLES = {
  // Solid Primary
  solid_primary: {
    base: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    disabled: 'bg-slate-400 text-slate-300 cursor-not-allowed'
  },
  // Solid Accent
  solid_accent: {
    base: 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/40',
    disabled: 'opacity-50 cursor-not-allowed'
  },
  // Outline
  outline: {
    base: 'border-2 border-slate-600 text-white hover:bg-slate-900 hover:border-slate-500',
    disabled: 'opacity-50 cursor-not-allowed'
  },
  // Ghost
  ghost: {
    base: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    disabled: 'opacity-50 cursor-not-allowed'
  }
}

// Sizes
xs: 'px-3 py-1.5 text-xs'
sm: 'px-4 py-2 text-sm'
base: 'px-6 py-3 text-base'
lg: 'px-8 py-4 text-lg'
xl: 'px-10 py-5 text-xl'
```

#### Card Component
```tsx
export const CARD_STYLES = {
  // Premium Glass Card
  premium: {
    base: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-md rounded-2xl',
    hover: 'hover:border-slate-600 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300'
  },
  // Standard Card
  standard: {
    base: 'bg-slate-800 border border-slate-700 rounded-xl',
    hover: 'hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300'
  },
  // Elevated Card
  elevated: {
    base: 'bg-slate-800 rounded-xl shadow-lg',
    hover: 'hover:shadow-xl hover:scale-105 transition-all duration-300'
  },
  // Gradient Card
  gradient: {
    base: 'bg-gradient-primary rounded-xl shadow-lg shadow-blue-500/20',
    hover: 'hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300'
  }
}
```

#### Input Component
```tsx
export const INPUT_STYLES = {
  base: 'bg-slate-800/50 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500',
  focus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-800',
  disabled: 'bg-slate-900 text-slate-600 cursor-not-allowed',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
}
```

#### Badge Component
```tsx
export const BADGE_STYLES = {
  primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  success: 'bg-green-500/20 text-green-300 border border-green-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  error: 'bg-red-500/20 text-red-300 border border-red-500/30',
  gold: 'bg-gold-500/20 text-gold-300 border border-gold-500/30',
  
  // Sizes
  sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
  base: 'px-3 py-1 text-sm font-medium rounded-full',
  lg: 'px-4 py-1.5 text-base font-medium rounded-lg'
}
```

#### Avatar Component
```tsx
export const AVATAR_STYLES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  base: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
  
  ring: 'ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900',
  verified: 'ring-2 ring-gold-500 ring-offset-2 ring-offset-slate-900'
}
```

#### Modal/Dialog
```tsx
export const MODAL_STYLES = {
  backdrop: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-200',
  modal: 'bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl',
  animation: 'scale-95 opacity-0 to scale-100 opacity-100 duration-300'
}
```

#### Skeleton Loader
```tsx
export const SKELETON_STYLES = {
  animate: 'animate-pulse',
  base: 'bg-slate-700/50',
  shimmer: 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-200% animate-shimmer'
}
```

### 5.2 Content Cards

#### Creator Card (Discovery Feed)
```tsx
interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    avatar: string;
    category: string;
    badge?: 'verified' | 'trending' | 'new';
    views: number;
    followers: number;
    aiScore: number;
  };
  onPlay?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

// Layout:
// ┌─────────────────────────────┐
// │    Media Thumbnail          │  (aspect-square, with play button)
// │    [AI Recommendation Tag]   │  (bottom-left corner)
// ├─────────────────────────────┤
// │ Creator Avatar | Name       │
// │              Category        │  (with badge if applicable)
// ├─────────────────────────────┤
// │ ⭐ 4.8 | 👁 12.5K | 📊 AI   │
// │ [Like] [Share] [More]       │
// └─────────────────────────────┘
```

#### Content Preview Card
```tsx
interface ContentCardProps {
  content: {
    id: string;
    title: string;
    thumbnail: string;
    creator: CreatorInfo;
    duration?: string;
    plays: number;
    likes: number;
    aiGenerated?: {
      tags: string[];
      caption: string;
      mood: string;
    };
  };
}

// Layout:
// ┌──────────────────────────────────┐
// │  Thumbnail [Duration]  [▶ Play]  │
// ├──────────────────────────────────┤
// │ Creator Avatar | Name            │
// │ Title                            │
// │ Tags: #tag1 #tag2 #tag3         │
// ├──────────────────────────────────┤
// │ 👁 1.2K | ❤ 234 | 💬 45        │
// └──────────────────────────────────┘
```

#### Stats Card
```tsx
// Minimal, premium stat display
// ┌──────────────┐
// │   Icon       │  (with color bg)
// │   12.5K      │  (large number)
// │   Followers  │  (label)
// └──────────────┘
```

#### Activity Feed Item
```tsx
// Timeline-style activity
// ┌─────────────────────────────────┐
// │ Avatar | Name                   │
// │        "followed you"  • 2h ago │
// │ [Follow Back]                   │
// └─────────────────────────────────┘
```

### 5.3 Navigation Components

#### Sidebar Navigation (Desktop)
```tsx
// Fixed, collapsible sidebar
// ┌─────────────────┐
// │ Logo            │ (sticky at top)
// ├─────────────────┤
// │ 🏠 Home         │
// │ 🔍 Explore      │
// │ 🎤 My Studio    │
// │ 📊 Analytics    │
// │ ⭐ Liked        │
// ├─────────────────┤
// │ 💬 Messages  (5)│
// │ 🔔 Activity  (3)│
// ├─────────────────┤
// │ Avatar | Profile│
// │ Settings        │
// │ Logout          │
// └─────────────────┘

const SIDEBAR_ITEMS = {
  main: [
    { icon: 'Home', label: 'Home', href: '/home' },
    { icon: 'Compass', label: 'Explore', href: '/explore' },
    { icon: 'Mic2', label: 'Studio', href: '/studio' },
    { icon: 'BarChart3', label: 'Analytics', href: '/analytics' },
    { icon: 'Heart', label: 'Liked', href: '/liked', badge: 'count' }
  ],
  secondary: [
    { icon: 'MessageCircle', label: 'Messages', href: '/messages', badge: 'unread' },
    { icon: 'Bell', label: 'Notifications', href: '/notifications', badge: 'unread' }
  ],
  user: [
    { icon: 'User', label: 'Profile', href: '/profile' },
    { icon: 'Settings', label: 'Settings', href: '/settings' },
    { icon: 'LogOut', label: 'Logout', action: 'logout' }
  ]
}
```

#### Bottom Navigation (Mobile)
```tsx
// Fixed bottom bar, 5 items max
// ┌───────────────────────────────────┐
// │ 🏠 🔍 ➕ 💬 👤                   │
// └───────────────────────────────────┘

const BOTTOM_NAV_ITEMS = [
  { icon: 'Home', href: '/home' },
  { icon: 'Compass', href: '/explore' },
  { icon: 'Plus', action: 'openUpload', primary: true },
  { icon: 'MessageCircle', href: '/messages', badge: true },
  { icon: 'User', href: '/profile' }
]
```

#### Floating Action Button (Upload)
```tsx
// Large circular FAB, bottom-right on desktop, fixed bottom-center on mobile
// ┌───────┐
// │  ➕   │  (animated, glowing effect)
// └───────┘

const FAB_STYLES = {
  desktop: 'fixed bottom-8 right-8 w-16 h-16 rounded-full',
  mobile: 'fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full',
  animation: 'hover:scale-110 active:scale-95 shadow-lg shadow-blue-500/40 hover:shadow-xl'
}
```

#### Tabs Component
```tsx
// Underline style
// ┌────────────┬────────────┬────────────┐
// │   Home    │  Trending  │   Saved    │
// │ ────────  │            │            │
// └────────────┴────────────┴────────────┘
```

### 5.4 Media Components

#### Video Player with Controls
```tsx
interface VideoPlayerProps {
  src: string;
  thumbnail: string;
  autoPlay?: boolean;
  controls: {
    play: boolean;
    volume: boolean;
    fullscreen: boolean;
    like: boolean;
    share: boolean;
    comment: boolean;
  };
}

// Layout (TikTok-style):
// ┌────────────────────────────────┐
// │                                │
// │      Video Content             │  (fullscreen on mobile)
// │                                │
// ├────────────────────────────────┤
// │ Play Controls | Volume | ⛶     │ (bottom bar on hover)
// ├────────────────────────────────┤
// │ Creator Name | Follow          │ (overlay on video)
// │ Video Title                    │
// │ #tag1 #tag2 #tag3            │
// └────────────────────────────────┘
// Side Controls on Mobile:
// ├─┤
// │❤│ Likes
// │💬│ Comments
// │↗│ Share
// │⋮│ More
// └─┘
```

#### Audio Player
```tsx
// Compact media player
// ┌─────────────────────────────────┐
// │ ▶ |━━━━●━━━ | 2:30 | 🔊 | ⛶   │
// │ Track Name - Artist             │
// └─────────────────────────────────┘
```

#### Image Gallery/Carousel
```tsx
// Grid gallery with lightbox
// ┌─────┬─────┬─────┐
// │ 1   │ 2   │ 3   │
// ├─────┼─────┼─────┤
// │ 4   │ 5   │ 6   │
// └─────┴─────┴─────┘

// Carousel: 
// [◀] [Image] [▶]
//     ⭕⭕⭕⭕⭕
```

---

## 6. PAGE ARCHITECTURE

### 6.1 Landing Page (Unauthenticated)
```tsx
Layout: Full-width, no sidebar

Sections:
1. Hero Section (60vh)
   - Animated background gradient
   - Headline: "Discover African Creativity"
   - Subheadline: "AI-powered platform for emerging creators"
   - CTA Buttons: "Explore Now" | "For Creators"
   - Video background loop (optional)

2. Featured Creators Section
   - Carousel/grid of trending creators
   - 4-6 premium creator cards
   - "View More" link

3. How It Works
   - 3-4 step timeline with icons
   - Step 1: Upload Your Talent
   - Step 2: AI Classification
   - Step 3: Smart Discovery
   - Step 4: Connect & Grow

4. Social Proof
   - Stats: 50K+ creators, 500K+ fans, 10M+ views
   - Testimonials from creators
   - Press logos/partnerships

5. Features Showcase
   - AI Recommendations
   - Fair Visibility Scoring
   - Creator Analytics
   - Community Support

6. CTA Footer
   - "Ready to showcase your talent?"
   - Large signup buttons
```

### 6.2 Authentication Pages

#### Sign Up / Login (Role Selection)
```tsx
Layout: Split screen or centered modal

Step 1: Role Selection
┌──────────────────────────────┐
│  What's your role?           │
├──────────────────────────────┤
│  [Creator] [Fan] [Scout]     │
│  [Organizer] [Brand]         │
└──────────────────────────────┘

Step 2: Sign Up Form
┌──────────────────────────────┐
│  Create Your Account         │
├──────────────────────────────┤
│  Email: ___________________  │
│  Password: ________________  │
│  Confirm: _________________  │
│  Terms & Privacy [ ]         │
├──────────────────────────────┤
│  [Sign Up] [or Sign with Google]
│  Already have account? Login │
└──────────────────────────────┘

Step 3: OAuth Options
│  Continue with:              │
│  [Google] [Apple] [Phone]    │
```

#### Creator Onboarding Flow
```tsx
Step 1: Profile Setup
│  Profile Photo (drag-drop)
│  Bio (160 char)
│  Display Name
│  [Continue]

Step 2: Category Selection
│  Select your creative field:
│  ☐ Music
│  ☐ Comedy
│  ☐ Dance
│  ☐ Visual Arts
│  ☐ Performance
│  ☐ Content Creation
│  ☐ Athletics
│  [Select up to 3]

Step 3: Social Links
│  Instagram: ______________
│  TikTok: _________________
│  YouTube: ________________
│  [Skip] [Continue]

Step 4: First Upload
│  "Let's upload your first piece"
│  [Drag media or Click to upload]
│  [Skip] [Upload]

Step 5: Preferences
│  Content visibility
│  Notification preferences
│  [Finish] [Complete Setup]
```

#### Audience Onboarding
```tsx
Step 1: Interests
│  What are you interested in?
│  ☐ Music
│  ☐ Comedy
│  ☐ Dance
│  [Select 3+]

Step 2: Discovery Preferences
│  How would you like to discover?
│  ✓ AI Recommendations
│  ☐ Trending Now
│  ☐ Nearby Creators
│  ☐ Following

Step 3: Notification Preferences
│  Get notified about:
│  ☐ New uploads from following
│  ☐ Trending content
│  [Done]
```

### 6.3 Home Feed (Authenticated Creator)
```tsx
Layout: Sidebar + Main content + Right panel (desktop)
        Bottom nav + Full-width feed (mobile)

┌─────────────────────────────────────────────────────┐
│ Sidebar | ┌──────────────────┐ | AI Insights Panel │
│         | │  Feed Tabs:      │ |                   │
│         | │ For You | Recent │ | Your Stats:       │
│         | │                  │ | ✓ Views: 12.5K    │
│         | ├──────────────────┤ | ✓ Followers: 1.2K │
│         | │                  │ | ✓ Engagement: 8%  │
│         | │  Creator Card 1  │ | ✓ AI Score: 8.5   │
│         | │  (with actions)  │ |                   │
│         | │                  │ | Trending Now:     │
│         | ├──────────────────┤ | #Afrobeats        │
│         | │                  │ | #DanceChallenge   │
│         | │  Creator Card 2  │ | #ComedyTime       │
│         | │                  │ |                   │
│         | ├──────────────────┤ | Suggested:        │
│         | │   Load More      │ | [Creator Card] x3 │
│         | └──────────────────┘ |                   │
└─────────────────────────────────────────────────────┘

Feed Tabs:
- For You: AI-powered personalized recommendations
- Recent: Latest uploads from following
- Trending: Trending creators/content
- Nearby: Creators from your region
- Categories: Browse by category
```

### 6.4 Explore/Discovery Page
```tsx
Layout: Sidebar + Full-width grid + Filters

Header:
┌─────────────────────────────┐
│ 🔍 Search creators...       │ (search bar with autocomplete)
├─────────────────────────────┤
│ Filter: ▼ | Sort: ▼ | View: ▼ │
│ Category: [Buttons/Dropdown]│
└─────────────────────────────┘

Grid:
┌────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ (responsive: 1 on mobile, 2 on tablet, 4 on desktop)
├────┼────┼────┼────┤
│ 5  │ 6  │ 7  │ 8  │
├────┼────┼────┼────┤
│ 9  │ 10 │ 11 │ 12 │
└────┴────┴────┴────┘

Sections:
1. Search Bar + Filters
2. Top Categories (tabs)
3. Creator Grid (infinite scroll)
4. Suggested Creators (sidebar)
```

### 6.5 Creator Profile Page
```tsx
Layout: Full-width with sidebar

Header Section:
┌─────────────────────────────────────────────────────┐
│ Cover Image (1200x400 or full-width video bg)      │
├─────────────────────────────────────────────────────┤
│  Avatar        │ Display Name                       │
│                │ @username • Category               │
│  [Premium]     │ Bio line up to 160 characters      │
│                │ 📍 Location | 🔗 Links             │
│                │                                   │
│ [Follow] [Message] [Share] [⋮]                      │
├─────────────────────────────────────────────────────┤
│ 12.5K Followers | 234 Following | 456 Likes        │
├─────────────────────────────────────────────────────┤
│ Tabs: Portfolio | Stats | Reviews | (Verified)    │
└─────────────────────────────────────────────────────┘

Content Section (below tabs):
Portfolio Tab:
┌────┬────┬────┐
│ 1  │ 2  │ 3  │ (gallery grid)
├────┼────┼────┤
│ 4  │ 5  │ 6  │
└────┴────┴────┘

Stats Tab:
┌──────────────┬──────────────┬──────────────┐
│ Views: 12.5K │ Likes: 1.2K  │ Share: 234   │
├──────────────┼──────────────┼──────────────┤
│ Engagement   │ Growth       │ AI Score     │
│ Chart        │ Chart        │ 8.5/10       │
└──────────────┴──────────────┴──────────────┘
```

### 6.6 Upload Studio / Content Management
```tsx
Layout: Sidebar + Two-column (upload form + preview/settings)

Left Column (Form):
┌──────────────────────────────┐
│ Upload Your Content          │
├──────────────────────────────┤
│ [Drag files or click]        │
│ Supported: MP4, MP3, JPG,   │
│ PNG, GIF (Max 500MB)        │
│                              │
│ Title: __________________    │
│ Description: ___________    │
│ (160 chars)                 │
│                              │
│ Category:                    │
│ [Dropdown v]                │
│                              │
│ Content Warnings:           │
│ ☐ Explicit                 │
│ ☐ Violence                 │
│ ☐ Sensitive                │
│                              │
│ Visibility:                 │
│ ○ Public  ○ Followers Only │
│ ○ Private                  │
│                              │
│ AI Features:                │
│ ☑ Auto-generate tags       │
│ ☑ Auto-generate captions   │
│ ☑ Analyze mood             │
│                              │
│ [Draft] [Publish] [Schedule]│
└──────────────────────────────┘

Right Column (Preview):
┌──────────────────────────────┐
│ Preview                      │
├──────────────────────────────┤
│ [Media Thumbnail]            │
│                              │
│ Title Preview                │
│ Description Preview          │
│ #tag1 #tag2 #tag3          │
│                              │
│ 👁 0 | ❤ 0 | 💬 0         │
│                              │
│ AI Analysis:                │
│ • Tags: #music #afrobeat   │
│ • Mood: Energetic          │
│ • Duration: 2:30           │
│ • Size: 45MB               │
└──────────────────────────────┘
```

### 6.7 Analytics Dashboard
```tsx
Layout: Sidebar + Dashboard grid

KPIs (Top Row):
┌──────────┬──────────┬──────────┬──────────┐
│ Views    │ Likes    │ Followers│ Share    │
│ 12.5K    │ 1.2K     │ 456      │ 234      │
│ ↑ 12%    │ ↑ 8%     │ ↑ 3%     │ ↑ 5%     │
└──────────┴──────────┴──────────┴──────────┘

Charts (Middle):
┌─────────────────────────┬─────────────────────┐
│ Views Over Time         │ Engagement Sources  │
│ (Line Chart)            │ (Pie Chart)         │
├─────────────────────────┼─────────────────────┤
│ Top Content             │ Audience            │
│ (Table)                 │ Demographics        │
│                         │ (Age/Gender/Location)
└─────────────────────────┴─────────────────────┘

Bottom (Insights):
┌─────────────────────────┬─────────────────────┐
│ AI Recommendations      │ Growth Tips         │
│ • Your score: 8.5       │ • Post more videos  │
│ • Trending: +2 points   │ • Engage with fans  │
│ • Timing matters: +1.5  │ • Use trending tags │
└─────────────────────────┴─────────────────────┘
```

### 6.8 Messages Page
```tsx
Layout: Sidebar + Two-column (conversations | chat)

Left Column (Conversations List):
┌──────────────────────────────┐
│ 🔍 Search conversations      │
├──────────────────────────────┤
│ Avatar | Name                │
│        "Hey, are you..."  🔴 │ (unread indicator)
│        2 min ago             │
├──────────────────────────────┤
│ Avatar | Name                │
│        "Thanks!"             │
│        1h ago                │
├──────────────────────────────┤
│ Avatar | Name                │
│        "Interested in..."    │
│        Yesterday             │
└──────────────────────────────┘

Right Column (Chat):
┌──────────────────────────────┐
│ Avatar | Name | Call | Info  │
├──────────────────────────────┤
│                              │
│ [Their Message] → Left       │
│              ← Right [Your Message] │
│                              │
├──────────────────────────────┤
│ [Attach] 💬 _____________   │
│          [Send] [Emoji]      │
└──────────────────────────────┘
```

### 6.9 Notifications Page
```tsx
Layout: Sidebar + Notification list

Filters: All | Mentions | Likes | Comments | Followers

┌──────────────────────────────┐
│ Avatar | Name followed you   │
│        [Follow Back] • 2h ago│
├──────────────────────────────┤
│ Avatar | Name liked your...  │
│        [View] • 1h ago       │
├──────────────────────────────┤
│ Avatar | Name commented:     │
│        "Great work!" • 30m   │
│        [Reply] [View Post]   │
├──────────────────────────────┤
│ Bell  | New follower!        │
│        • Just now             │
└──────────────────────────────┘
```

### 6.10 Settings Page
```tsx
Layout: Sidebar + Settings panels

Tabs: Account | Privacy | Notifications | Preferences | Billing

Account Tab:
┌──────────────────────────────┐
│ Profile Information          │
│ Email: user@example.com      │
│ Phone: +250...              │
│ [Edit] [Change]              │
│                              │
│ Password                     │
│ [Change Password]            │
│                              │
│ Two-Factor Auth              │
│ ☑ Enabled                   │
│ [Manage]                     │
│                              │
│ Sessions                     │
│ This device • 2h ago         │
│ [Sign Out All]               │
│                              │
│ Danger Zone                  │
│ [Deactivate Account]         │
│ [Delete Account]             │
└──────────────────────────────┘

Privacy Tab:
│ Profile Visibility
│ ○ Public  ○ Followers Only  ○ Private
│
│ Who can message me?
│ ○ Everyone  ○ Following  ○ Nobody
│
│ Who can see my analytics?
│ ○ Only me  ○ Team members
│
│ Data & Privacy
│ ☐ Allow personalized recommendations
│ ☐ Use AI analysis on my content
│ [Download my data] [Delete my data]

Notifications Tab:
│ ☑ Email on new followers
│ ☑ Email on likes/comments
│ ☑ Email on messages
│ ☑ Email on trending notifications
│ [Manage email frequency]
│
│ Push Notifications
│ ☑ All notifications
│ ☑ Only important
│ ☑ Only messages
```

### 6.11 Admin Dashboard (Moderation)
```tsx
Layout: Sidebar + Main content

KPIs:
┌──────────┬──────────┬──────────┬──────────┐
│ Reports  │ Pending  │ Resolved │ Users    │
│ 124      │ 23       │ 101      │ 54.2K    │
└──────────┴──────────┴──────────┴──────────┘

Tabs: Reports | Content Review | Users | AI Logs

Reports Tab:
┌────────────────────────────────────────┐
│ ID | Type | Reported | Status | Action │
├────────────────────────────────────────┤
│ 123 | Content | 2h ago | Pending | ▼  │
│ 122 | User   | 4h ago | Resolved|    │
│ 121 | Comment| 6h ago | Pending | ▼  │
└────────────────────────────────────────┘

Content Review:
│ Media preview
│ Reporter comment
│ [Approve] [Remove] [Ban User] [Need More Info]
```

---

## 7. USER FLOWS

### 7.1 Creator Discovery Flow
```
┌─────────────┐
│  Open App   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  View Home Feed │ (AI-personalized recommendations)
└──────┬──────────┘
       │
       ├─→ [Scroll] → More creators
       │
       ├─→ [Like] → Creator saved
       │
       ├─→ [Tap Creator] → Profile page
       │                    │
       │                    ├─→ [Follow] → Creator followed
       │                    │
       │                    ├─→ [Message] → Start DM
       │                    │
       │                    └─→ [Share] → Share profile
       │
       ├─→ [Search] → Search page
       │               │
       │               ├─→ [Category Filter]
       │               ├─→ [Sort: Trending]
       │               └─→ [Result] → Creator profile
       │
       └─→ [Explore] → Discovery page
                        │
                        ├─→ [Category] → Category page
                        ├─→ [Trending] → Trending page
                        └─→ [Search] → Global search
```

### 7.2 Creator Content Upload Flow
```
┌─────────────┐
│  Creator    │
│  Opens App  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ [+ Upload Button]   │
│ Opens Studio        │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Select/Drag Content  │ (video/audio/image)
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ AI Analysis Running  │ (tags, captions, mood)
│ [Processing...]     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Edit Content Details         │
│ • Title                      │
│ • Description                │
│ • Category                   │
│ • AI Tags (editable)        │
│ • AI Captions (editable)    │
│ • Visibility                 │
└──────┬───────────────────────┘
       │
       ├─→ [Preview] → View how it looks
       │
       ├─→ [Draft] → Save as draft
       │
       ├─→ [Schedule] → Choose publish time
       │
       └─→ [Publish]
               │
               ▼
          ┌──────────────────┐
          │ Content Published│
          │ [View Analytics] │
          │ [Share]          │
          └──────────────────┘
```

### 7.3 Fan Engagement Flow
```
┌─────────────┐
│ Fan Views   │
│ Home Feed   │
└──────┬──────┘
       │
       ├─→ [Like] → ❤ Count increases
       │            Recommendation refined
       │
       ├─→ [Comment]
       │   │
       │   ├─→ Read comments
       │   └─→ Reply to creator
       │
       ├─→ [Share]
       │   ├─→ Share to WhatsApp
       │   ├─→ Share to Instagram Story
       │   └─→ Copy link
       │
       ├─→ [Follow Creator]
       │   └─→ Creator notified
       │       Added to Following tab
       │
       └─→ [Visit Profile]
           │
           ├─→ [Browse Portfolio]
           ├─→ [View Stats]
           ├─→ [Read Bio]
           ├─→ [Message]
           ├─→ [Share Profile]
           └─→ [Report]
```

### 7.4 AI Recommendation Flow (Internal)
```
┌──────────────────────┐
│ Fan Opens App        │
└──────┬───────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ AI Recommendation Engine           │
│ Analyzes:                          │
│ • Previous likes/views             │
│ • Search history                   │
│ • Category interests               │
│ • Engagement patterns              │
│ • Geographic location              │
│ • Time of day                      │
│ • Device type                      │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Score Creators Based On:           │
│ • Content quality (AI analysis)    │
│ • Audience match score             │
│ • Growth trajectory                │
│ • Fair visibility algorithm        │
│ • Creator AI score (8.5/10)        │
│ • Engagement quality               │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Rank & Order Results               │
│ Priority:                          │
│ 1. New talent (discovery)          │
│ 2. High-quality match              │
│ 3. Trending content                │
│ 4. Already following               │
│ 5. Collaborative creators          │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Present Feed to Fan                │
│ With explanations:                 │
│ "Because you liked..."             │
│ "Trending in Music"                │
│ "From nearby creators"             │
│ "New to Talynk"              │
└──────────────────────────────────┘
```

---

## 8. FOLDER STRUCTURE

```
capstone/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   └── og-image.jpg
│   ├── icons/
│   │   ├── social/
│   │   ├── categories/
│   │   └── interactive/
│   └── placeholders/
│       ├── avatar-placeholder.png
│       ├── media-placeholder.png
│       └── cover-placeholder.jpg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with providers
│   │   ├── page.tsx                      # Landing page
│   │   ├── globals.css                   # Global styles
│   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── RoleSelection.tsx
│   │   │   │       ├── SignUpForm.tsx
│   │   │   │       └── OAuthButtons.tsx
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       └── LoginForm.tsx
│   │   │   └── onboarding/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           ├── CreatorOnboarding.tsx
│   │   │           ├── AudienceOnboarding.tsx
│   │   │           └── PreferencesStep.tsx
│   │   │
│   │   ├── (authenticated)/
│   │   │   ├── layout.tsx                 # Main layout with sidebar
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── components/
│   │   │   │       ├── FeedTabs.tsx
│   │   │   │       ├── CreatorCard.tsx
│   │   │   │       ├── InfiniteScroll.tsx
│   │   │   │       ├── RightPanel.tsx
│   │   │   │       └── AIInsights.tsx
│   │   │   │
│   │   │   ├── explore/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── SearchBar.tsx
│   │   │   │       ├── FilterPanel.tsx
│   │   │   │       ├── CreatorGrid.tsx
│   │   │   │       └── SuggestedSidebar.tsx
│   │   │   │
│   │   │   ├── studio/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── components/
│   │   │   │       ├── UploadForm.tsx
│   │   │   │       ├── MediaUploader.tsx
│   │   │   │       ├── PreviewPane.tsx
│   │   │   │       ├── AIAnalysisPanel.tsx
│   │   │   │       └── PublishOptions.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── ProfileHeader.tsx
│   │   │   │       ├── ProfileTabs.tsx
│   │   │   │       ├── PortfolioGrid.tsx
│   │   │   │       ├── StatsPanel.tsx
│   │   │   │       └── ActionButtons.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── KPICards.tsx
│   │   │   │       ├── ViewsChart.tsx
│   │   │   │       ├── EngagementChart.tsx
│   │   │   │       ├── DemographicsChart.tsx
│   │   │   │       ├── TopContentTable.tsx
│   │   │   │       └── AIInsightsCard.tsx
│   │   │   │
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── ConversationsList.tsx
│   │   │   │       ├── ChatWindow.tsx
│   │   │   │       ├── MessageInput.tsx
│   │   │   │       └── ChatBubble.tsx
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── NotificationList.tsx
│   │   │   │       ├── NotificationItem.tsx
│   │   │   │       └── FilterTabs.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── SettingsTabs.tsx
│   │   │   │       ├── AccountSettings.tsx
│   │   │   │       ├── PrivacySettings.tsx
│   │   │   │       ├── NotificationSettings.tsx
│   │   │   │       ├── PreferencesSettings.tsx
│   │   │   │       └── BillingSettings.tsx
│   │   │   │
│   │   │   ├── liked/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── LikedGrid.tsx
│   │   │   │       └── EmptyState.tsx
│   │   │   │
│   │   │   ├── following/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── FollowingList.tsx
│   │   │   │       └── CreatorItem.tsx
│   │   │   │
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       ├── creators/
│   │   │       ├── content/
│   │   │       ├── recommendations/
│   │   │       ├── analytics/
│   │   │       └── messages/
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   ├── moderation/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   └── users/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signup/
│   │       │   ├── login/
│   │       │   └── logout/
│   │       ├── creators/
│   │       │   ├── [id]/
│   │       │   ├── search/
│   │       │   └── trending/
│   │       ├── content/
│   │       │   ├── upload/
│   │       │   ├── [id]/
│   │       │   └── ai-analysis/
│   │       ├── recommendations/
│   │       │   └── personalized/
│   │       ├── analytics/
│   │       ├── messages/
│   │       └── admin/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ToastNotification.tsx
│   │   │
│   │   ├── media/
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── MediaUploadArea.tsx
│   │   │   └── MediaPreview.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── FormField.tsx
│   │   │   ├── FormError.tsx
│   │   │   ├── FormGroup.tsx
│   │   │   └── FormSubmitButton.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── CreatorCard.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   └── TrendingCard.tsx
│   │   │
│   │   ├── modals/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ShareModal.tsx
│   │   │   ├── ReportModal.tsx
│   │   │   ├── ProfileModal.tsx
│   │   │   └── SettingsModal.tsx
│   │   │
│   │   ├── dialogs/
│   │   │   ├── SignInDialog.tsx
│   │   │   ├── CreatorSelectDialog.tsx
│   │   │   └── UploadProgressDialog.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── AreaChart.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── AIRecommendationTag.tsx
│   │   │   ├── AIInsightsPanel.tsx
│   │   │   ├── AIAnalysisResult.tsx
│   │   │   └── FairnessScore.tsx
│   │   │
│   │   ├── social/
│   │   │   ├── LikeButton.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── SocialBar.tsx
│   │   │
│   │   ├── infinite-scroll/
│   │   │   ├── InfiniteScroll.tsx
│   │   │   ├── useInfiniteScroll.ts
│   │   │   └── LoadingTrigger.tsx
│   │   │
│   │   └── ui/
│   │       ├── Badge/
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── Dialog/
│   │       ├── Dropdown/
│   │       ├── Tabs/
│   │       ├── Tooltip/
│   │       ├── Progress/
│   │       ├── Skeleton/
│   │       └── Toast/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useRecommendations.ts
│   │   ├── useAnalytics.ts
│   │   ├── useMessages.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useMediaUpload.ts
│   │   ├── useNotifications.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useDarkMode.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── ai-recommendations.ts
│   │   ├── fairness-scoring.ts
│   │   └── analytics.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── creator.ts
│   │   ├── content.ts
│   │   ├── recommendation.ts
│   │   ├── analytics.ts
│   │   ├── message.ts
│   │   └── api.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── UserContext.tsx
│   │
│   ├── styles/
│   │   ├── design-system.css
│   │   ├── animations.css
│   │   ├── responsive.css
│   │   └── utilities.css
│   │
│   ├── utils/
│   │   ├── classnames.ts
│   │   ├── date-formatter.ts
│   │   ├── number-formatter.ts
│   │   ├── file-validator.ts
│   │   └── image-optimizer.ts
│   │
│   └── config/
│       ├── site.ts
│       ├── nav.ts
│       └── categories.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
├── .env.local
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## 9. SUPABASE SCHEMA

### 9.1 Core Tables

```sql
-- Users (base user info)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  bio TEXT(500),
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  role ENUM('creator', 'audience', 'scout', 'organizer', 'brand'),
  verification_status ENUM('unverified', 'pending', 'verified'),
  is_active BOOLEAN DEFAULT TRUE
);

-- Creator Profiles
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL, -- ['music', 'comedy', 'dance', ...]
  bio_extended TEXT(2000),
  social_links JSONB, -- {instagram: '...', tiktok: '...', ...}
  portfolio_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  ai_visibility_score DECIMAL(3, 2) DEFAULT 5.0, -- 0-10
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge_type ENUM('none', 'verified', 'trusted', 'gold'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content/Media
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content_type ENUM('video', 'audio', 'image', 'gallery'),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size_mb DECIMAL(10, 2),
  categories TEXT[],
  tags TEXT[] DEFAULT '{}', -- AI-generated or user-added
  ai_generated_caption TEXT,
  ai_detected_mood VARCHAR(50),
  visibility ENUM('public', 'followers_only', 'private') DEFAULT 'public',
  content_warnings TEXT[],
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(5, 2) DEFAULT 0,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT(500) NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('like', 'comment', 'follow', 'message', 'mention', 'system'),
  actor_id UUID REFERENCES users(id),
  content_id UUID REFERENCES content(id),
  title VARCHAR(200),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics (aggregated data)
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creator_profiles(id),
  date DATE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  followers_gained INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  content_published INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Recommendations (cache)
CREATE TABLE recommendations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommended_creator_id UUID REFERENCES creator_profiles(id),
  recommendation_reason VARCHAR(255),
  ai_score DECIMAL(5, 2),
  position_in_feed INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES content(id),
  report_type ENUM('spam', 'inappropriate', 'harassing', 'copyright', 'other'),
  description TEXT,
  status ENUM('pending', 'investigating', 'resolved', 'dismissed'),
  moderator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Logs
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100),
  target_type VARCHAR(50), -- user, content, comment, etc
  target_id UUID,
  change_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9.2 Key Indexes

```sql
-- Performance indexes
CREATE INDEX idx_creators_category ON creator_profiles USING GIN (categories);
CREATE INDEX idx_content_creator ON content(creator_id);
CREATE INDEX idx_content_created ON content(created_at DESC);
CREATE INDEX idx_likes_user_content ON likes(user_id, content_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_messages_users ON messages(sender_id, recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_analytics_creator_date ON analytics_daily(creator_id, date DESC);
```

---

## 10. API ARCHITECTURE

### 10.1 REST API Endpoints

```
AUTH
POST   /api/auth/signup          - Create account
POST   /api/auth/login           - Login with credentials
POST   /api/auth/oauth           - OAuth callback
POST   /api/auth/logout          - Logout
POST   /api/auth/refresh         - Refresh token
POST   /api/auth/password-reset  - Reset password

USERS
GET    /api/users/me             - Get current user
GET    /api/users/:id            - Get user profile
PUT    /api/users/:id            - Update user
GET    /api/users/:id/followers  - Get followers list
GET    /api/users/:id/following  - Get following list

CREATORS
GET    /api/creators             - List creators (with filters)
GET    /api/creators/:id         - Get creator profile
GET    /api/creators/:id/content - Get creator's content
GET    /api/creators/trending    - Get trending creators
GET    /api/creators/search      - Search creators
POST   /api/creators/:id/follow  - Follow creator
DELETE /api/creators/:id/follow  - Unfollow creator

CONTENT
GET    /api/content              - Get content feed
GET    /api/content/:id          - Get content details
POST   /api/content              - Upload content
PUT    /api/content/:id          - Update content
DELETE /api/content/:id          - Delete content
POST   /api/content/:id/like     - Like content
DELETE /api/content/:id/like     - Unlike content
GET    /api/content/:id/comments - Get comments
POST   /api/content/:id/comments - Add comment
GET    /api/content/:id/ai-analysis - Get AI analysis

RECOMMENDATIONS
GET    /api/recommendations/personalized - Get AI recommendations
GET    /api/recommendations/trending     - Get trending content
GET    /api/recommendations/nearby       - Get nearby creators
GET    /api/recommendations/suggestions  - Get suggestions for you

ANALYTICS
GET    /api/analytics/dashboard    - Get dashboard data
GET    /api/analytics/views        - Get views data
GET    /api/analytics/engagement   - Get engagement data
GET    /api/analytics/audience     - Get audience data
GET    /api/analytics/trending     - Get trending analysis

MESSAGES
GET    /api/messages               - Get conversations
GET    /api/messages/:id           - Get conversation detail
POST   /api/messages/:id           - Send message
PUT    /api/messages/:id/read      - Mark as read

NOTIFICATIONS
GET    /api/notifications          - Get notifications
PUT    /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id      - Delete notification

ADMIN
GET    /api/admin/reports          - Get reports
PUT    /api/admin/reports/:id      - Update report status
GET    /api/admin/users            - Get users list
POST   /api/admin/users/:id/ban    - Ban user
GET    /api/admin/content-review   - Get content for review
POST   /api/admin/content/:id      - Moderate content
```

### 10.2 Response Format

```typescript
// Success Response
{
  success: true,
  status: 200,
  data: {...},
  message: "Operation successful",
  timestamp: "2024-05-09T12:30:45Z"
}

// Paginated Response
{
  success: true,
  status: 200,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8,
    hasMore: true
  },
  timestamp: "2024-05-09T12:30:45Z"
}

// Error Response
{
  success: false,
  status: 400,
  error: {
    code: "INVALID_INPUT",
    message: "Validation failed",
    details: [
      { field: "email", message: "Invalid email format" }
    ]
  },
  timestamp: "2024-05-09T12:30:45Z"
}
```

---

## 11. RESPONSIVE DESIGN PATTERNS

### 11.1 Grid System

```css
/* Mobile-First Responsive Grid */

/* Default: Mobile 320px+ */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet 640px+ */
@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop 1024px+ */
@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* Large Desktop 1280px+ */
@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
```

### 11.2 Layout Patterns

```
MOBILE (320-639px)
┌─────────────────┐
│    Content      │ (full-width)
│                 │
└─────────────────┘
│  Bottom Nav     │ (fixed)
└─────────────────┘

TABLET (640-1023px)
┌─────────────────────────┐
│      Content            │ (full-width)
│                         │
│                         │
└─────────────────────────┘
│    Bottom Nav           │ (fixed)
└─────────────────────────┘

DESKTOP (1024px+)
┌─────────┬──────────────────────────────┐
│ Sidebar │        Content               │
│  (240   │    (Main feed area)          │
│  px)    │                              │
│         │                              │
│         │                              │
├─────────┼──────────────────────────────┤
└─────────┴──────────────────────────────┘

LARGE DESKTOP (1536px+)
┌─────────┬──────────────────────────────┬──────────┐
│ Sidebar │        Content               │ Right    │
│ (240px) │    (Main feed area)          │ Panel    │
│         │                              │ (280px)  │
│         │                              │          │
│         │                              │          │
└─────────┴──────────────────────────────┴──────────┘
```

### 11.3 Navigation Responsive Pattern

```
MOBILE:
- Bottom navigation (5 items)
- Hamburger menu for secondary nav
- Floating action button for primary CTA

TABLET:
- Collapsible sidebar with bottom nav
- Top bar for secondary nav
- Floating action button

DESKTOP:
- Fixed sidebar (240px wide)
- Top bar
- Optional right panel
- Floating action button (optional)

LARGE DESKTOP:
- Fixed sidebar (240px wide)
- Top bar
- Right panel (insights/suggestions)
- Floating action button
```

---

## 12. ANIMATION GUIDELINES

### 12.1 Motion Design Principles

```css
/* Duration Standards */
--duration-instant: 100ms;  /* Immediate feedback (150ms for complex)*/
--duration-short:   200ms;  /* Quick transitions */
--duration-base:    300ms;  /* Standard animations */
--duration-long:    500ms;  /* Complex animations */
--duration-xl:      800ms;  /* Page transitions */

/* Easing Functions */
--ease-linear:      linear;
--ease-in:          cubic-bezier(0.4, 0, 1, 1);
--ease-out:         cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth:      cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### 12.2 Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer (loading)*/
@keyframes shimmer {
  0% {
    background-position: -1200px 0;
  }
  100% {
    background-position: calc(1200px + 100%) 0;
  }
}

/* Glow Pulse (AI features) */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 12.3 Component-Level Animations

```tsx
/* Button Hover Animation */
.button {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.button:active {
  transform: translateY(0);
}

/* Card Hover Animation */
.card {
  transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Feed Item Load */
.feed-item {
  animation: slideUp 400ms ease-out;
}

/* Like Button Click */
@keyframes likePress {
  0% { scale: 1; }
  50% { scale: 1.1; }
  100% { scale: 1; }
}
.like-button.active {
  animation: likePress 300ms ease-out;
}

/* Page Transition */
.page-enter {
  animation: fadeIn 300ms ease-out;
}
.page-exit {
  animation: fadeOut 200ms ease-in;
}
```

---

## 13. PREMIUM UI PATTERNS

### 13.1 Glassmorphism Cards

```tsx
const GlassCard = () => (
  <div className="
    bg-gradient-to-br from-slate-800/50 to-slate-900/50
    border border-slate-700/50
    backdrop-blur-md
    rounded-2xl
    shadow-lg
    hover:border-slate-600
    hover:shadow-xl hover:shadow-blue-500/10
    transition-all duration-300
  ">
    {/* Content */}
  </div>
);
```

### 13.2 Gradient Text

```tsx
const GradientText = () => (
  <h1 className="
    bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
    bg-clip-text text-transparent
    animate-pulse
  ">
    Discover African Creativity
  </h1>
);
```

### 13.3 Floating Elements

```tsx
const FloatingElement = () => (
  <div className="
    fixed bottom-8 right-8
    w-16 h-16 rounded-full
    bg-gradient-primary
    shadow-lg shadow-blue-500/40
    hover:shadow-xl hover:shadow-blue-500/60
    hover:scale-110
    transition-all duration-300
    animate-pulse
  ">
    {/* Content */}
  </div>
);
```

### 13.4 Verified Badge System

```tsx
const VerifiedBadge = ({ type }) => {
  const badges = {
    verified: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      icon: '✓',
      color: 'text-blue-300'
    },
    trusted: {
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/50',
      icon: '★',
      color: 'text-purple-300'
    },
    gold: {
      bg: 'bg-gold-500/20',
      border: 'border-gold-500/50',
      icon: '♔',
      color: 'text-gold-300'
    }
  };
  
  const badge = badges[type];
  return (
    <div className={`
      ${badge.bg}
      border ${badge.border}
      rounded-full
      px-2 py-1
      flex items-center gap-1
      ${badge.color}
      text-xs font-bold
    `}>
      {badge.icon}
      {type}
    </div>
  );
};
```

### 13.5 Content Cards with Overlay

```tsx
const ContentCardPremium = ({ content }) => (
  <div className="group relative overflow-hidden rounded-2xl">
    {/* Background Image */}
    <img src={content.thumbnail} className="w-full h-full object-cover" />
    
    {/* Overlay */}
    <div className="
      absolute inset-0
      bg-gradient-to-t from-slate-950 via-transparent to-transparent
      opacity-0 group-hover:opacity-100
      transition-all duration-300
    " />
    
    {/* Content Overlay */}
    <div className="
      absolute inset-0
      flex flex-col justify-between p-6
      translate-y-4 group-hover:translate-y-0
      opacity-0 group-hover:opacity-100
      transition-all duration-300
    ">
      <div className="flex justify-between items-start">
        <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold">
          AI Recommended
        </span>
        <button className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40">
          ❤
        </button>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{content.title}</h3>
        <p className="text-sm text-slate-300">{content.creator}</p>
      </div>
    </div>
  </div>
);
```

---

## 14. MOBILE EXPERIENCE

### 14.1 Mobile-First Design Strategy

1. **Bottom Navigation**: 5 key items fixed at bottom
2. **Full-Width Content**: No wasted space on mobile
3. **Large Touch Targets**: Minimum 44x44px
4. **Minimalist UI**: Hide non-essential UI on mobile
5. **Thumb Zone**: Interactive elements in reachable zones
6. **Progressive Disclosure**: Hide advanced options
7. **Mobile Optimized Media**: Efficient loading

### 14.2 Mobile Navigation Pattern

```
BOTTOM NAV (Mobile):
┌────────────────────────────────┐
│    Content Area (full width)   │
│                                │
│                                │
│                                │
│                                │
│ Inset from bottom by nav       │
└────────────────────────────────┘
┌─┬──────────────────────────────┬─┐
│🏠│  ⭐  ➕  💬  👤  │ Safe area
└─┴──────────────────────────────┴─┘
```

### 14.3 Mobile Interactions

```
TAP:
- 200ms-300ms feedback
- Scale or color change
- Haptic feedback if available

SWIPE:
- Horizontal: Navigate between tabs
- Vertical: Dismiss modals
- Pull-to-refresh on feeds

LONG PRESS:
- Open context menu
- Start drag operation

DOUBLE TAP:
- Like content
- Full-screen media
```

---

## 15. ACCESSIBILITY GUIDELINES

### 15.1 Color Contrast

```
WCAG AA Compliance (minimum):
- Normal text: 4.5:1
- Large text (18px+): 3:1
- Interactive elements: 3:1

Text on Colors:
- White (#F1F5F9) on Primary Blue (#3B82F6): ✓ 6.5:1
- Black on Gold (#FCD34D): ✓ 5.2:1
- Slate-300 (#CBD5E1) on Dark BG: ✓ 7.1:1
```

### 15.2 ARIA & Semantic HTML

```tsx
{/* Use semantic HTML */}
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home" aria-current="page">Home</a></li>
  </ul>
</nav>

{/* Form Labels */}
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />

{/* Buttons */}
<button aria-label="Like this content">❤</button>

{/* Icon Buttons */}
<button aria-label="Open menu">⋮</button>

{/* Loading States */}
<div role="status" aria-live="polite">
  Loading content...
</div>
```

### 15.3 Keyboard Navigation

```
TAB:        Navigate through elements
SHIFT+TAB:  Navigate backwards
ENTER:      Activate buttons/links
SPACE:      Toggle checkboxes
ARROW KEYS: Navigate lists/carousels
ESC:        Close modals/dialogs
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Design system CSS
- [ ] Base components library
- [ ] Layout system
- [ ] Authentication UI

### Phase 2: Core Features (Week 3-4)
- [ ] Home feed
- [ ] Creator profiles
- [ ] Content cards
- [ ] Navigation

### Phase 3: Discovery (Week 5-6)
- [ ] Explore page
- [ ] Search & filters
- [ ] Recommendations engine UI
- [ ] Trending page

### Phase 4: Creator Tools (Week 7-8)
- [ ] Upload studio
- [ ] Analytics dashboard
- [ ] Content management

### Phase 5: Social & Engagement (Week 9-10)
- [ ] Messages
- [ ] Notifications
- [ ] Comments
- [ ] Sharing system

### Phase 6: Polish (Week 11-12)
- [ ] Animations
- [ ] Responsive refinement
- [ ] Performance optimization
- [ ] Accessibility audit

---

## COLOR PALETTE SUMMARY

```
PRIMARY:      #3B82F6 (Blue)
ACCENT_1:     #8B5CF6 (Purple)
ACCENT_2:     #14B8A6 (Teal)
ACCENT_3:     #F97316 (Orange)
ACCENT_GOLD:  #FCD34D

BACKGROUNDS:
Dark:         #0F172A
Card:         #1E293B
Hover:        #334155
Light:        #475569

TEXT:
Primary:      #F1F5F9
Secondary:    #CBD5E1
Tertiary:     #94A3B8
Muted:        #64748B
```

---

**This design system provides everything needed to build a world-class, modern AI-powered creator discovery platform that feels premium, responsive, and delightful on all devices.**
