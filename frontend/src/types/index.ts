// src/types/index.ts
// ============= USER & AUTH =============

export enum UserRole {
  TALENT = 'TALENT',
  SPONSOR = 'SPONSOR',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  FAN = 'FAN',
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum VerificationBadge {
  VERIFIED = 'VERIFIED',
  PREMIUM = 'PREMIUM',
  PARTNER = 'PARTNER',
  NONE = 'NONE',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  role: UserRole;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  talent?: TalentProfile;
  sponsor?: SponsorProfile;
  followersCount: number;
  followingCount: number;
}

// ============= TALENT & CREATOR =============
export interface TalentProfile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  categories: string[];
  skills: string[];
  visibilityScore?: AIVisibilityScore;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIVisibilityScore {
  id: string;
  talentId: string;
  score: number; // 0-100
  reason: string;
  factors?: Record<string, number>;
  lastUpdated: Date;
}

export interface TalentStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  followersCount: number;
  mediaCount: number;
  engagementRate: number;
}

// ============= SPONSOR & ORGANIZATIONS =============
export interface SponsorProfile {
  id: string;
  userId: string;
  companyName: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  location: string | null;
  sectors: string[];
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============= CATEGORIES & SECTORS =============
export interface Sector {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= MEDIA & CONTENT =============
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export interface Media {
  id: string;
  talentId: string;
  title: string;
  description?: string;
  type: MediaType;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number; // seconds
  sectorId: string;
  aiTags: string[];
  aiCaption?: string;
  classification?: Record<string, any>;
  confidenceScore?: number;
  engagements?: Engagement[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= ENGAGEMENT & SOCIAL =============
export enum EngagementType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  SHARE = 'SHARE',
  SAVE = 'SAVE',
}

export interface Engagement {
  id: string;
  userId: string;
  mediaId: string;
  type: EngagementType;
  content?: string; // For comments
  createdAt: Date;
}

// ============= RECOMMENDATIONS & AI MATCHING =============
export enum RecommendationStatus {
  PENDING = 'PENDING',
  VIEWED = 'VIEWED',
  INTERESTED = 'INTERESTED',
  REJECTED = 'REJECTED',
  CONNECTED = 'CONNECTED',
}

export interface Recommendation {
  id: string;
  talentId: string;
  sponsorId: string;
  mediaId: string;
  matchScore: number; // 0-100
  reason?: string;
  status: RecommendationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============= NOTIFICATIONS & MESSAGING =============
export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  SHARE = 'SHARE',
  RECOMMENDATION = 'RECOMMENDATION',
  MESSAGE = 'MESSAGE',
  ACHIEVEMENT = 'ACHIEVEMENT',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages?: Message[];
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============= REPORTING & MODERATION =============
export enum ReportType {
  SPAM = 'SPAM',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  HARASSMENT = 'HARASSMENT',
  COPYRIGHT = 'COPYRIGHT',
  MISLEADING = 'MISLEADING',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DISMISSED = 'DISMISSED',
  ACTION_TAKEN = 'ACTION_TAKEN',
}

export interface Report {
  id: string;
  reportedBy: string;
  type: ReportType;
  targetId: string;
  targetType: 'MEDIA' | 'USER';
  reason: string;
  description?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============= FEATURED & TRENDING =============
export interface FeaturedCreator {
  id: string;
  talentId: string;
  featuredAt: Date;
  expiresAt?: Date;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrendingInsight {
  id: string;
  type: 'CATEGORY' | 'HASHTAG' | 'CREATOR' | 'SOUND';
  name: string;
  slug: string;
  viewCount: number;
  engagementScore: number;
  momentum: number; // 0-100, growth rate
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= ANALYTICS =============
export interface Analytics {
  id: string;
  talentId: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers: number;
  createdAt: Date;
}

// ============= ACHIEVEMENTS & BADGES =============
export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  criteria: string; // JSON
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// ============= SOCIAL GRAPH =============
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface SavedMedia {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: Date;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ============= FORM & UI TYPES =============
export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreatorOnboardingData {
  bio: string;
  location: string;
  website?: string;
  categories: string[];
  socialLinks?: Record<string, string>;
}

export interface SponsorOnboardingData {
  companyName: string;
  description: string;
  website?: string;
  location?: string;
  sectors: string[];
}

export interface MediaUploadData {
  title: string;
  description?: string;
  type: MediaType;
  sectorId: string;
  file: File;
  isPublic?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const SECTOR_CATEGORIES = [
  { id: 'music', name: 'Music', icon: '🎵', color: '#EC4899' },
  { id: 'comedy', name: 'Comedy', icon: '😂', color: '#F59E0B' },
  { id: 'dance', name: 'Dance', icon: '💃', color: '#A78BFA' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#10B981' },
  { id: 'art', name: 'Visual Art', icon: '🎨', color: '#06B6D4' },
  { id: 'performance', name: 'Performance', icon: '🎭', color: '#EF4444' },
  { id: 'content', name: 'Content Creator', icon: '📹', color: '#3B82F6' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#FBBF24' },
] as const;

export interface MediaItem {
  id: string;
  talentId: string;
  title: string;
  description: string | null;
  type: MediaType;
  fileUrl: string;
  thumbnailUrl: string | null;
  duration?: number;
  sectorId: string;
  aiTags: string[];
  aiCaption: string | null;
  classification?: Record<string, any>;
  confidenceScore?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaWithEngagement extends MediaItem {
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    userLiked: boolean;
    userSaved: boolean;
  };
  talent?: {
    id: string;
    user: {
      name: string;
      avatarUrl: string | null;
    };
  };
}

export interface Engagement {
  id: string;
  userId: string;
  mediaId: string;
  type: EngagementType;
  content?: string;
  createdAt: Date;
}

// ============= RECOMMENDATIONS & AI MATCHING =============
export interface RecommendationItem {
  id: string;
  talentId: string;
  sponsorId?: string;
  mediaId: string;
  matchScore: number; // 0-100
  reason?: string;
  status: 'PENDING' | 'VIEWED' | 'INTERESTED' | 'REJECTED' | 'CONNECTED';
  createdAt: Date;
  media?: MediaItem;
  talent?: TalentProfile;
}

// ============= ANALYTICS & METRICS =============
export interface DailyAnalytics {
  id: string;
  talentId: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers: number;
}

export interface AnalyticsStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  averageEngagementRate: number;
  topContent: MediaItem[];
  dailyStats: DailyAnalytics[];
  growthPercentage: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender?: User;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
  participants?: User[];
  lastMessage?: Message;
}

export interface Report {
  id: string;
  reportedBy: string;
  type: ReportType;
  targetId: string;
  targetType: 'MEDIA' | 'USER';
  reason: string;
  description?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedCard {
  id: string;
  media: MediaWithEngagement;
  talent: TalentProfile;
  reason?: string; // Why it was recommended
  recommendations?: number; // Number of recommendations
}

export interface DiscoveryFilters {
  category?: string;
  location?: string;
  engagementLevel?: 'low' | 'medium' | 'high';
  verified?: boolean;
  sortBy?: 'trending' | 'new' | 'popular' | 'relevant';
  timeRange?: 'day' | 'week' | 'month' | 'all';
}

// ============= PAGINATION =============
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============= FORM DATA =============
export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface MediaUploadFormData {
  title: string;
  description?: string;
  type: MediaType;
  file: File;
  category: string;
  isPublic: boolean;
}

export interface ProfileUpdateFormData {
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: File;
  banner?: File;
  socialLinks?: Record<string, string>;
}

export interface ContentUploadFormData {
  tags: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  contentWarnings: string[];
  file: File;
  autoGenerateTags?: boolean;
  autoGenerateCaption?: boolean;
}

// Filter & Search Types
export interface CreatorFilter {
  categories?: string[];
  location?: string;
  verifiedOnly?: boolean;
  sortBy?: 'trending' | 'new' | 'followers' | 'engagement';
  page?: number;
  limit?: number;
}

export interface ContentFilter {
  categories?: string[];
  contentType?: MediaType[];
  sortBy?: 'trending' | 'new' | 'mostLiked' | 'engagement';
  page?: number;
  limit?: number;
}

export interface SearchQuery {
  query: string;
  type?: 'creators' | 'content' | 'all';
  filters?: CreatorFilter | ContentFilter;
  page?: number;
  limit?: number;
}

// UI State Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

// Theme Types
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

// Feature Flags
export interface FeatureFlags {
  enableAIRecommendations: boolean;
  enableMessaging: boolean;
  enableAnalytics: boolean;
  enableSocialSharing: boolean;
  enableCreatorVerification: boolean;
  enableAdminDashboard: boolean;
}
