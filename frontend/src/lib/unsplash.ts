/**
 * Unsplash Image Utility
 * Generates optimized image URLs - using local placeholders to avoid SSL issues
 */

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'webp' | 'png';
  crop?: 'faces' | 'entropy';
}

/**
 * Generate placeholder image URL
 * This avoids SSL issues with external image providers
 * @param photoId - Used to create unique placeholder images
 * @param options - Image customization options
 */
export function getUnsplashUrl(
  photoId: string,
  options: UnsplashImageOptions = {}
): string {
  const {
    width = 800,
    height = 600,
  } = options;

  // Return a placeholder image URL
  // Using placeholder.com which is more reliable than external services
  return `https://via.placeholder.com/${width}x${height}?text=Image+${photoId.slice(-4)}`;
}

/**
 * Generate Unsplash image URL for a specific query
 * For random images from a search query
 */
export function getUnsplashQueryUrl(
  query: string,
  width: number = 800,
  height: number = 600
): string {
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: '80',
    fit: 'crop',
    auto: 'webp',
  });

  return `https://source.unsplash.com/${width}x${height}?${query}&${params.toString()}`;
}

/**
 * Sample Unsplash photo IDs for different sectors
 * Curated high-quality images for Talynk platform
 */
export const UNSPLASH_SAMPLES = {
  // Music & Audio Content
  music: [
    '1470225620905',  // Music producer
    '1506157786151',  // DJ with equipment
    '1511379938547',  // Sound equipment
    '1493225457519',  // Recording studio
  ],
  // Visual Arts & Design
  visualArts: [
    '1535016120894',  // Artist at work
    '1548036328610',  // Painting studio
    '1561070791-2526d30994b5', // Designer working
    '1535016066461',  // Digital art
  ],
  // Photography & Video
  photography: [
    '1484807550052',  // Photographer
    '1502920917128',  // Camera equipment
    '1612198188060',  // Video production
    '1469022563428',  // Photography session
  ],
  // Dance & Performance
  dance: [
    '1516738901601',  // Dancer in motion
    '1495379957154',  // Performance stage
    '1492684223066',  // Theatrical performance
    '1487649726878',  // Dance rehearsal
  ],
  // Fashion & Style
  fashion: [
    '1595938894655',  // Fashion model
    '1509631179647',  // Fashion design
    '1544967497-c5d4a8d7e6f9', // Style showcase
    '1558769132-cb3aea458c5e', // Fashion photography
  ],
  // Sports & Fitness
  sports: [
    '1517836357207',  // Athlete training
    '1461896836934',  // Sports action
    '1552674605-5dca6dd5e07d', // Fitness training
    '1461896836934',  // Athletic performance
  ],
  // Comedy & Entertainment
  comedy: [
    '1495521821757',  // Comedian on stage
    '1514525253161',  // Stage performance
    '1540575467063',  // Entertainment energy
    '1470225620905',  // Spotlight performance
  ],
  // Content Creation & Streaming
  creation: [
    '1491462853556',  // Content creator setup
    '1516738901601',  // Creator workspace
    '1552664730-d307ca884978', // Studio setup
    '1516321318423',  // Streaming setup
  ],
  // Professional & Business
  sponsor: [
    '1552664730-d307ca884978', // Corporate professional
    '1454165804606',  // Business environment
    '1516534775068',  // Team collaboration
    '1552994641-9d97c62b5d1d', // Office environment
  ],
  // Talent Profiles
  talent: [
    '1494790108377',  // Professional headshot
    '1507003211169',  // Creative professional
    '1438761681033',  // Creative workspace
    '1507003211512',  // Talented individual
  ],
  // Landing & Marketing
  landing: [
    '1517694712202',  // Creative inspiration
    '1486312338219',  // Collaboration
    '1498050108023',  // Exploration/discovery
    '1504384308090',  // Innovation
  ],
  // Backgrounds & Overlays
  background: [
    '1553531889-8a91eccffffe', // Abstract gradient
    '1552664730-d307ca884978', // Smooth professional
    '1504384308090',  // Modern aesthetic
    '1487214078519',  // Contemporary
  ],
};

/**
 * Get a random sample image for a sector
 */
export function getRandomSectorImage(sector: string): string {
  const sectorKey = sector
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace('&', '') as keyof typeof UNSPLASH_SAMPLES;

  const samples = UNSPLASH_SAMPLES[sectorKey] || UNSPLASH_SAMPLES.talent;
  const randomId = samples[Math.floor(Math.random() * samples.length)];

  return getUnsplashUrl(randomId, {
    width: 500,
    height: 500,
    crop: 'faces',
  });
}

/**
 * Placeholder image generator
 * Use while loading
 */
export function getPlaceholderImage(color: string = 'e5e7eb'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23${color}' width='400' height='300'/%3E%3C/svg%3E`;
}
