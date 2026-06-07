import { LinkItem, CreatorProfile, AnalyticsEvent } from './types';

export const INITIAL_PROFILE: CreatorProfile = {
  username: 'varadbuilds',
  displayName: 'Varad Sontakke',
  bio: '🚀 Helping Students Build Skills & Earn Online 🎥 Content Creation | AI | Personal Branding 📈 Learn → Create → Grow → Monetize 🎓 Engineering Student Building in Public 👇 Free Resources & Community',
  avatarUrl: 'https://unavatar.io/twitter/varad__210', // Automatically resolves Varad's high-quality professional Twitter avatar (yellow background portrait)
  theme: 'yellow-onyx',
  socials: {
    instagram: 'https://instagram.com/varadbuilds',
    youtube: 'https://youtube.com/@Varadpreneur210',
    telegram: 'https://t.me/varadbuilds',
    whatsapp: 'https://whatsapp.com/channel/0029VbDEEQcGufIupgv7X30A',
    twitter: 'https://twitter.com/varad__210',
    email: 'dijitalvarad@gmail.com',
    github: 'https://github.com/varad-210',
  },
};

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'whatsapp-community',
    title: 'WhatsApp VIP Inner Circle Community',
    url: 'https://whatsapp.com/channel/0029VbDEEQcGufIupgv7X30A',
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
    url: 'https://youtu.be/Lf2NNIGdEkk?si=NOQhpj-wtaPinCtn',
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
    url: 'https://drive.google.com/file/d/1S2ijI1Rpelsihj8gqP4TFup9TqbIWzPp/view?usp=sharing',
    description: 'Escape the Matrix. Build High Income Skills. Earn from Your Mobile.',
    icon: 'shopping-bag',
    badge: 'HOT SELLER',
    clicks: 980,
    views: 2450,
    active: true,
    order: 3,
  },
  {
    id: 'digital-skill-blog',
    title: 'Digital Skills Blog',
    url: 'https://digitalvarad.vercel.app/',
    description: 'Learn AI, Content Creation, Freelancing & Affiliate Marketing Through Practical Examples.',
    icon: 'globe',
    badge: 'MUST VISIT',
    clicks: 1150,
    views: 2100,
    active: true,
    order: 4,
  },
  {
    id: 'telegram-channel',
    title: 'Telegram Digital Growth Club',
    url: 'https://t.me/varadbuilds',
    description: 'Download FREE Canva templates, Notion brand setups, and video hook PDF guides.',
    icon: 'telegram',
    badge: 'RECOMMENDED',
    clicks: 860,
    views: 1800,
    active: true,
    order: 5,
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
