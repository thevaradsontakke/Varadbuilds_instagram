import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  LayoutDashboard,
  Eye,
  LineChart,
  Grid,
  Sparkles,
  Award,
  CheckCircle2,
  RefreshCw,
  Clock,
  ExternalLink,
  Palette,
} from 'lucide-react';

import { LinkItem, CreatorProfile, AnalyticsEvent, ThemeType } from './types';
import { INITIAL_PROFILE, INITIAL_LINKS, generateMockAnalyticsEvents } from './data';
import LinkTreePreview from './components/LinkTreePreview';
import LinkEditorPanel from './components/LinkEditorPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  // Load data from LocalStorage or seed defaults
  const [profile, setProfile] = useState<CreatorProfile>(() => {
    const saved = localStorage.getItem('varadbuilds_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('varadbuilds_links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('varadbuilds_events');
    return saved ? JSON.parse(saved) : generateMockAnalyticsEvents();
  });

  // Support dynamic route modes: if URL is accessed via ?editaccess=Varad@210, unlock full admin/builder dashboard.
  // Otherwise, default to full screen, live standalone production public portfolio!
  const hasEditorQuery = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('editaccess') === 'Varad@210'
  );

  // Navigation: Toggles between 'dashboard' (builder + metrics) and 'public' (standalone full-screen bio page)
  const [viewMode, setViewMode] = useState<'dashboard' | 'public'>(() => {
    return hasEditorQuery ? 'dashboard' : 'public';
  });

  // Multi-tab controls on the left side of the dashboard: 'editor' or 'analytics'
  const [dashboardTab, setDashboardTab] = useState<'editor' | 'analytics'>('editor');

  // Mobile View Switcher (On screens under lg, we either show the Editor tabs or the Smartphone Preview)
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor');

  // Event Toast feedback notifications on link tracking clicks
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('varadbuilds_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('varadbuilds_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('varadbuilds_events', JSON.stringify(events));
  }, [events]);

  // Helper Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const cycleTheme = () => {
    const ALL_THEMES: ThemeType[] = [
      'yellow-onyx',
      'brutalist-light',
      'carbon-luxury',
      'canary-minimal',
      'scandi-sun',
    ];
    const currentIndex = ALL_THEMES.indexOf(profile.theme);
    const nextIndex = (currentIndex + 1) % ALL_THEMES.length;
    const nextTheme = ALL_THEMES[nextIndex];
    setProfile(prev => ({ ...prev, theme: nextTheme }));
    
    const themeLabels: Record<ThemeType, string> = {
      'yellow-onyx': 'Yellow Onyx 🌑',
      'brutalist-light': 'Brutalist Offset 🔲',
      'carbon-luxury': 'Carbon Luxury 💎',
      'canary-minimal': 'Canary Minimal 🍦',
      'scandi-sun': 'Scandi Sun ❄️',
    };
    showToast(`🎨 Selected Theme rotated to: ${themeLabels[nextTheme]}!`);
  };

  // Triggered when a visitor clicks on any dynamic button inside the visual mockup
  const handleLinkClickTracking = (linkId: string) => {
    // Increment statistical click counts inside links list state if it's a standard link item
    const isSocialSuffix = linkId.endsWith('-profile');
    const sourceLabel = isSocialSuffix
      ? 'Instagram Bio'
      : ['Instagram Bio', 'YouTube Desc', 'WhatsApp Group', 'Telegram Channel', 'Direct'][
          Math.floor(Math.random() * 5)
        ] as AnalyticsEvent['source'];

    if (!isSocialSuffix) {
      setLinks((prevLinks) =>
        prevLinks.map((l) => {
          if (l.id === linkId) {
            return { ...l, clicks: l.clicks + 1 };
          }
          return l;
        })
      );
    }

    // Write a real analytics history log entry
    const newEv: AnalyticsEvent = {
      id: `ev-manual-${Date.now()}-${Math.random()}`,
      linkId,
      timestamp: new Date().toISOString(),
      source: sourceLabel,
      device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
    };

    setEvents((prev) => [newEv, ...prev]);

    // Lookup legible button label to display in tracking alert toasts
    let displayName = 'Social Handle Icon';
    if (!isSocialSuffix) {
      const match = links.find((l) => l.id === linkId);
      if (match) displayName = `"${match.title}"`;
    } else {
      displayName = linkId.replace('-profile', ' button').toUpperCase();
    }

    showToast(`🎯 Click tracked securely for ${displayName}! Added +1 click to dataset curves.`);
  };

  // Sandbox controller actions: simulates traffic volumes
  const handleSimulateTraffic = (addedCount: number) => {
    const sources: Array<AnalyticsEvent['source']> = [
      'Instagram Bio',
      'YouTube Desc',
      'WhatsApp Group',
      'Telegram Channel',
      'Direct',
    ];
    const devices: Array<AnalyticsEvent['device']> = ['Mobile', 'Desktop', 'Tablet'];
    const activeLinkIds = links.filter((l) => l.active).map((l) => l.id);

    if (activeLinkIds.length === 0) {
      showToast('⚠️ Activate at least one link before generating simulator clicks!');
      return;
    }

    const today = new Date();
    const newSimulatedEvents: AnalyticsEvent[] = [];

    // Increment links counts
    const clickMapToIncrement: Record<string, number> = {};

    for (let i = 0; i < addedCount; i++) {
      // Pick random offset days so history gets spread nicely (0 to 6 days ago)
      const offsetDays = Math.floor(Math.random() * 7);
      const date = new Date(today);
      date.setDate(today.getDate() - offsetDays);
      const timestamp = new Date(date.getTime() + Math.random() * 86400000).toISOString();

      // Create primary entry profile visual hit
      newSimulatedEvents.push({
        id: `sim-view-${Date.now()}-${i}`,
        linkId: 'profile-view',
        timestamp,
        source: sources[Math.floor(Math.random() * sources.length)],
        device: devices[Math.random() < 0.75 ? 0 : 1],
      });

      // Simulated conversion percentage
      if (Math.random() < 0.55) {
        const randId = activeLinkIds[Math.floor(Math.random() * activeLinkIds.length)];
        clickMapToIncrement[randId] = (clickMapToIncrement[randId] || 0) + 1;

        newSimulatedEvents.push({
          id: `sim-click-${Date.now()}-${i}`,
          linkId: randId,
          timestamp,
          source: sources[Math.floor(Math.random() * sources.length)],
          device: devices[Math.random() < 0.75 ? 0 : 1],
        });
      }
    }

    // Apply incremental results back to link counters
    setLinks((prev) =>
      prev.map((l) => {
        const ad = clickMapToIncrement[l.id] || 0;
        return {
          ...l,
          clicks: l.clicks + ad,
          views: l.views + Math.floor(addedCount * 1.2), // general exposure proxy
        };
      })
    );

    setEvents((prev) => [...newSimulatedEvents, ...prev]);
    showToast(`🚀 Inflow simulator active: Simulated +${addedCount} views & links clicks across the past 7 days.`);
  };

  // Reset counters to blank sandbox clean state
  const handleResetAnalytics = () => {
    // Keep baseline views to zero
    setEvents([]);
    setLinks((prev) =>
      prev.map((l) => ({
        ...l,
        clicks: 0,
        views: 0,
      }))
    );
    showToast('🧹 Analytics metrics database reset to raw empty state.');
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans relative selection:bg-yellow-400 selection:text-black antialiased">
      
      {/* 1. BRAND NAVIGATION HEADER NAVBAR - Visible only if editing is unlocked */}
      {hasEditorQuery && (
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-zinc-900/80 px-4 sm:px-6 py-3.5 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-base shadow-[0_0_12px_rgba(250,204,21,0.25)] select-none">
              vB
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-white text-sm tracking-tight font-sans uppercase">
                  {profile.username || 'creator'}
                </span>
                <span className="text-[10px] font-bold bg-yellow-400/10 text-[#FACC15] uppercase px-1.5 py-0.5 rounded font-mono">
                  Brand Core
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                White + Yellow + Black Portfolio Engine
              </p>
            </div>
          </div>

          {/* Global Nav Mode selector */}
          <div className="flex items-center gap-3">
            {/* Quick Theme Swapper Button */}
            <button
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-2 bg-stone-950 hover:bg-stone-900 active:scale-95 text-yellow-400 border border-zinc-800 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer"
              title="Rotate to Next Theme"
            >
              <Palette className="w-4 h-4 text-yellow-400" />
              <span className="hidden md:inline">Quick Switch Theme</span>
              {/* Show badge of current theme label */}
              <span className="text-[9px] bg-yellow-400/10 text-[#FACC15] uppercase px-1.5 py-0.5 rounded font-mono font-bold max-w-[90px] truncate hidden sm:inline">
                {profile.theme.replace('-', ' ')}
              </span>
            </button>

            <div className="bg-stone-950 p-1 rounded-xl border border-zinc-800 flex gap-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'dashboard'
                    ? 'bg-yellow-400 text-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Creator Workspace</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('public');
                  showToast('🔑 Rendering Public Bio linktree view. Fits any mobile browser beautifully.');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'public'
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Public Portfolio</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 2. MAIN APPLICATION CONTENT PORT */}
      <main className={viewMode === 'public' && !hasEditorQuery
        ? "flex-1 w-full flex flex-col relative"
        : "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col relative"
      }>
        <AnimatePresence mode="wait">
          {viewMode === 'public' ? (
            /* FULL SCREEN PUBLIC USER BIO PORTAL */
            <motion.div
              key="public-bio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={hasEditorQuery 
                ? "flex-1 flex flex-col items-center justify-center py-6"
                : "flex-1 flex flex-col w-full"
              }
            >
              {hasEditorQuery && (
                <div className="mb-6 flex items-center justify-between w-full max-w-md bg-stone-900 border border-zinc-850 px-4 py-2.5 rounded-xl animate-pulse">
                  <span className="text-xs font-mono text-stone-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Mobile Simulator View
                  </span>
                  <button
                    onClick={() => setViewMode('dashboard')}
                    className="text-xs text-yellow-400 underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}

              {/* Renders the full screen responsive Bio Linktree Page */}
              <LinkTreePreview
                profile={profile}
                links={links}
                onTriggerLinkClick={handleLinkClickTracking}
                isStandaloneMobile={true}
              />
            </motion.div>
          ) : (
            /* DUAL SPLIT GRAPHICAL CREATOR WORKSPACE */
            <motion.div
              key="workspace-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1"
            >
              {/* MOBILE PREVIEW SWITCHER TABS (Only visible on screens under lg) */}
              <div className="lg:hidden flex bg-[#0E0E0E] p-1 border border-zinc-850 rounded-xl mb-2 gap-2">
                <button
                  onClick={() => setMobilePanel('editor')}
                  className={`flex-1 py-2 text-xs font-bold font-sans rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                    mobilePanel === 'editor'
                      ? 'bg-yellow-400 text-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Workspace Settings & Graphs
                </button>
                <button
                  onClick={() => setMobilePanel('preview')}
                  className={`flex-1 py-2 text-xs font-bold font-sans rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                    mobilePanel === 'preview'
                      ? 'bg-yellow-400 text-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Show Smartphone Preview
                </button>
              </div>

              {/* LEFT COLUMN: Controls setting directories or charts (lg:col-span-8) */}
              <div
                className={`lg:col-span-8 space-y-6 ${
                  mobilePanel === 'editor' ? 'block' : 'hidden lg:block'
                }`}
              >
                {/* Secondary navigation banner inside the controls area */}
                <div className="flex border-b border-zinc-850 pb-4 justify-between items-center flex-wrap gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-white font-sans flex items-center gap-1.5 tracking-tight">
                      {dashboardTab === 'editor' ? 'Showcase Links Builder' : 'Integrated Performance Analytics'}
                      <Sparkles className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />
                    </h2>
                    <p className="text-xs text-stone-400">
                      {dashboardTab === 'editor'
                        ? 'Publish, edit, order and customize social communities shortcuts easily.'
                        : 'Review dynamic click histories, device ratios, and overall CTR conversion ratios.'}
                    </p>
                  </div>

                  {/* Switch Sub-tabs */}
                  <div className="flex bg-stone-950 p-1 border border-zinc-850 rounded-xl">
                    <button
                      onClick={() => setDashboardTab('editor')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        dashboardTab === 'editor' ? 'bg-zinc-800 text-white' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      Buttons Directory
                    </button>
                    <button
                      onClick={() => setDashboardTab('analytics')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        dashboardTab === 'analytics' ? 'bg-zinc-800 text-white' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <LineChart className="w-3.5 h-3.5 text-yellow-400" />
                      Integrated Analytics
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {dashboardTab === 'editor' ? (
                    <motion.div
                      key="editor-sub"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <LinkEditorPanel
                        profile={profile}
                        onChangeProfile={setProfile}
                        links={links}
                        onChangeLinks={setLinks}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analytics-sub"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <AnalyticsDashboard
                        links={links}
                        events={events}
                        onTriggerSimulation={handleSimulateTraffic}
                        onResetAnalytics={handleResetAnalytics}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT COLUMN: The Sticky iPhone Mockup Frame (lg:col-span-4) */}
              <div
                className={`lg:col-span-4 lg:sticky lg:top-24 flex flex-col items-center justify-center ${
                  mobilePanel === 'preview' ? 'block' : 'hidden lg:flex'
                }`}
              >
                <div className="mb-3 flex items-center justify-between w-full max-w-[340px] px-2 text-stone-400 text-xs">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
                    LIVE WORKSPACE MOCK
                  </span>
                  <span className="text-[10px] bg-stone-900 border border-zinc-850 py-0.5 px-2 rounded-full font-mono text-emerald-400 font-semibold uppercase">
                    Interactive
                  </span>
                </div>

                {/* Smartphone View Wrapper */}
                <LinkTreePreview
                  profile={profile}
                  links={links}
                  onTriggerLinkClick={handleLinkClickTracking}
                />

                <p className="text-[10px] text-stone-500 font-mono text-center max-w-[280px] mt-4 uppercase tracking-widest leading-normal leading-relaxed">
                  💡 Tips: Click any button or footer icon inside the screen above to trigger active logs of clicks.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. TOAST PERFORMANCE NOTIFICATION FOR TELEMETRY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-zinc-950 border-2 border-yellow-400 text-white shadow-[0_4px_30px_rgba(250,204,21,0.25)] rounded-xl max-w-sm"
          >
            <div className="flex gap-2.5 items-start">
              <div className="bg-yellow-400 p-1 text-black rounded mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-black stroke-[3px]" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs uppercase text-yellow-400 font-sans tracking-wide">
                  Tracker Service Signal
                </h5>
                <p className="text-xs text-stone-200 mt-1 leading-relaxed font-mono">
                  {toastMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FOOTER */}
      <footer className="py-8 bg-black mt-12 border-t border-zinc-950 text-center text-stone-500 text-xs font-mono">
        <p className="font-extrabold text-stone-400">
          ⚡ Powered by @varadbuilds
        </p>
        <p className="text-[10px] text-stone-600 mt-1 uppercase tracking-wider">
          Minimalist Instagram Brand Engine
        </p>
      </footer>
    </div>
  );
}
