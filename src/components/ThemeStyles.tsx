import { ThemeType } from '../types';

export interface ThemeConfig {
  bgColor: string;
  cardBg: string;
  cardHoverBg: string;
  textColor: string;
  subtitleColor: string;
  buttonAccentBg: string;
  buttonAccentText: string;
  borderStyle: string;
  accentText: string;
  cardShadow: string;
  fontClass: string;
}

export const THEME_PRESETS: Record<ThemeType, ThemeConfig> = {
  'yellow-onyx': {
    bgColor: 'bg-[#090909] text-white',
    cardBg: 'bg-[#121212]',
    cardHoverBg: 'hover:bg-[#1a1a1a] hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300',
    textColor: 'text-white',
    subtitleColor: 'text-gray-400',
    buttonAccentBg: 'bg-yellow-400 hover:bg-yellow-500',
    buttonAccentText: 'text-black font-semibold',
    borderStyle: 'border border-gray-800 focus:border-yellow-400',
    accentText: 'text-yellow-400',
    cardShadow: 'hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]',
    fontClass: 'font-sans',
  },
  'brutalist-light': {
    bgColor: 'bg-[#F2F2F2] text-black',
    cardBg: 'bg-white',
    cardHoverBg: 'hover:bg-yellow-100 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-150',
    textColor: 'text-black',
    subtitleColor: 'text-gray-700',
    buttonAccentBg: 'bg-black hover:bg-zinc-800',
    buttonAccentText: 'text-yellow-400 font-bold',
    borderStyle: 'border-2 border-black focus:ring-2 focus:ring-yellow-400',
    accentText: 'text-black underline decoration-yellow-400 decoration-3',
    cardShadow: 'shadow-[6px_6px_0px_#000000] border-2 border-black',
    fontClass: 'font-mono',
  },
  'carbon-luxury': {
    bgColor: 'bg-gradient-to-b from-[#18181b] to-[#09090b] text-white',
    cardBg: 'bg-zinc-900/60 backdrop-blur-md',
    cardHoverBg: 'hover:bg-zinc-800/80 hover:border-yellow-500/40 hover:shadow-[0_4px_20px_rgba(250,204,21,0.08)] duration-300 scale-[1.01]',
    textColor: 'text-white',
    subtitleColor: 'text-zinc-400',
    buttonAccentBg: 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-95',
    buttonAccentText: 'text-neutral-900 font-medium',
    borderStyle: 'border border-zinc-800 focus:ring-1 focus:ring-yellow-500',
    accentText: 'text-amber-400',
    cardShadow: 'shadow-sm border border-zinc-800/50',
    fontClass: 'font-sans',
  },
  'canary-minimal': {
    bgColor: 'bg-[#FCFAF2] text-[#1c1917]',
    cardBg: 'bg-white',
    cardHoverBg: 'hover:bg-amber-50/50 hover:border-yellow-500 hover:shadow-md hover:scale-[1.015] duration-255 transition-all',
    textColor: 'text-[#1c1917]',
    subtitleColor: 'text-stone-500',
    buttonAccentBg: 'bg-[#FBBF24] hover:bg-yellow-500',
    buttonAccentText: 'text-black font-extrabold',
    borderStyle: 'border border-amber-200 focus:ring-2 focus:ring-yellow-400',
    accentText: 'text-[#d97706]',
    cardShadow: 'shadow-[0_4px_16px_rgba(251,191,36,0.06)] border border-amber-100',
    fontClass: 'font-sans',
  },
  'scandi-sun': {
    bgColor: 'bg-[#F4F4F5] text-zinc-900',
    cardBg: 'bg-zinc-100/70 border border-zinc-200/80',
    cardHoverBg: 'hover:bg-white hover:border-yellow-400 hover:shadow-lg hover:scale-[1.01] duration-300 transition-all',
    textColor: 'text-zinc-900',
    subtitleColor: 'text-zinc-500',
    buttonAccentBg: 'bg-zinc-900 hover:bg-black',
    buttonAccentText: 'text-yellow-400 font-semibold',
    borderStyle: 'border border-zinc-200 focus:ring-2 focus:ring-yellow-400',
    accentText: 'text-zinc-900',
    cardShadow: 'shadow-[0_2px_10px_rgba(0,0,0,0.02)]',
    fontClass: 'font-sans',
  },
};
