import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Activity,
  Play,
  RotateCcw,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { LinkItem, AnalyticsEvent } from '../types';

interface AnalyticsDashboardProps {
  links: LinkItem[];
  events: AnalyticsEvent[];
  onTriggerSimulation: (clicksCount: number) => void;
  onResetAnalytics: () => void;
}

export default function AnalyticsDashboard({
  links,
  events,
  onTriggerSimulation,
  onResetAnalytics,
}: AnalyticsDashboardProps) {
  const [simulationVolume, setSimulationVolume] = useState<number>(35);
  const [chartTimeframe, setChartTimeframe] = useState<'7days' | 'current'>('7days');

  // Math totals
  const metrics = useMemo(() => {
    const totalViews = events.filter((e) => e.linkId === 'profile-view').length;
    const totalClicks = events.filter((e) => e.linkId !== 'profile-view').length;
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    return {
      views: Math.max(totalViews, 1), // prevent division by zero
      clicks: totalClicks,
      ctr,
    };
  }, [events]);

  // Daily statistics for Recharts (Timeline)
  const dailyTimelineData = useMemo(() => {
    const datesMap: Record<string, { dateStr: string; views: number; clicks: number }> = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Pre-fill last 7 days starting from today down
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const shortDay = dayName.substring(0, 3);
      const dateKey = d.toISOString().split('T')[0];
      datesMap[dateKey] = {
        dateStr: `${shortDay} ${d.getDate()}`,
        views: 0,
        clicks: 0,
      };
    }

    // Distribute actual events to their respective days
    events.forEach((ev) => {
      const dateKey = ev.timestamp.split('T')[0];
      if (datesMap[dateKey]) {
        if (ev.linkId === 'profile-view') {
          datesMap[dateKey].views++;
        } else {
          datesMap[dateKey].clicks++;
        }
      }
    });

    return Object.values(datesMap);
  }, [events]);

  // Traffic source stats
  const trafficSourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((ev) => {
      counts[ev.source] = (counts[ev.source] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // Device type stats
  const deviceTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((ev) => {
      counts[ev.device] = (counts[ev.device] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // Link clicked rankings
  const linkPerformanceData = useMemo(() => {
    return links
      .filter((l) => l.active)
      .map((lnk) => {
        const linkClicks = events.filter((e) => e.linkId === lnk.id).length;
        return {
          name: lnk.title.length > 25 ? `${lnk.title.substring(0, 22)}...` : lnk.title,
          clicks: linkClicks,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  }, [links, events]);

  // Colors matching White, Yellow, Black Palette
  const PIE_COLORS = ['#FACC15', '#121212', '#71717A', '#E4E4E7', '#A1A1AA'];

  return (
    <div className="space-y-6">
      {/* Simulation Box */}
      <div className="p-4 bg-zinc-950 border border-yellow-400/20 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-yellow-400 font-semibold flex items-center gap-1.5 text-sm uppercase tracking-wider font-sans">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              Creator Sandbox Controller
            </h4>
            <p className="text-xs text-stone-400 mt-1 max-w-md">
              Need data? Simulate live traffic spikes to see how the integrated analytics dashboard visualizes clicks & CTR real-time curves.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1">
              <span className="text-xs font-mono text-stone-300">Volume:</span>
              <select
                value={simulationVolume}
                onChange={(e) => setSimulationVolume(Number(e.target.value))}
                className="bg-transparent text-xs text-white outline-none font-semibold cursor-pointer"
              >
                <option value={15} className="bg-stone-900">15 Visitors</option>
                <option value={35} className="bg-stone-900">35 Visitors</option>
                <option value={75} className="bg-stone-900">75 Visitors</option>
                <option value={150} className="bg-stone-900">150 Visitors</option>
              </select>
            </div>

            <button
              onClick={() => onTriggerSimulation(simulationVolume)}
              className="px-3 py-1.5 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Simulate Visitors
            </button>

            <button
              onClick={onResetAnalytics}
              className="p-1 px-2.5 text-stone-400 hover:text-white hover:bg-stone-900 rounded-lg border border-stone-800 text-xs transition duration-200 cursor-pointer flex items-center gap-1"
              title="Reset Analytics"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-[#0E0E0E] border border-zinc-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 z-10" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400">Total Visits (Views)</span>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-sans">
                {metrics.views.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-yellow-400/10 text-yellow-500 rounded-lg">
              <Eye className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-mono font-medium">✨ Real-time logs</span>
            captured from profile views
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-[#0E0E0E] border border-zinc-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-400 z-10" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400">Total Link Clicks</span>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-sans">
                {metrics.clicks.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-stone-800/60 text-stone-300 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-mono font-medium">⚡ Click tracking</span>
            active across mobile & desktop
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-[#0E0E0E] border border-zinc-800 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-100 z-10" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-stone-400">Average Click-Through (CTR)</span>
              <h3 className="text-3xl font-extrabold text-[#FACC15] mt-1 font-sans">
                {metrics.ctr}%
              </h3>
            </div>
            <div className="p-2 bg-yellow-400/5 text-yellow-400 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-mono font-medium">🔗 Performance ratio</span>
            clicks to profile views
          </p>
        </div>
      </div>

      {/* Primary Area Chart - Clicks & Views Timeline */}
      <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h3 className="text-white font-bold text-base font-sans">Daily Performance History</h3>
            <p className="text-xs text-stone-400">Interactive timeline of views (visits) and link interactions.</p>
          </div>
          <div className="flex bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setChartTimeframe('7days')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                chartTimeframe === '7days' ? 'bg-yellow-400 text-black font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setChartTimeframe('current')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                chartTimeframe === 'current' ? 'bg-yellow-400 text-black font-semibold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Single-Day Realtime
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#faf0ca" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#faf0ca" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="dateStr" stroke="#71717a" tickLine={false} />
              <YAxis stroke="#71717a" tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="views"
                name="Visits"
                stroke="#a1a1aa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="Link Clicks"
                stroke="#FACC15"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary split grids: Clicks per Link & Pie distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Link Clicks Rankings */}
        <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-base font-sans">Individual Social & Community CTR</h3>
            <p className="text-xs text-stone-400 mb-4">Total recorded click volumes per active smart button connection.</p>
          </div>

          <div className="h-60 w-full text-xs">
            {linkPerformanceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-500 font-mono">
                No active links to display metrics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={linkPerformanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" width={110} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="clicks" name="Clicks" fill="#FACC15" radius={[0, 4, 4, 0]}>
                    {linkPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#FACC15' : index === 1 ? '#eab308' : '#ca8a04'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Traffic sources Share Pie Chart */}
        <div className="p-5 bg-[#0E0E0E] border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-base font-sans">Traffic Source Inflow</h3>
            <p className="text-xs text-stone-400 mb-4">Distribution share where visitors clicked your bio address links.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-60 text-xs">
            {events.length === 0 ? (
              <div className="text-stone-500 font-mono text-center">
                Waiting for simulated logs...
              </div>
            ) : (
              <>
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center space-y-2 text-stone-300 w-full sm:w-auto">
                  {trafficSourceData.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="font-sans font-medium text-stone-300 capitalize">{entry.name}</span>
                      <span className="font-mono text-stone-400 font-semibold ml-auto sm:ml-4">
                        ({Math.round((entry.value / events.length) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
