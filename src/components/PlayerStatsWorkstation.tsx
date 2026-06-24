import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface PlayerStat {
  rank: number;
  name: string;
  team: string;
  teamLogo: string;
  value: string | number;
  headshot?: string;
}

interface StatCategory {
  category: string;
  categoryLabel: string;
  players: PlayerStat[];
}

export default function PlayerStatsWorkstation() {
  const [statsCategories, setStatsCategories] = useState<StatCategory[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/live');
      const data = await response.json();
      if (data.playerStats) {
        setStatsCategories(data.playerStats);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      // Silently handle fetch errors during development
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Real-time automatic background synchronization loop (every 30 seconds as requested)
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEmojiForCategory = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('goal')) return '⚽';
    if (name.includes('assist')) return '👟';
    if (name.includes('yellow')) return '🟨';
    if (name.includes('red')) return '🟥';
    return '📊';
  };

  const getThemeForCategory = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('goal')) return { text: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-900/30' };
    if (name.includes('assist')) return { text: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-900/30' };
    if (name.includes('yellow')) return { text: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-900/30' };
    if (name.includes('red')) return { text: 'text-red-400', bg: 'bg-red-950/40 border-red-900/30' };
    return { text: 'text-gray-400', bg: 'bg-gray-800/40 border-gray-700/30' };
  };

  return (
    <div className="bg-[#060a0f] text-white p-6 rounded-xl font-sans relative">
      {/* Header Pipeline Status */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-[#38bdf8] flex items-center gap-2">
            <Activity className="w-5 h-5" />
            LIVE STATS TRACKER
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Auto-refresh active (30s interval)
          </p>
        </div>
        <div className="text-[10px] bg-[#0f172a] px-3 py-1.5 rounded-lg border border-gray-800 text-slate-300 font-mono tracking-wider uppercase">
          Synced: {lastUpdated}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 text-sm">
          <Activity className="w-4 h-4 animate-spin mr-2" /> Pulling real-time stats...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statsCategories.filter(c => c.players && c.players.length > 0).slice(0, 4).map((cat, idx) => {
            const theme = getThemeForCategory(cat.categoryLabel);
            return (
              <div key={idx} className="bg-[#0b131f] p-4 rounded-xl border border-gray-800/80 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase flex items-center gap-2">
                  <span>{getEmojiForCategory(cat.categoryLabel)}</span> {cat.categoryLabel}
                </h3>
                <div className="space-y-2">
                  {cat.players.slice(0, 5).map((player, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between bg-[#0f1a2a]/80 p-2.5 rounded-lg border border-gray-800/50 hover:bg-[#121f33] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-600 w-4 text-center">{player.rank}</span>
                        {player.headshot ? (
                          <img src={player.headshot} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-gray-700 bg-gray-900" />
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800 flex items-center justify-center text-xs">👤</div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-gray-200">
                            {player.name}
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                            {player.teamLogo && <img src={player.teamLogo} alt={player.team} className="w-3 h-3 object-contain" />}
                            {player.team}
                          </div>
                        </div>
                      </div>
                      <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded border ${theme.bg} ${theme.text}`}>
                        {player.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
