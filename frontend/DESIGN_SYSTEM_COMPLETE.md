# Talynk: Complete Design System & Frontend Architecture

## Executive Summary
Talynk is a premium AI-powered creator discovery platform combining the best aspects of Spotify, TikTok, Behance, and Netflix. This document defines the complete design system, component architecture, and frontend structure for a world-class creator platform.

---

## TABLE OF CONTENTS
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Hierarchy](#component-hierarchy)
6. [Page Architecture](#page-architecture)
7. [Animation Guidelines](#animation-guidelines)
8. [Responsive Patterns](#responsive-patterns)
9. [Premium UI Patterns](#premium-ui-patterns)
10. [Folder Structure](#folder-structure)
11. [Naming Conventions](#naming-conventions)

---

## Design Philosophy

### Core Principles
1. **Creator-Centric**: Every pixel serves creator visibility
2. **Fair Visibility**: AI transparency in recommendations
3. **Performance**: Fast, responsive, no lag
4. **Engagement**: Addictive but healthy patterns
5. **Simplicity**: Complex tech, simple UI
6. **Localization**: African context (Rwanda, East Africa)
7. **Accessibility**: WCAG AA+ compliant

### Aesthetic
- Modern premium dark theme
- Elegant gradients and glass effects
- Soft shadows and smooth transitions
- Large, expressive rounded cards
- Strong visual hierarchy
- Minimal but visually rich
- AI-inspired futuristic elements

---

## Color System

### Primary Brand Colors
```
PRIMARY_BLUE:       #3B82F6  - Interactive, CTAs, Primary actions
PRIMARY_PURPLE:     #8B5CF6  - AI features, Premium elements
ACCENT_GOLD:        #FCD34D  - Achievements, Verified badges
ACCENT_TEAL:        #14B8A6  - Trending, Hot content
ACCENT_ORANGE:      #F97316  - Engagement, Activity
ACCENT_ROSE:        #EC4899  - Highlights, Attention
```

### Neutral Palette (Dark Theme)
```
BG_DARKEST:         #0F172A  - Page background (almost black)
BG_DARK:            #1E293B  - Card backgrounds
BG_MEDIUM:          #334155  - Hover states, inputs
BG_LIGHT:           #475569  - Secondary backgrounds

TEXT_PRIMARY:       #F1F5F9  - Main text (off white)
TEXT_SECONDARY:     #CBD5E1  - Secondary text
TEXT_TERTIARY:      #94A3B8  - Muted text
TEXT_MUTED:         #64748B  - Disabled, hints

BORDER_LIGHT:       #475569  - Light borders
BORDER_MEDIUM:      #334155  - Medium borders
DIVIDER:            #1E293B  - Subtle dividers
```

### Semantic Colors
```
SUCCESS:            #10B981  - Operations successful, positive
WARNING:            #F59E0B  - Cautions, warnings
ERROR:              #EF4444  - Errors, destructive actions
INFO:               #0EA5E9  - Informational
```

### Gradients (Premium Effects)
```
GRADIENT_PRIMARY:    linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)
GRADIENT_ACCENT:     linear-gradient(135deg, #FCD34D 0%, #F97316 100%)
GRADIENT_COOL:       linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)
GRADIENT_WARM:       linear-gradient(135deg, #EC4899 0%, #F97316 100%)
GRADIENT_SUBTLE:     linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)
```

### Glass Effects
```
GLASS_LIGHT:        rgba(255, 255, 255, 0.05)
GLASS_MEDIUM:       rgba(255, 255, 255, 0.1)
GLASS_STRONG:       rgba(255, 255, 255, 0.15)
BACKDROP_BLUR:      12px
BORDER_GLASS:       1px solid rgba(255, 255, 255, 0.1)
```

### Shadow System
```
SHADOW_NONE:        0 0 0 rgba(0, 0, 0, 0)
SHADOW_SM:          0 1px 2px 0 rgba(0, 0, 0, 0.05)
SHADOW_BASE:        0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
SHADOW_MD:          0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
SHADOW_LG:          0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
SHADOW_XL:          0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
SHADOW_GLOW:        0 0 20px rgba(59, 130, 246, 0.2)
SHADOW_GLOW_PURPLE: 0 0 20px rgba(139, 92, 246, 0.2)
```

---

## Typography

### Font System
```
FONT_FAMILY_PRIMARY: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
FONT_FAMILY_MONO:    'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Courier, monospace

FONT_WEIGHTS:
  Thin:       100
  ExtraLight: 200
  Light:      300
  Normal:     400
  Medium:     500
  SemiBold:   600
  Bold:       700
  ExtraBold:  800
  Black:      900
```

### Text Styles

#### Display Styles (Hero & Page Headers)
```
DISPLAY_LARGE:
  Size:       48px
  LineHeight: 56px
  Weight:     700
  Letter:     -0.5px
  Usage:      Landing page hero, main dashboard title

DISPLAY_MEDIUM:
  Size:       40px
  LineHeight: 48px
  Weight:     700
  Letter:     -0.3px
  Usage:      Section headers, modal titles

DISPLAY_SMALL:
  Size:       32px
  LineHeight: 40px
  Weight:     700
  Letter:     0px
  Usage:      Page titles, major headings
```

#### Heading Styles
```
HEADING_1:
  Size:       28px
  LineHeight: 36px
  Weight:     700
  Usage:      Page sections, major headings

HEADING_2:
  Size:       24px
  LineHeight: 32px
  Weight:     700
  Usage:      Subsections, card titles

HEADING_3:
  Size:       20px
  LineHeight: 28px
  Weight:     600
  Usage:      Card headers, highlights

HEADING_4:
  Size:       18px
  LineHeight: 26px
  Weight:     600
  Usage:      Component headers
```

#### Body Styles
```
BODY_LARGE:
  Size:       16px
  LineHeight: 24px
  Weight:     400
  Usage:      Main content, descriptions

BODY_BASE:
  Size:       14px
  LineHeight: 22px
  Weight:     400
  Usage:      Secondary content, labels

BODY_SMALL:
  Size:       12px
  LineHeight: 18px
  Weight:     400
  Usage:      Tertiary info, hints

BODY_TINY:
  Size:       11px
  LineHeight: 16px
  Weight:     400
  Usage:      Timestamps, metadata
```

#### Label & Meta Styles
```
LABEL_MEDIUM:
  Size:       12px
  LineHeight: 16px
  Weight:     600
  Letter:     0.5px
  Usage:      Form labels, badges, tags

LABEL_SMALL:
  Size:       11px
  LineHeight: 14px
  Weight:     600
  Letter:     0.4px
  Usage:      Micro labels

CAPTION:
  Size:       12px
  LineHeight: 18px
  Weight:     400
  Letter:     0px
  Usage:      Captions, helper text
```

---

## Spacing & Layout

### Spacing Scale (Tailwind)
```
4px:   Space-1     (tight spacing)
8px:   Space-2     (comfortable)
12px:  Space-3     (normal)
16px:  Space-4     (generous)
20px:  Space-5     (relaxed)
24px:  Space-6     (spacious)
32px:  Space-8     (very spacious)
40px:  Space-10    (extra spacious)
48px:  Space-12    (major spacing)
64px:  Space-16    (section spacing)
```

### Layout Grid
```
CONTAINER_SM:      640px   (max-width for small screens)
CONTAINER_MD:      768px   (tablets)
CONTAINER_LG:      1024px  (small desktops)
CONTAINER_XL:      1280px  (desktops)
CONTAINER_2XL:     1536px  (large screens)

GUTTER:            16px    (content padding)
GAP_HORIZONTAL:    16px    (card horizontal spacing)
GAP_VERTICAL:      24px    (card vertical spacing)
```

### Component Dimensions
```
BORDER_RADIUS_NONE:      0px
BORDER_RADIUS_SM:        4px  (inputs, small elements)
BORDER_RADIUS_MD:        8px  (standard components)
BORDER_RADIUS_LG:        12px (cards, modals)
BORDER_RADIUS_XL:        16px (hero cards, featured)
BORDER_RADIUS_FULL:      9999px (pills, avatars)
```

---

## Component Hierarchy

### Reusable Component Categories

#### 1. Foundation Components (Atomic)
```
Button          - CTA, primary, secondary, ghost, text
Input           - Text, email, password, search
Label           - Form labels, field helpers
Badge           - Status, category, tag
Avatar          - Profile pictures, user indicators
Icon            - SVG icons, consistent sizing
Divider         - Visual separators
```

#### 2. Form Components
```
FormField       - Input wrapper with label
FormError       - Error message display
FormGroup       - Form section grouping
FormSubmitButton - CTA with loading state
Textarea        - Multi-line text input
Select          - Dropdown select
```

#### 3. Card Components
```
Card            - Generic content container
CreatorCard     - Creator showcase card
ContentCard     - Media content card
ActivityCard    - Activity feed item
StatCard        - Statistics display
```

#### 4. Layout Components
```
MainLayout      - Primary layout wrapper
DashboardLayout - Dashboard with sidebar
PageLayout      - Page with header and content
PageHeader      - Page title and actions
Sidebar         - Navigation sidebar (desktop)
BottomNav       - Navigation (mobile)
Navigation      - Header navigation
```

#### 5. Complex Components
```
MediaUploadDialog  - Upload interface
RecommendationFeed - Infinite scroll feed
FilterPanel        - Advanced filtering
SearchBar          - Smart search with autocomplete
Carousel           - Content carousel
Notification       - Toast notifications
Modal              - Dialog modal
Drawer             - Side drawer
```

#### 6. Data Components
```
DataTable        - Table display with sorting/filtering
Chart            - Analytics charts
ProgressBar      - Progress indication
Skeleton         - Loading placeholder
```

---

## Page Architecture

### Pages Structure

#### Authentication Flow
```
/auth/login        - Login page with OAuth
/auth/signup       - Role-based signup
/auth/onboarding   - Creator/Audience onboarding
```

#### Creator Experience
```
/dashboard         - Creator dashboard home
/dashboard/studio  - Upload and edit content
/dashboard/analytics - Creator analytics
/profile/[id]      - Creator public profile
```

#### Discovery Experience
```
/                  - Home personalized feed
/explore           - Discover page with filters
/trending          - Trending creators
/search            - Global search
```

#### Sponsor/Scout Experience
```
/sponsors          - Sponsor directory
/sponsors/[id]     - Sponsor details
```

#### User Experience
```
/settings          - Account settings
/notifications     - Notification center
/messages          - Messaging (future)
```

---

## Animation Guidelines

### Transition Times
```
MICRO:         150ms  (hover, focus states)
QUICK:         200ms  (UI state changes)
STANDARD:      300ms  (page transitions, modal open)
SLOW:          500ms  (complex animations)
```

### Easing Functions
```
EASING_LINEAR:      cubic-bezier(0, 0, 1, 1)
EASING_EASE_IN:     cubic-bezier(0.4, 0, 1, 1)
EASING_EASE_OUT:    cubic-bezier(0, 0, 0.2, 1)
EASING_EASE_IN_OUT: cubic-bezier(0.4, 0, 0.2, 1)
EASING_BOUNCE:      cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animation Patterns
```
FADE:          opacity 200ms ease-out
SLIDE_UP:      transform translateY(10px), opacity 300ms ease-out
SLIDE_DOWN:    transform translateY(-10px), opacity 300ms ease-out
SCALE:         transform scale(0.95), opacity 150ms ease-out
PULSE:         opacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
SHIMMER:       gradient position 2s infinite
BOUNCE:        transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## Responsive Patterns

### Breakpoints
```
MOBILE:    < 640px   (xs, sm)
TABLET:    640-1024px (md, lg)
DESKTOP:   1024px+   (xl, 2xl, 3xl)
```

### Mobile-First Strategy
1. Design for mobile first
2. Enhance for tablet with optimized spacing
3. Expand for desktop with multi-column layouts
4. Always maintain touch-friendly targets (48px minimum)

### Key Responsive Changes
```
Navigation:
  Mobile:   Bottom navigation bar
  Tablet:   Top navigation with overflow menu
  Desktop:  Sidebar navigation

Cards:
  Mobile:   Full-width, stacked
  Tablet:   2-column grid
  Desktop:  3-4 column grid

Modals:
  Mobile:   Full screen drawer
  Tablet:   Center modal, 90% width
  Desktop:  Center modal, fixed width (600px max)

Sidebar:
  Mobile:   Hidden (bottom nav only)
  Tablet:   Collapsible sidebar (icon mode)
  Desktop:  Full sidebar
```

---

## Premium UI Patterns

### 1. Glass Morphism Cards
```
- 5-10% white opacity background
- Subtle backdrop blur (12px)
- Thin border (1px) with subtle white opacity
- Soft shadow
- Smooth hover scale (1.02) with slight glow
```

### 2. Gradient Accents
```
- Use gradients for CTAs and highlights
- Apply subtle gradient overlays for depth
- Animate gradient on hover/focus
```

### 3. Micro-interactions
```
- Button hover: subtle scale + glow
- Input focus: border color change + glow
- Card hover: lift effect + shadow increase
- Icon hover: color change + scale
```

### 4. Loading States
```
- Skeleton loaders with pulse animation
- Gradient shimmer effect
- Progressive content loading
- Smart preloading for next content
```

### 5. Empty States
```
- Illustrative graphics
- Clear messaging
- Actionable CTAs
- Use of brand colors
```

### 6. Success/Error States
```
- Color-coded backgrounds
- Icons with animations
- Clear messaging
- Auto-dismiss or action required
```

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Dashboard home
│   │   ├── studio/page.tsx        # Content upload
│   │   ├── analytics/page.tsx
│   │   ├── settings/page.tsx
│   │   └── notifications/page.tsx
│   ├── (discovery)/
│   │   ├── layout.tsx
│   │   ├── explore/page.tsx
│   │   ├── trending/page.tsx
│   │   └── search/page.tsx
│   ├── profile/
│   │   └── [id]/page.tsx
│   ├── creators/
│   │   └── [id]/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── content/
│   │   ├── recommendations/
│   │   └── analytics/
│
├── components/
│   ├── ui/                        # Shadcn/ui components (exported)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── foundation/                # Atomic components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Divider.tsx
│   │   ├── Icon.tsx
│   │   └── index.ts
│   ├── forms/                     # Form components
│   │   ├── FormField.tsx
│   │   ├── FormError.tsx
│   │   ├── FormGroup.tsx
│   │   ├── FormSubmitButton.tsx
│   │   └── index.ts
│   ├── cards/                     # Card components
│   │   ├── CreatorCard.tsx
│   │   ├── ContentCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── StatCard.tsx
│   │   └── index.ts
│   ├── layout/                    # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── PageLayout.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   ├── discovery/                 # Discovery components
│   │   ├── RecommendationFeed.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── index.ts
│   ├── content/                   # Content components
│   │   ├── MediaUploadDialog.tsx
│   │   ├── MediaPreview.tsx
│   │   ├── ContentGrid.tsx
│   │   └── index.ts
│   ├── common/                    # Common reusable
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Notification.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   └── index.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useContent.ts
│   ├── useRecommendations.ts
│   ├── useAnalytics.ts
│   ├── useLocalStorage.ts
│   ├── usePagination.ts
│   └── useInfiniteScroll.ts
│
├── lib/
│   ├── api/                       # API clients
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── content.ts
│   │   └── recommendations.ts
│   ├── prisma.ts                  # Prisma client
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── storage.ts
│   ├── classification.ts          # ML classification
│   ├── utils.ts                   # General utilities
│   └── constants.ts
│
├── utils/
│   ├── cn.ts                      # Class name utility
│   ├── validation.ts              # Form validation
│   ├── formatters.ts              # Format data
│   ├── helpers.ts                 # General helpers
│   ├── analytics.ts               # Analytics helpers
│   └── constants.ts
│
├── types/
│   ├── index.ts                   # All types
│   ├── models.ts                  # Database models
│   ├── api.ts                     # API types
│   └── auth.ts                    # Auth types
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   ├── design-system.css
│   └── tailwind-extend.css
│
└── constants/
    ├── routes.ts
    ├── api.ts
    ├── features.ts
    └── ui.ts

prisma/
├── schema.prisma                  # Database schema
└── seed.ts                        # Database seeding
```

---

## Naming Conventions

### File Naming
```
COMPONENT FILES:
- PascalCase for component files: Avatar.tsx, FormField.tsx
- Use descriptive names: UserProfileCard.tsx, NotificationCenter.tsx
- Group related components in folders

HOOK FILES:
- camelCase with 'use' prefix: useAuth.ts, useContentFeed.ts, useAnalytics.ts

UTILITY FILES:
- camelCase: helpers.ts, formatters.ts, constants.ts

TYPE FILES:
- index.ts for barrel exports
- Organized by concern: models.ts, api.ts, auth.ts

API ROUTE FILES:
- Lowercase, descriptive: /api/content, /api/recommendations
- RESTful naming: [resource]/route.ts
```

### Variable/Function Naming
```
CONSTANTS:
- SCREAMING_SNAKE_CASE: MAX_FILE_SIZE, DEFAULT_LIMIT, CACHE_KEY

FUNCTIONS:
- camelCase: getUserProfile(), classifyContent(), formatTimestamp()
- Descriptive action verbs: fetch, create, update, delete, validate

REACT COMPONENTS:
- PascalCase: <CreatorCard />, <PageHeader />

PROPS INTERFACES:
- PascalCase + Props suffix: CreatorCardProps, FormFieldProps

TYPES:
- PascalCase: User, Creator, Content, Recommendation
```

### CSS/Tailwind Naming
```
CUSTOM CSS CLASSES:
- kebab-case: .glass-effect, .gradient-accent, .shadow-glow

TAILWIND UTILITIES:
- Use Tailwind classes directly
- Create custom utilities in tailwind.config.ts for design system

CSS VARIABLES:
- kebab-case with prefix: --color-primary-blue, --spacing-base
```

---

## Summary

This design system provides:
✅ Comprehensive color system with semantic meaning
✅ Clear typography hierarchy
✅ Consistent spacing and layout grid
✅ Reusable component structure
✅ Responsive design patterns
✅ Premium UI animations and interactions
✅ Well-organized file structure
✅ Clear naming conventions
✅ Foundation for scalable, maintainable code

### Key Principles
- Mobile-first responsive design
- Dark theme with premium accents
- Clear component hierarchy
- Consistent naming conventions
- AI-forward aesthetic
- Creator-centric approach
- Accessibility compliance
