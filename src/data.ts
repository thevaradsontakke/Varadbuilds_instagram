import { LinkItem, CreatorProfile, AnalyticsEvent } from './types';

export const INITIAL_PROFILE: CreatorProfile = {
  username: 'varadbuilds',
  displayName: 'Varad Sontakke',
  bio: '🚀 Helping Students Build Skills & Earn Online 🎥 Content Creation | AI | Personal Branding 📈 Learn → Create → Grow → Monetize 🎓 Engineering Student Building in Public 👇 Free Resources & Community',
  avatarUrl: 'https://avatars.githubusercontent.com/u/96059837?v=4', // Real GitHub profile avatar for Varad Builds
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
    id: 'whatsapp-community',
    title: 'WhatsApp VIP Inner Circle Community',
    url: 'https://chat.whatsapp.com/Gxyz12347910',
    description: 'Get immediate notifications, feedback on your hooks, and chat with 2,000+ scaling creators.',
    icon: 'whatsapp',
    badge: 'FREE ACCESS',
    clicks: 1845,
    views: 3600,
    active: true,
    order: 1,
  },
  {
    id: 'yt-channel',
    title: 'Future is Unpredictable',
    url: 'https://youtube.com/@varadbuilds',
    description: "The future is uncertain. Your preparation doesn't have to be.",
    icon: 'youtube',
    badge: 'NEW VIDEO',
    clicks: 1420,
    views: 3100,
    active: true,
    order: 2,
  },
  {
    id: 'digital-product',
    title: 'THE STUDENT FREEDOM BLUEPRINT',
    url: 'https://varadbuilds.gumroad.com/l/personal-branding',
    description: 'Escape the Matrix. Build High Income Skills. Earn from Your Mobile.',
    icon: 'shopping-bag',
    badge: 'HOT SELLER',
    clicks: 980,
    views: 2450,
    active: true,
    order: 3,
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
