import { PrismaClient, PortfolioType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SERVICES } from "../lib/constants";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const img = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;
const face = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&crop=faces`;

type SeedPortfolio = {
  type: PortfolioType;
  title: string;
  category: string;
  photo: string;
  description?: string;
};

type SeedCreator = {
  firstName: string;
  lastName: string;
  displayName: string;
  profession: string;
  headline: string;
  bio: string;
  location: string;
  city: string;
  country: string;
  avatar: string;
  cover: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
  languages: string[];
  skills: string[];
  specialties: string[];
  featured?: boolean;
  services: { slug: string; title?: string }[];
  portfolio: SeedPortfolio[];
  // list of {author, role, rating, comment}
  reviews: { author: string; role?: string; rating: number; comment: string }[];
};

const CREATORS: SeedCreator[] = [
  {
    firstName: "Sarah",
    lastName: "Ben Ali",
    displayName: "Sarah Ben Ali",
    profession: "Content Creator & Videographer",
    headline: "Turning brands into scroll-stopping stories, one reel at a time.",
    bio: "Sarah is a Tunis-based content creator specialising in short-form video and brand storytelling. Over the last five years she has produced reels and campaigns for fashion, beauty and lifestyle brands across North Africa and Europe. She blends a documentary eye with a sharp sense for trends, delivering content that feels native to the feed while staying on-brand.",
    location: "Tunis, Tunisia",
    city: "Tunis",
    country: "Tunisia",
    avatar: face("1544005313-94ddf0286df2"),
    cover: img("1492691527719-9d1e07e534b4", 1400, 600),
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
    website: "https://example.com",
    languages: ["Arabic", "French", "English"],
    skills: ["Storytelling", "Color grading", "Motion graphics", "Trend research"],
    specialties: ["Reels", "Brand Content", "Fashion"],
    featured: true,
    services: [
      { slug: "reels", title: "Instagram Reels" },
      { slug: "video", title: "Brand video" },
      { slug: "brand-content", title: "Brand campaigns" },
      { slug: "social-media-content" },
    ],
    portfolio: [
      { type: PortfolioType.REEL, title: "Summer fashion reel", category: "Fashion", photo: img("1492691527719-9d1e07e534b4", 600, 800) },
      { type: PortfolioType.IMAGE, title: "Beauty campaign", category: "Beauty", photo: img("1596462502278-27bfdc403348") },
      { type: PortfolioType.VIDEO, title: "Café brand film", category: "Food", photo: img("1554080353-a576cf803bda") },
      { type: PortfolioType.IMAGE, title: "Editorial shoot", category: "Fashion", photo: img("1483985988355-763728e1935b") },
      { type: PortfolioType.REEL, title: "Product launch teaser", category: "Beauty", photo: img("1620916566398-39f1143ab7be", 600, 800) },
      { type: PortfolioType.CAMPAIGN, title: "Ramadan campaign", category: "Brand", photo: img("1600880292203-757bb62b4baf") },
    ],
    reviews: [
      { author: "Nadia K.", role: "Marketing lead, Luma Beauty", rating: 5, comment: "Sarah delivered beyond expectations. The reels drove our best month ever." },
      { author: "Mehdi B.", role: "Founder, Studio Nord", rating: 5, comment: "Professional, creative and fast. A joy to work with." },
      { author: "Ines T.", role: "Brand manager", rating: 5, comment: "She just gets it. On-brand, on-trend, on-time." },
      { author: "Omar D.", rating: 4, comment: "Great quality, would love slightly faster revisions but overall excellent." },
    ],
  },
  {
    firstName: "Ahmed",
    lastName: "Trabelsi",
    displayName: "Ahmed Trabelsi",
    profession: "Photographer & Filmmaker",
    headline: "Cinematic product and brand photography that sells.",
    bio: "Ahmed is a commercial photographer and filmmaker with a passion for light and detail. He works with startups and established brands to craft product and lifestyle imagery that converts. His studio setup and on-location expertise make him a go-to for e-commerce and advertising shoots.",
    location: "Sousse, Tunisia",
    city: "Sousse",
    country: "Tunisia",
    avatar: face("1500648767791-00dcc994a43e"),
    cover: img("1606983340126-99ab4feaa64a", 1400, 600),
    instagram: "https://instagram.com",
    website: "https://example.com",
    languages: ["Arabic", "French", "English"],
    skills: ["Studio lighting", "Retouching", "Product styling", "Direction"],
    specialties: ["Photography", "Advertising", "E-commerce"],
    featured: true,
    services: [
      { slug: "photography", title: "Product photography" },
      { slug: "video", title: "Advertising video" },
      { slug: "brand-content" },
    ],
    portfolio: [
      { type: PortfolioType.IMAGE, title: "Watch campaign", category: "Product", photo: img("1523275335684-37898b6baf30") },
      { type: PortfolioType.IMAGE, title: "Sneaker editorial", category: "Fashion", photo: img("1542291026-7eec264c27ff") },
      { type: PortfolioType.IMAGE, title: "Perfume still life", category: "Beauty", photo: img("1541643600914-78b084683601") },
      { type: PortfolioType.VIDEO, title: "Brand ad film", category: "Advertising", photo: img("1485846234645-a62644f84728") },
      { type: PortfolioType.IMAGE, title: "Food photography", category: "Food", photo: img("1504674900247-0877df9cc836") },
    ],
    reviews: [
      { author: "Lucas M.", role: "E-commerce director", rating: 5, comment: "Best product shots we've ever had. Conversion went up noticeably." },
      { author: "Farah Z.", rating: 5, comment: "Incredible eye for detail and lighting." },
      { author: "Karim S.", role: "Startup founder", rating: 4, comment: "Excellent work, very reliable." },
    ],
  },
  {
    firstName: "Lina",
    lastName: "Mansour",
    displayName: "Lina Mansour",
    profession: "UGC Creator & Social Strategist",
    headline: "Authentic UGC that feels real and performs.",
    bio: "Lina creates user-generated content that brands can't fake. From unboxings to tutorials and testimonials, she produces relatable, high-converting content optimised for TikTok and Instagram. She also advises brands on content strategy and creator collaborations.",
    location: "Tunis, Tunisia",
    city: "Tunis",
    country: "Tunisia",
    avatar: face("1534528741775-53994a69daeb"),
    cover: img("1533227268428-f9ed0900fb3b", 1400, 600),
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    languages: ["Arabic", "French"],
    skills: ["UGC", "Copywriting", "Trend spotting", "On-camera presenting"],
    specialties: ["UGC", "Social Media Content", "Beauty"],
    featured: true,
    services: [
      { slug: "ugc", title: "UGC packages" },
      { slug: "social-media-content", title: "TikTok content" },
      { slug: "reels" },
    ],
    portfolio: [
      { type: PortfolioType.STORY, title: "Skincare routine", category: "Beauty", photo: img("1596462502278-27bfdc403348", 600, 800) },
      { type: PortfolioType.REEL, title: "Unboxing reel", category: "Lifestyle", photo: img("1483985988355-763728e1935b", 600, 800) },
      { type: PortfolioType.IMAGE, title: "Product flatlay", category: "Beauty", photo: img("1522335789203-aabd1fc54bc9") },
      { type: PortfolioType.STORY, title: "Tutorial series", category: "Beauty", photo: img("1512496015851-a90fb38ba796", 600, 800) },
    ],
    reviews: [
      { author: "Sonia R.", role: "Brand manager, Glow", rating: 5, comment: "Lina's UGC outperformed our studio ads. Highly recommend." },
      { author: "Yassine H.", rating: 4, comment: "Great content, very authentic." },
      { author: "Emma L.", role: "Growth marketer", rating: 5, comment: "Fast, professional and the content just converts." },
    ],
  },
  {
    firstName: "Yassine",
    lastName: "Ben Amor",
    displayName: "Yassine Ben Amor",
    profession: "Videographer & Editor",
    headline: "Brand films and ads with a cinematic edge.",
    bio: "Yassine is a filmmaker and editor focused on brand films, ads and event coverage. With a background in cinema, he brings narrative depth and polished editing to every project, from concept and shooting to the final grade.",
    location: "Sfax, Tunisia",
    city: "Sfax",
    country: "Tunisia",
    avatar: face("1507003211169-0a1dd7228f2d"),
    cover: img("1485846234645-a62644f84728", 1400, 600),
    youtube: "https://youtube.com",
    website: "https://example.com",
    languages: ["Arabic", "French", "English"],
    skills: ["Cinematography", "Editing", "Color grading", "Sound design"],
    specialties: ["Video", "Brand Content", "Events"],
    services: [
      { slug: "video", title: "Brand films" },
      { slug: "brand-content", title: "Ad production" },
    ],
    portfolio: [
      { type: PortfolioType.VIDEO, title: "Automotive ad", category: "Advertising", photo: img("1503376780353-7e6692767b70") },
      { type: PortfolioType.VIDEO, title: "Hotel brand film", category: "Travel", photo: img("1566073771259-6a8506099945") },
      { type: PortfolioType.IMAGE, title: "Behind the scenes", category: "BTS", photo: img("1492691527719-9d1e07e534b4") },
      { type: PortfolioType.CAMPAIGN, title: "Launch campaign", category: "Brand", photo: img("1600880292203-757bb62b4baf") },
    ],
    reviews: [
      { author: "Rania B.", role: "Events lead", rating: 5, comment: "Yassine's film gave our launch a cinematic feel. Stunning." },
      { author: "Tariq M.", rating: 4, comment: "Very talented editor, great final delivery." },
    ],
  },
  {
    firstName: "Mariem",
    lastName: "Gharbi",
    displayName: "Mariem Gharbi",
    profession: "Photographer & Content Creator",
    headline: "Lifestyle & travel photography with warmth and light.",
    bio: "Mariem is a lifestyle and travel photographer who captures authentic moments with a bright, warm aesthetic. She collaborates with hospitality, travel and lifestyle brands to create imagery and social content that inspires wanderlust.",
    location: "Hammamet, Tunisia",
    city: "Hammamet",
    country: "Tunisia",
    avatar: face("1438761681033-6461ffad8d80"),
    cover: img("1566073771259-6a8506099945", 1400, 600),
    instagram: "https://instagram.com",
    languages: ["Arabic", "French", "Italian"],
    skills: ["Lifestyle photography", "Editing", "Social content"],
    specialties: ["Photography", "Social Media Content", "Travel"],
    services: [
      { slug: "photography", title: "Lifestyle photography" },
      { slug: "social-media-content" },
      { slug: "stories" },
    ],
    portfolio: [
      { type: PortfolioType.IMAGE, title: "Resort shoot", category: "Travel", photo: img("1571896349842-33c89424de2d") },
      { type: PortfolioType.IMAGE, title: "Beach lifestyle", category: "Lifestyle", photo: img("1507525428034-b723cf961d3e") },
      { type: PortfolioType.STORY, title: "City guide stories", category: "Travel", photo: img("1502602898657-3e91760cbb34", 600, 800) },
      { type: PortfolioType.IMAGE, title: "Hotel interiors", category: "Hospitality", photo: img("1445019980597-93fa8acb246c") },
    ],
    reviews: [
      { author: "Claudia F.", role: "Hotel marketing", rating: 5, comment: "Mariem's photos are pure magic. Bookings went up." },
      { author: "Sami L.", rating: 4, comment: "Beautiful work and lovely to work with." },
    ],
  },
  {
    firstName: "Rayen",
    lastName: "Haddad",
    displayName: "Rayen Haddad",
    profession: "Motion Designer & Creator",
    headline: "Motion graphics and animated content that pop.",
    bio: "Rayen is a motion designer creating animated social content, explainer videos and brand animations. He helps brands communicate complex ideas simply and beautifully, with a modern, energetic style.",
    location: "Tunis, Tunisia",
    city: "Tunis",
    country: "Tunisia",
    avatar: face("1633332755192-727a05c4013d"),
    cover: img("1550745165-9bc0b252726f", 1400, 600),
    instagram: "https://instagram.com",
    website: "https://example.com",
    languages: ["Arabic", "French", "English"],
    skills: ["Motion graphics", "2D animation", "After Effects", "Branding"],
    specialties: ["Video", "Social Media Content", "Animation"],
    services: [
      { slug: "video", title: "Motion graphics" },
      { slug: "social-media-content", title: "Animated posts" },
      { slug: "brand-content" },
    ],
    portfolio: [
      { type: PortfolioType.VIDEO, title: "App explainer", category: "Tech", photo: img("1550745165-9bc0b252726f") },
      { type: PortfolioType.VIDEO, title: "Animated logo", category: "Branding", photo: img("1626785774573-4b799315345d") },
      { type: PortfolioType.IMAGE, title: "Social templates", category: "Social", photo: img("1611162617213-7d7a39e9b1d7") },
    ],
    reviews: [
      { author: "Nour A.", role: "Product marketer", rating: 5, comment: "Rayen made our explainer video crystal clear and gorgeous." },
      { author: "Bilel K.", rating: 4, comment: "Creative animations, great communication." },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Crewmate…");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@crewmate.studio";
  const adminPassword = process.env.ADMIN_PASSWORD || "crewmate123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: { email: adminEmail, name: "Crewmate Admin", passwordHash, role: "ADMIN" },
  });
  console.log(`  ✓ Admin: ${adminEmail} / ${adminPassword}`);

  // Services
  const serviceMap = new Map<string, string>();
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const rec = await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description, icon: s.icon, sortOrder: i },
      create: { name: s.name, slug: s.slug, description: s.description, icon: s.icon, sortOrder: i },
    });
    serviceMap.set(s.slug, rec.id);
  }
  console.log(`  ✓ ${SERVICES.length} services`);

  // Site settings
  const settings: Record<string, string> = {
    stat_creators: `${CREATORS.length * 8}+`,
    stat_projects: "250+",
    stat_content_types: String(SERVICES.length),
    stat_clients: "60+",
    contact_email: "hello@crewmate.studio",
    contact_phone: "+216 55 000 000",
    contact_location: "Tunis, Tunisia",
    contact_instagram: "@crewmate.studio",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log(`  ✓ Site settings`);

  // Creators
  for (let i = 0; i < CREATORS.length; i++) {
    const c = CREATORS[i];
    const slug = slugify(c.displayName);

    // Reset relations for idempotent re-seed
    const existing = await prisma.creator.findUnique({ where: { slug } });
    if (existing) {
      await prisma.creatorService.deleteMany({ where: { creatorId: existing.id } });
      await prisma.portfolioItem.deleteMany({ where: { creatorId: existing.id } });
      await prisma.review.deleteMany({ where: { creatorId: existing.id } });
    }

    const avg =
      c.reviews.reduce((sum, r) => sum + r.rating, 0) / (c.reviews.length || 1);

    const creator = await prisma.creator.upsert({
      where: { slug },
      update: {
        firstName: c.firstName,
        lastName: c.lastName,
        displayName: c.displayName,
        profession: c.profession,
        headline: c.headline,
        bio: c.bio,
        location: c.location,
        city: c.city,
        country: c.country,
        avatarUrl: c.avatar,
        coverUrl: c.cover,
        instagram: c.instagram ?? null,
        tiktok: c.tiktok ?? null,
        youtube: c.youtube ?? null,
        website: c.website ?? null,
        languages: c.languages,
        skills: c.skills,
        specialties: c.specialties,
        featured: c.featured ?? false,
        active: true,
        sortOrder: i,
        ratingAvg: Math.round(avg * 10) / 10,
        reviewsCount: c.reviews.length,
      },
      create: {
        slug,
        firstName: c.firstName,
        lastName: c.lastName,
        displayName: c.displayName,
        profession: c.profession,
        headline: c.headline,
        bio: c.bio,
        location: c.location,
        city: c.city,
        country: c.country,
        avatarUrl: c.avatar,
        coverUrl: c.cover,
        instagram: c.instagram ?? null,
        tiktok: c.tiktok ?? null,
        youtube: c.youtube ?? null,
        website: c.website ?? null,
        languages: c.languages,
        skills: c.skills,
        specialties: c.specialties,
        featured: c.featured ?? false,
        sortOrder: i,
        ratingAvg: Math.round(avg * 10) / 10,
        reviewsCount: c.reviews.length,
        email: `${c.firstName.toLowerCase()}@crewmate.studio`,
      },
    });

    // Services
    for (const s of c.services) {
      const serviceId = serviceMap.get(s.slug);
      if (!serviceId) continue;
      await prisma.creatorService.create({
        data: { creatorId: creator.id, serviceId, title: s.title ?? null },
      });
    }

    // Portfolio
    for (let p = 0; p < c.portfolio.length; p++) {
      const item = c.portfolio[p];
      await prisma.portfolioItem.create({
        data: {
          creatorId: creator.id,
          type: item.type,
          title: item.title,
          description: item.description ?? null,
          mediaUrl: item.photo,
          thumbnailUrl: item.photo,
          category: item.category,
          sortOrder: p,
        },
      });
    }

    // Reviews
    for (const r of c.reviews) {
      await prisma.review.create({
        data: {
          creatorId: creator.id,
          authorName: r.author,
          authorRole: r.role ?? null,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }
  console.log(`  ✓ ${CREATORS.length} creators with portfolio + reviews`);

  // Sample requests + contacts for the admin dashboard
  const someCreators = await prisma.creator.findMany({ take: 3, select: { id: true } });
  await prisma.projectRequest.create({
    data: {
      firstName: "Julie",
      lastName: "Martin",
      company: "Nova Cosmetics",
      email: "julie@novacosmetics.com",
      phone: "+33 6 12 34 56 78",
      contentType: "Reels",
      description: "We're launching a new skincare line and need a set of 6 reels for Instagram and TikTok over the next month.",
      budget: "3 000 – 6 000 €",
      preferredDate: "2026-10-05",
      preferredTime: "10:00",
      location: "Paris / remote",
      creatorsCount: 2,
      status: "NEW",
      selectedCreators: { create: someCreators.slice(0, 2).map((c) => ({ creatorId: c.id })) },
    },
  });
  await prisma.projectRequest.create({
    data: {
      firstName: "Karim",
      lastName: "Baccouche",
      company: "Sahara Tours",
      email: "karim@saharatours.tn",
      phone: "+216 22 111 222",
      contentType: "Video",
      description: "Travel brand film + photo package for our new desert tour experience.",
      budget: "6 000 €+",
      preferredDate: "2026-11-12",
      location: "Douz, Tunisia",
      creatorsCount: 1,
      status: "CONTACTED",
      selectedCreators: { create: someCreators.slice(2, 3).map((c) => ({ creatorId: c.id })) },
    },
  });

  await prisma.contactMessage.createMany({
    data: [
      { name: "Amira Selmi", email: "amira@example.com", subject: "Partnership", message: "Hi, we'd love to explore a partnership with Crewmate for our agency.", status: "NEW" },
      { name: "David Cohen", email: "david@brandco.com", company: "BrandCo", subject: "Question about pricing", message: "How does pricing work for a 3-month retainer?", status: "READ" },
    ],
  });

  console.log("  ✓ Sample requests + contact messages");
  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
