import { LinkItem, CreatorProfile, AnalyticsEvent } from './types';

export const INITIAL_PROFILE: CreatorProfile = {
  username: 'varadbuilds',
  displayName: 'Varad Builds',
  bio: 'Personal Brand Architect. Helping creators & startups build high-value presence, dominate socials, and monetize expertise.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Crisp professional fallback, can be customized
  theme: 'yellow-onyx',
  socials: {
    instagram: 'https://instagram.com/varadbuilds',
    youtube: 'https://youtube.com/@varadbuilds',
    telegram: 'https://t.me/varadbuilds_hub',
    whatsapp: 'https://wa.me/1234567890',
    twitter: 'https://twitter.com/varadbuilds',
    email: 'contact@varadbuilds.com',
    github: 'https://github.com/varadbuilds',
  },
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'yt-channel',
    title: 'Subscribe to YouTube Channel',
    url: 'https://youtube.com/@varadbuilds',
    description: 'Weekly tutorials on content schedules, editing frameworks, and personal branding audits.',
    icon: 'youtube',
    badge: 'NEW VIDEO',
    clicks: 1420,
    views: 3100,
    active: true,
    order: 1,
  },
  {
    id: 'digital-product',
    title: 'Personal Branding Mastery E-Book',
    url: 'https://varadbuilds.gumroad.com/l/personal-branding',
    description: 'The step-by-step blueprint to turn your online presence into a customer-generating asset. (50% OFF)',
    icon: 'shopping-bag',
    badge: 'HOT SELLER',
    clicks: 980,
    views: 2450,
    active: true,
    order: 2,
  },
  {
    id: 'whatsapp-community',
    title: 'WhatsApp VIP Inner Circle Community',
    url: 'https://chat.whatsapp.com/Gxyz12347910',
    description: 'Get immediate notifications, feedback on your hooks, and chat with 2,000+ scaling creators.',
    icon: 'whatsapp',
    badge: 'FREE ACCESS',
    clicks: 1845,
    views: 3600,
    active: true,
    order: 3,
  },
  {
    id: 'telegram-channel',
    title: 'Telegram High-Performance Resource Hub',
    url: 'https://t.me/varadbuilds_resources',
    description: 'Download FREE Canva templates, Notion brand setups, and video hook PDF guides.',
    icon: 'telegram',
    badge: 'RECOMMENDED',
    clicks: 1150,
    views: 2100,
    active: true,
    order: 4,
  },
];

// Generates beautiful realistic simulated historical telemetry for charts
export function generateMockAnalyticsEvents(): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [];
  const sources: Array<AnalyticsEvent['source']> = [
    'Instagram Bio',
    'YouTube Desc',
    'WhatsApp Group',
    'Telegram Channel',
    'Direct',
  ];
  const devices: Array<AnalyticsEvent['device']> = ['Mobile', 'Desktop', 'Tablet'];
  const linkIds = ['yt-channel', 'digital-product', 'whatsapp-community', 'telegram-channel'];

  // Current date offset
  const today = new Date();

  // Accumulate events covering the past 7 days
  for (let d = 7; d >= 0; d--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - d);

    // Number of visitors on this day (e.g., between 80 and 150)
    const dailyViewsCount = Math.floor(60 + Math.random() * 90);
    for (let j = 0; j < dailyViewsCount; j++) {
      // Create profile view event
      events.push({
        id: `ev-view-${d}-${j}`,
        linkId: 'profile-view',
        timestamp: new Date(currentDate.getTime() + Math.random() * 86400000).toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        device: devices[Math.random() < 0.85 ? 0 : Math.random() < 0.7 ? 1 : 2], // bias mobile
      });

      // Clicks are a fraction (e.g., 40% CTR total)
      if (Math.random() < 0.45) {
        const targetLinkId = linkIds[Math.floor(Math.random() * linkIds.length)];
        events.push({
          id: `ev-click-${d}-${j}`,
          linkId: targetLinkId,
          timestamp: new Date(currentDate.getTime() + Math.random() * 86400000).toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          device: devices[Math.random() < 0.8 ? 0 : 1],
        });
      }
    }
  }

  return events;
}
