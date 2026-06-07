import { motion } from 'motion/react';
import {
  Youtube,
  Send,
  MessageCircle,
  ShoppingBag,
  BookOpen,
  Video,
  Globe,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Mail,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { LinkItem, CreatorProfile, ThemeType } from '../types';
import { THEME_PRESETS, ThemeConfig } from './ThemeStyles';

interface LinkTreePreviewProps {
  profile: CreatorProfile;
  links: LinkItem[];
  onTriggerLinkClick: (linkId: string) => void;
  isStandaloneMobile?: boolean; // If we show plain style or in simulated frame
}

export default function LinkTreePreview({
  profile,
  links,
  onTriggerLinkClick,
  isStandaloneMobile = false,
}: LinkTreePreviewProps) {
  const selectedTheme: ThemeType = profile.theme || 'yellow-onyx';
  const themeConfig: ThemeConfig = THEME_PRESETS[selectedTheme];

  const getIcon = (iconName: string) => {
    const size = 18;
    switch (iconName.toLowerCase()) {
      case 'youtube':
        return <Youtube size={size} />;
      case 'telegram':
        return <Send size={size} />;
      case 'whatsapp':
        return <MessageCircle size={size} />;
      case 'shopping-bag':
        return <ShoppingBag size={size} />;
      case 'book-open':
        return <BookOpen size={size} />;
      case 'video':
        return <Video size={size} />;
      case 'globe':
        return <Globe size={size} />;
      default:
        return <LinkIcon size={size} />;
    }
  };

  // Keep links list clean and ordered
  const sortedLinks = [...links]
    .filter((l) => l.active)
    .sort((a, b) => a.order - b.order);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  // Render the core contents of LinkTree
  const renderBioLinks = () => (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-5 py-8 min-h-full">
      {/* Profile Header Block */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center space-y-3"
      >
        <div className="relative group">
          {/* Subtle surrounding glow for yellow/black themes */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition duration-300" />
          <img
            src={profile.avatarUrl || 'https://via.placeholder.com/150'}
            alt={profile.displayName}
            className="relative w-20 h-20 rounded-full object-cover border-2 border-yellow-400 select-none shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-1">
          <h2 className={`text-xl font-bold font-sans flex items-center justify-center gap-1.5 leading-tight ${themeConfig.textColor}`}>
            {profile.displayName || 'Creator Name'}
            <CheckCircle2 className="w-4 h-4 fill-yellow-400 text-black stroke-[3px]" />
          </h2>
          <p className="text-sm font-semibold font-mono text-yellow-500 tracking-wide">
            @{profile.username || 'creator'}
          </p>
        </div>

        <p className={`text-xs max-w-sm font-medium mt-1 leading-relaxed ${themeConfig.subtitleColor}`}>
          {profile.bio || 'Add your bio coordinates here.'}
        </p>
      </motion.div>

      {/* Social Media Footer / Hub Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-4 my-6"
      >
        {profile.socials.instagram && (
          <button
            onClick={() => {
              onTriggerLinkClick('instagram-profile');
              window.open(profile.socials.instagram, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </button>
        )}
        {profile.socials.youtube && (
          <button
            onClick={() => {
              onTriggerLinkClick('youtube-profile');
              window.open(profile.socials.youtube, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="YouTube"
          >
            <Youtube className="w-5 h-5" />
          </button>
        )}
        {profile.socials.telegram && (
          <button
            onClick={() => {
              onTriggerLinkClick('telegram-profile');
              window.open(profile.socials.telegram, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="Telegram"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
        {profile.socials.whatsapp && (
          <button
            onClick={() => {
              onTriggerLinkClick('whatsapp-profile');
              window.open(profile.socials.whatsapp, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="WhatsApp Community"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        )}
        {profile.socials.twitter && (
          <button
            onClick={() => {
              onTriggerLinkClick('twitter-profile');
              window.open(profile.socials.twitter, '_blank', 'noopener,noreferrer');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
        )}
        {profile.socials.email && (
          <button
            onClick={() => {
              onTriggerLinkClick('email-profile');
              window.open(`mailto:${profile.socials.email}`, '_blank');
            }}
            className="p-2 mr-0.5 rounded-full hover:bg-yellow-400 hover:text-black transition duration-200 cursor-pointer text-stone-300 hover:scale-110"
            title="Send Email"
          >
            <Mail className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Styled Buttons Loop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full space-y-4 flex-1"
      >
        {sortedLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-stone-500 font-mono text-xs border border-dashed border-stone-800 rounded-lg">
            No dynamic links published.
            <span className="text-[10px] mt-1 text-stone-600">Activate links in your Creator Dashboard.</span>
          </div>
        ) : (
          sortedLinks.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => {
                onTriggerLinkClick(item.id);
                if (item.url) {
                  // Simulate navigation
                  window.open(item.url, '_blank', 'noopener,noreferrer');
                }
              }}
              className={`w-full p-4 rounded-xl cursor-pointer ${themeConfig.cardBg} ${themeConfig.cardHoverBg} ${themeConfig.cardShadow} transition duration-200 flex items-center relative overflow-hidden group`}
            >
              {/* Highlight Badge */}
              {item.badge && (
                <div className="absolute top-0 right-0">
                  <div className="bg-yellow-400 text-black text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-bl-lg uppercase font-mono shadow-[2px_1px_4px_rgba(0,0,0,0.15)]">
                    {item.badge}
                  </div>
                </div>
              )}

              {/* Left Logo circular slot */}
              <div className="p-3 mr-4 rounded-lg bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition duration-300 shrink-0">
                {getIcon(item.icon)}
              </div>

              {/* Middle dynamic text labels */}
              <div className="flex-1 text-left select-none pr-12">
                <h4 className={`text-sm font-bold font-sans tracking-tight leading-tight ${themeConfig.textColor}`}>
                  {item.title || 'Untitled Link'}
                </h4>
                {item.description && (
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-tight ${themeConfig.subtitleColor}`}>
                    {item.description}
                  </p>
                )}
              </div>

              {/* Decorative Arrow */}
              <span className="text-stone-400 group-hover:text-yellow-400 group-hover:translate-x-1.5 transition duration-200 absolute right-4 shrink-0 font-bold font-mono">
                →
              </span>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Branded Footer */}
      <div className="mt-8 pt-4 border-t border-zinc-900 w-full text-center">
        <p className="text-[10px] font-mono tracking-widest text-[#FACC15] font-semibold flex items-center justify-center gap-1 uppercase">
          ⚡ Powered by @{profile.username}
        </p>
        <p className="text-[9px] text-zinc-500 mt-1 uppercase font-mono">
          Minimalist Instagram Brand Engine
        </p>
      </div>
    </div>
  );

  if (isStandaloneMobile) {
    return (
      <div className={`min-h-screen w-full ${themeConfig.bgColor} flex flex-col`}>
        {renderBioLinks()}
      </div>
    );
  }

  // Otherwise, wrap in standard glass smartphone shell
  return (
    <div className={`w-full max-w-[340px] h-[670px] ${themeConfig.bgColor} rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-[12px] border-zinc-900 overflow-y-auto relative flex flex-col overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-800`}>
      {/* Top hardware ear speaker notch decor */}
      <div className="absolute top-0 inset-x-0 h-4 bg-zinc-900 rounded-b-xl z-20 flex justify-center items-center">
        <div className="w-16 h-1 bg-stone-700 rounded-full" />
      </div>

      {/* Internal scroll view */}
      <div className="pt-6 flex-1 flex flex-col justify-between">
        {renderBioLinks()}
      </div>
    </div>
  );
}
