import { useState, FormEvent, ChangeEvent } from 'react';
import {
  User,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Hash,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
  Twitter,
  Mail,
  FolderPlus,
  Compass,
  Upload,
  Image as ImageIcon,
  Save,
  Check,
} from 'lucide-react';
import { LinkItem, CreatorProfile, ThemeType } from '../types';

interface LinkEditorPanelProps {
  profile: CreatorProfile;
  onChangeProfile: (updated: CreatorProfile) => void;
  links: LinkItem[];
  onChangeLinks: (updated: LinkItem[]) => void;
}

export default function LinkEditorPanel({
  profile,
  onChangeProfile,
  links,
  onChangeLinks,
}: LinkEditorPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'links' | 'socials'>('links');

  // Local states for image uploading, optimization, and explicit save feedback
  const [dragActive, setDragActive] = useState(false);
  const [compressStatus, setCompressStatus] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Input bindings for adding a new link
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('link');
  const [newBadge, setNewBadge] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Profile avatar list for easy default profile picking in sandbox
  const DEFAULT_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  ];

  // Quick preset title builders for social niches
  const PRESET_IDEAS = [
    { title: '👉 Free Resource Templates File', url: 'https://docs.google.com/spreadsheets/d/123', desc: 'Download my high-conversion branding assets.', icon: 'globe', badge: 'FREE' },
    { title: '🔥 1-on-1 Content Growth Consultation', url: 'https://calendly.com/varad', desc: 'Let\'s analyze your Instagram & YouTube retention.', icon: 'video', badge: 'HOT' },
    { title: '📚 The Creator System Blueprint', url: 'https://gumroad.com/l/creator', desc: 'Full bundle to scale to $10k/month.', icon: 'shopping-bag', badge: 'SELL' },
  ];

  // PROFILE MUTATIONS
  const handleProfileFieldChange = (key: string, value: any) => {
    onChangeProfile({
      ...profile,
      [key]: value,
    });
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image/picture file format.');
      return;
    }

    setCompressStatus('Optimizing image...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High fidelity downscaling to max 350px width/height to save local storage space
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 350;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleProfileFieldChange('avatarUrl', dataUrl);
          setCompressStatus('Optimized! Displayed on preview.');
          setTimeout(() => setCompressStatus(null), 3000);
        } else {
          if (typeof reader.result === 'string') {
            handleProfileFieldChange('avatarUrl', reader.result);
          }
          setCompressStatus(null);
        }
      };
      img.onerror = () => {
        setCompressStatus('Error parsing. Loaded raw fallback.');
        if (typeof reader.result === 'string') {
          handleProfileFieldChange('avatarUrl', reader.result);
        }
        setTimeout(() => setCompressStatus(null), 3000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerManualSaveSuccess = () => {
    setIsSavedRecently(true);
    setTimeout(() => {
      setIsSavedRecently(false);
    }, 4500);
  };

  const handleSocialFieldChange = (key: string, value: string) => {
    onChangeProfile({
      ...profile,
      socials: {
        ...profile.socials,
        [key]: value,
      },
    });
  };

  // LINKS MUTATIONS
  const handleAddLink = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Build unique id and set proper layout order
    const newLnk: LinkItem = {
      id: `lnk-${Date.now()}`,
      title: newTitle,
      url: newUrl || 'https://',
      description: newDesc,
      icon: newIcon,
      badge: newBadge.trim() ? newBadge.trim().toUpperCase() : undefined,
      clicks: 0,
      views: 0,
      active: true,
      order: links.length + 1,
    };

    onChangeLinks([...links, newLnk]);
    
    // Reset parameters
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setNewIcon('link');
    setNewBadge('');
    setIsAdding(false);
  };

  const applyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setNewTitle(preset.title);
    setNewUrl(preset.url);
    setNewDesc(preset.desc);
    setNewIcon(preset.icon);
    setNewBadge(preset.badge);
  };

  const handleDeleteLink = (id: string) => {
    const fresh = links.filter((l) => l.id !== id);
    // Recalculate order indices
    const updated = fresh.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChangeLinks(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = links.map((lnk) => {
      if (lnk.id === id) {
        return { ...lnk, active: !lnk.active };
      }
      return lnk;
    });
    onChangeLinks(updated);
  };

  const handleUpdateLinkInline = (id: string, field: keyof LinkItem, val: any) => {
    const updated = links.map((lnk) => {
      if (lnk.id === id) {
        return { ...lnk, [field]: val };
      }
      return lnk;
    });
    onChangeLinks(updated);
  };

  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) return;

    const updated = [...links].sort((a, b) => a.order - b.order);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap ordering numbers
    const tempOrder = updated[index].order;
    updated[index].order = updated[targetIdx].order;
    updated[targetIdx].order = tempOrder;

    onChangeLinks([...updated].sort((a, b) => a.order - b.order));
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Sub-tab Switcher (Profile, Community Links, Social Handles) */}
      <div className="flex border-b border-zinc-800 bg-[#0A0A0A] p-1.5 rounded-xl">
        <button
          onClick={() => setActiveSubTab('links')}
          className={`flex-1 py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'links' ? 'bg-yellow-400 text-black shadow-sm' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Instagram Bio Links ({links.filter((l) => l.active).length})
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'profile' ? 'bg-yellow-400 text-black shadow-sm' : 'text-stone-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Niche Profile & Themes
        </button>
        <button
          onClick={() => setActiveSubTab('socials')}
          className={`flex-1 py-2.5 rounded-lg font-sans font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'socials' ? 'bg-yellow-400 text-black shadow-sm' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          Direct Communities handles
        </button>
      </div>

      {/* LINKS MANAGER MODULE */}
      {activeSubTab === 'links' && (
        <div className="space-y-5">
          {/* Add Link Section */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold text-sm rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-black/10"
            >
              <Plus className="w-5 h-5 stroke-[2.5px]" />
              ADD NEW SMART BIOLINK BUTTON
            </button>
          ) : (
            <form onSubmit={handleAddLink} className="p-5 bg-stone-950 border border-zinc-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
                  ✨ Configure New Portals
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Presets Helper */}
              <div>
                <span className="block text-[10px] text-stone-500 font-mono uppercase mb-2">
                  ⚡ Quick Templates Setup:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESET_IDEAS.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="p-2 border border-zinc-800 bg-[#0E0E0E] hover:border-yellow-400/50 rounded-lg text-left text-[10px] text-stone-300 transition shrink-0"
                    >
                      <span className="font-bold text-yellow-500 block truncate">{preset.title}</span>
                      <span className="text-[9px] text-stone-500 block truncate mt-0.5">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1">Button Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Personal Branding E-book"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1">Destination URL / Community Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/ebook"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-400 font-medium mb-1">Subtitle / Short Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Download immediately, 100% free downloadable PDF. (12 pages)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 font-medium mb-1">Highlight Badge Accent</label>
                  <input
                    type="text"
                    placeholder="e.g. HOT, NEW, 50% OFF"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400 placeholder:text-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 font-medium mb-2">Button Icon Symbol</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'link', label: 'Default Link' },
                    { key: 'youtube', label: 'YouTube' },
                    { key: 'telegram', label: 'Telegram' },
                    { key: 'whatsapp', label: 'WhatsApp' },
                    { key: 'shopping-bag', label: 'Digital Products' },
                    { key: 'book-open', label: 'Guides/Ebooks' },
                    { key: 'video', label: 'Video Call/Classes' },
                    { key: 'globe', label: 'Personal Site' },
                  ].map((icOption) => (
                    <button
                      key={icOption.key}
                      type="button"
                      onClick={() => setNewIcon(icOption.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition cursor-pointer ${
                        newIcon === icOption.key
                          ? 'bg-yellow-400 text-black font-semibold'
                          : 'bg-[#0E0E0E] text-stone-300 border border-zinc-800 hover:border-stone-700'
                      }`}
                    >
                      {icOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Publish To Linktree
                </button>
              </div>
            </form>
          )}

          {/* Links Listing / Accordions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-stone-400 text-xs font-mono font-semibold">
                ACTIVE SMART CODES ({links.length} TOTAL)
              </span>
              <span className="text-[10px] text-stone-600 font-mono">
                Sort, toggle active, edit labels in physical real-time
              </span>
            </div>

            {links.length === 0 ? (
              <div className="p-8 text-center bg-[#0E0E0E] border border-dashed border-zinc-850 rounded-xl">
                <p className="text-sm text-stone-500">Your link list is empty. click "ADD NEW SMART BIOLINK BUTTON" above to showcase products & chats!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {links
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lnk, index) => {
                    return (
                      <div
                        key={lnk.id}
                        className={`p-4 bg-[#0E0E0E] border rounded-xl transition ${
                          lnk.active ? 'border-zinc-800' : 'border-zinc-900 opacity-60'
                        }`}
                      >
                        {/* Summary Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col gap-0.5 mr-1 pt-0.5">
                              <button
                                disabled={index === 0}
                                onClick={() => handleMoveOrder(lnk.id, 'up')}
                                className="p-0.5 hover:bg-zinc-800 text-stone-500 hover:text-yellow-400 disabled:opacity-30 disabled:hover:text-stone-500 rounded cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === links.length - 1}
                                onClick={() => handleMoveOrder(lnk.id, 'down')}
                                className="p-0.5 hover:bg-zinc-800 text-stone-500 hover:text-yellow-400 disabled:opacity-30 disabled:hover:text-stone-500 rounded cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-xs font-extrabold text-[#FACC15] bg-yellow-400/10 px-2 py-0.5 rounded uppercase">
                                  {lnk.icon}
                                </span>
                                {lnk.badge && (
                                  <span className="bg-white/10 text-stone-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    {lnk.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1 gap-1.5 leading-tight">
                                {lnk.title}
                              </h4>
                              <p className="text-stone-500 text-xs truncate max-w-sm sm:max-w-md mt-0.5 font-mono">
                                {lnk.url}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Visibility check toggler */}
                            <button
                              onClick={() => handleToggleActive(lnk.id)}
                              className={`p-2 rounded-lg border transition cursor-pointer ${
                                lnk.active
                                  ? 'border-yellow-450/40 bg-yellow-400/5 text-yellow-400'
                                  : 'border-zinc-850 bg-stone-950 text-stone-600'
                              }`}
                              title={lnk.active ? 'Hide link from Bio' : 'Show link on Bio'}
                            >
                              {lnk.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteLink(lnk.id)}
                              className="p-2 border border-zinc-850 hover:border-red-650 text-stone-500 hover:text-red-400 rounded-lg cursor-pointer hover:bg-red-400/5 transition duration-200"
                              title="Delete Link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Editable Fields */}
                        <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Label Title</label>
                            <input
                              type="text"
                              value={lnk.title}
                              onChange={(e) => handleUpdateLinkInline(lnk.id, 'title', e.target.value)}
                              className="w-full px-2.5 py-1 bg-[#030303] border border-zinc-850 hover:border-zinc-700 focus:border-yellow-400 text-xs rounded text-stone-300 outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Destination URL</label>
                            <input
                              type="text"
                              value={lnk.url}
                              onChange={(e) => handleUpdateLinkInline(lnk.id, 'url', e.target.value)}
                              className="w-full px-2.5 py-1 bg-[#030303] border border-zinc-850 hover:border-zinc-700 focus:border-yellow-400 text-xs rounded text-stone-300 outline-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Sub-descriptor Description</label>
                            <input
                              type="text"
                              value={lnk.description}
                              onChange={(e) => handleUpdateLinkInline(lnk.id, 'description', e.target.value)}
                              className="w-full px-2.5 py-1 bg-[#030303] border border-zinc-850 hover:border-zinc-700 focus:border-yellow-400 text-xs rounded text-stone-300' outline-none"
                            />
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-[10px] uppercase font-mono text-stone-400 mb-0.5">Badge Promo Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. HOT, NEW, FREE"
                              value={lnk.badge || ''}
                              onChange={(e) => handleUpdateLinkInline(lnk.id, 'badge', e.target.value.toUpperCase() || undefined)}
                              className="w-full px-2.5 py-1 bg-[#030303] border border-zinc-850 hover:border-zinc-700 focus:border-yellow-400 text-xs rounded text-stone-300 outline-none"
                            />
                          </div>
                        </div>

                        {/* Quick Statistics telemetry view below the item */}
                        <div className="mt-3 pt-2 bg-stone-950/40 rounded px-2.5 py-1.5 flex justify-between items-center border border-zinc-900/50">
                          <span className="text-[10px] font-mono text-stone-500">INDIVIDUAL PERFORMANCE:</span>
                          <div className="flex gap-4 text-[10px] font-mono">
                            <span className="text-stone-400">
                              Clicks: <strong className="text-white">{lnk.clicks}</strong>
                            </span>
                            <span className="text-stone-400">
                              Estimated CTR:{' '}
                              <strong className="text-[#FACC15]">
                                {lnk.views > 0 ? ((lnk.clicks / lnk.views) * 100).toFixed(1) : '0.0'}%
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATOR PROFILE & THEMES EDITOR TAB */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          {/* Avatar and branding settings */}
          <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide text-yellow-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Avatar & Handle Info
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">AUTOSAVED TO LOCAL STORAGE</span>
            </div>

            {/* Premium uploader & Preset select grid */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-stone-400">Avatar Image Presentation:</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Preset selection */}
                <div className="p-4 bg-[#070707] border border-zinc-850 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-semibold mb-2">1. Choose High-Res Preset</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {DEFAULT_AVATARS.map((av, idx) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => handleProfileFieldChange('avatarUrl', av)}
                          className={`relative w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition ${
                            profile.avatarUrl === av ? 'border-yellow-400 scale-105 shadow-md' : 'border-zinc-800 grayscale hover:grayscale-0'
                          }`}
                          title={`Select predefined model preset ${idx + 1}`}
                        >
                          <img src={av} alt={`Avatar Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input fallback */}
                  <div className="pt-2 border-t border-zinc-900">
                    <label className="block text-[9px] uppercase font-mono text-stone-500 mb-1">Or Paste Custom Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={profile.avatarUrl.startsWith('data:') ? '' : profile.avatarUrl}
                      onChange={(e) => handleProfileFieldChange('avatarUrl', e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                </div>

                {/* Real-time local image uploader */}
                <div 
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center text-center transition relative overflow-hidden min-h-[140px] ${
                    dragActive 
                      ? 'border-yellow-450 bg-yellow-400/5' 
                      : 'border-zinc-850 bg-[#070707] hover:border-zinc-800'
                  }`}
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files?.[0]) {
                      processImageFile(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          processImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    
                    <div className="flex flex-col items-center gap-2">
                      {profile.avatarUrl.startsWith('data:') ? (
                        <div className="relative">
                          <img 
                            src={profile.avatarUrl} 
                            alt="Uploaded Base64 Preview" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-450 shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-0.5 rounded-full border border-black">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-stone-400 hover:text-yellow-400 transition-colors">
                          <Upload className="w-4.5 h-4.5" />
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold text-white">Drag & Drop or Click to Upload</p>
                        <p className="text-[10px] text-stone-400 mt-1">PNG, JPG or GIF. Downsampled to save local storage.</p>
                      </div>

                      {compressStatus && (
                        <span className="text-[10px] bg-yellow-450/20 text-[#FACC15] px-2.5 py-0.5 rounded-full font-mono animate-pulse">
                          {compressStatus}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-mono">Display Name Signature</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => handleProfileFieldChange('displayName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1 font-mono">Instagram (@) Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleProfileFieldChange('username', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400 font-mono"
                  placeholder="e.g. janedoe_creations"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1 font-mono">Biographical Coordinates (Bio Heading)</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                placeholder="Write a clear statement. Help visitors learn what value your communities & products deliver."
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-sm text-stone-200 outline-none focus:border-yellow-400 resize-none font-sans"
              />
            </div>

            {/* Save Buttons & Status Indicator block */}
            <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[10px] text-stone-400 font-mono">
                  State: {isSavedRecently ? 'Changes Locked' : 'Synchronized Live'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={triggerManualSaveSuccess}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSavedRecently 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                      : 'bg-yellow-450 hover:bg-yellow-500 text-stone-950 font-extrabold active:scale-95'
                  }`}
                >
                  {isSavedRecently ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saved successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Optional Success Status banner */}
            {isSavedRecently && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono flex items-center gap-2">
                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                <span>All profile changes fully updated, compressed, and persisted dynamically inside the local state cache. Enjoy the live simulated preview on the right hand side!</span>
              </div>
            )}
          </div>

          {/* Theme Preset Selection Cards */}
          <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide text-yellow-400">
                Pick Selected Theme Template
              </h3>
              <p className="text-xs text-stone-400 mt-1">Change core color schemes, cards backgrounds, and visual typography layout.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {/* Theme 1 */}
              <button
                type="button"
                onClick={() => handleProfileFieldChange('theme', 'yellow-onyx')}
                className={`p-4 rounded-xl text-left border cursor-pointer transition ${
                  profile.theme === 'yellow-onyx'
                    ? 'border-yellow-400 bg-yellow-400/5 text-white'
                    : 'border-zinc-800 bg-[#070707] hover:border-zinc-700 text-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider font-sans">1. Yellow Onyx</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                </div>
                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>• Background: Deep Charcoal</p>
                  <p>• Accents: Vibrant Gold Yellow</p>
                  <p>• Border: Subtle Dark Lines</p>
                </div>
              </button>

              {/* Theme 2 */}
              <button
                type="button"
                onClick={() => handleProfileFieldChange('theme', 'brutalist-light')}
                className={`p-4 rounded-xl text-left border cursor-pointer transition ${
                  profile.theme === 'brutalist-light'
                    ? 'border-yellow-400 bg-yellow-400/5 text-white'
                    : 'border-zinc-800 bg-[#070707] hover:border-zinc-700 text-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider font-sans">2. Brutalist Offset</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-black outline-1 outline-white" />
                </div>
                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>• Background: Retro Pure White</p>
                  <p>• Cards: Heavy Black Shadows</p>
                  <p>• Font: Retro Tech Monospace</p>
                </div>
              </button>

              {/* Theme 3 */}
              <button
                type="button"
                onClick={() => handleProfileFieldChange('theme', 'carbon-luxury')}
                className={`p-4 rounded-xl text-left border cursor-pointer transition ${
                  profile.theme === 'carbon-luxury'
                    ? 'border-yellow-400 bg-yellow-400/5 text-white'
                    : 'border-zinc-800 bg-[#070707] hover:border-zinc-700 text-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider font-sans">3. Carbon Luxury</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-yellow-500" />
                </div>
                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>• Background: Smooth Gradients</p>
                  <p>• Cards: Glossy Frosted Glass</p>
                  <p>• Styling: Subtle Amber Glows</p>
                </div>
              </button>

              {/* Theme 4 */}
              <button
                type="button"
                onClick={() => handleProfileFieldChange('theme', 'canary-minimal')}
                className={`p-4 rounded-xl text-left border cursor-pointer transition ${
                  profile.theme === 'canary-minimal'
                    ? 'border-yellow-400 bg-yellow-450/10 text-stone-900'
                    : 'border-zinc-800 bg-[#070707] hover:border-zinc-700 text-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider font-sans text-yellow-400">4. Canary Minimal</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fde047] border border-black/30" />
                </div>
                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>• Background: Pastel Butter-Yellow</p>
                  <p>• Cards: Clean Pure White</p>
                  <p>• Feeling: Cozy, Airy & Lightweight</p>
                </div>
              </button>

              {/* Theme 5 */}
              <button
                type="button"
                onClick={() => handleProfileFieldChange('theme', 'scandi-sun')}
                className={`p-4 rounded-xl text-left border cursor-pointer transition ${
                  profile.theme === 'scandi-sun'
                    ? 'border-yellow-400 bg-yellow-450/10 text-stone-900'
                    : 'border-zinc-800 bg-[#070707] hover:border-zinc-700 text-stone-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider font-sans text-yellow-500">5. Scandi Sun</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 border border-yellow-450" />
                </div>
                <div className="text-[10px] text-stone-400 space-y-1">
                  <p>• Background: Clean Mist-Gray</p>
                  <p>• Cards: Sleek Slate-Glow</p>
                  <p>• Feeling: Light-Weight Nordic Tech</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMUNITY ACCENTS & SOCIAL CHANNELS HANDLES TAB */}
      {activeSubTab === 'socials' && (
        <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide text-yellow-400">
              Community Handle Outlets & VIP Footers
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Add direct paths to your Telegram resource channel, WhatsApp client support, YouTube profile, or direct business email inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Telegram */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                Telegram Channel Link
              </label>
              <input
                type="url"
                placeholder="e.g. https://t.me/yourusername"
                value={profile.socials.telegram || ''}
                onChange={(e) => handleSocialFieldChange('telegram', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Group / Phone Link
              </label>
              <input
                type="url"
                placeholder="e.g. https://wa.me/phone"
                value={profile.socials.whatsapp || ''}
                onChange={(e) => handleSocialFieldChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* YouTube Channel */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://youtube.com/@varadbuilds"
                value={profile.socials.youtube || ''}
                onChange={(e) => handleSocialFieldChange('youtube', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-402 text-yellow-400" />
                Instagram URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://instagram.com/varadbuilds"
                value={profile.socials.instagram || ''}
                onChange={(e) => handleSocialFieldChange('instagram', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <Twitter className="w-3.5 h-3.5 text-blue-400" />
                Twitter/X Feed URL
              </label>
              <input
                type="url"
                placeholder="https://x.com/yourhandle"
                value={profile.socials.twitter || ''}
                onChange={(e) => handleSocialFieldChange('twitter', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-stone-300 font-sans font-semibold flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Inquiry Email Coordinate
              </label>
              <input
                type="email"
                placeholder="contact@varadbuilds.com"
                value={profile.socials.email || ''}
                onChange={(e) => handleSocialFieldChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-850 rounded-lg text-xs text-stone-200 outline-none focus:border-yellow-400 font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
