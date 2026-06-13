import { prisma } from '@/lib/prisma';

const sectors = [
  {
    name: 'Visual Arts',
    description: 'Paintings, drawings, sculptures, and other traditional art forms',
    icon: '🎨',
  },
  {
    name: 'Photography',
    description: 'Photography, portraiture, and visual storytelling',
    icon: '📷',
  },
  {
    name: 'Design',
    description: 'Graphic design, UI/UX, and digital design',
    icon: '✏️',
  },
  {
    name: 'Music',
    description: 'Musical performances, compositions, and audio production',
    icon: '🎵',
  },
  {
    name: 'Film & Video',
    description: 'Filmmaking, video production, and cinematography',
    icon: '🎬',
  },
  {
    name: 'Fashion',
    description: 'Fashion design, styling, and modeling',
    icon: '👗',
  },
  {
    name: 'Performance & Theater',
    description: 'Theater, dance, acting, and live performances',
    icon: '🎭',
  },
  {
    name: 'Sports',
    description: 'Athletic performance and sports content',
    icon: '⚽',
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const sector of sectors) {
    const existing = await prisma.sector.findUnique({
      where: { name: sector.name },
    });

    if (!existing) {
      await prisma.sector.create({
        data: sector,
      });
      console.log(`✅ Created sector: ${sector.name}`);
    } else {
      console.log(`⏭️  Sector already exists: ${sector.name}`);
    }
  }

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
