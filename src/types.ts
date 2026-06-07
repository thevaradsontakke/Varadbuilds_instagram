export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string; // 'youtube' | 'instagram' | 'telegram' | 'whatsapp' | 'globe' | 'shopping-bag' | 'book-open' | 'video' | 'link'
  badge?: string; // e.g. 'HOT', 'NEW', 'FREE'
  clicks: number;
  views: number; // for individual CTR
  active: boolean;
  order: number;
}

export type ThemeType = 'yellow-onyx' | 'brutalist-light' | 'carbon-luxury' | 'canary-minimal' | 'scandi-sun';

export interface CreatorProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeType;
  socials: {
    instagram?: string;
    youtube?: string;
    telegram?: string;
    whatsapp?: string;
    twitter?: string;
    email?: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  linkId: string; // 'profile-view' or specific link dynamic ID
  timestamp: string; // ISO String
  source: 'Instagram Bio' | 'YouTube Desc' | 'WhatsApp Group' | 'Telegram Channel' | 'Direct';
  device: 'Mobile' | 'Desktop' | 'Tablet';
}

export interface DailyStat {
  date: string; // 'Mon', 'Tue' etc
  views: number;
  clicks: number;
}
