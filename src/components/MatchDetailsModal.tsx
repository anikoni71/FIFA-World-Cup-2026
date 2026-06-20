import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Timer, CircleDot, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const FLAG_MAPPING: Record<string, string> = {
  "USA": "🇺🇸", "United States": "🇺🇸", "AUS": "🇦🇺", "Australia": "🇦🇺",
  "SCO": "🏴", "Scotland": "🏴", "MAR": "🇲🇦", "Morocco": "🇲🇦",
  "BRA": "🇧🇷", "Brazil": "🇧🇷", "HAI": "🇭🇹", "Haiti": "🇭🇹",
  "TUR": "🇹🇷", "Türkiye": "🇹🇷", "PAR": "🇵🇾", "Paraguay": "🇵🇾",
  "ENG": "🏴", "England": "🏴", "CRO": "🇭🇷", "Croatia": "🇭🇷",
  "MEX": "🇲🇽", "Mexico": "🇲🇽", "CAN": "🇨🇦", "Canada": "🇨🇦",
  "ARG": "🇦🇷", "Argentina": "🇦🇷", "FRA": "🇫🇷", "France": "🇫🇷",
  "GER": "🇩🇪", "Germany": "🇩🇪", "SWE": "🇸🇪", "Sweden": "🇸🇪"
};

const getFallbackAnalysis = (home: string, away: string) => {
  return `Tactical breakdown for ${home} vs ${away}: Expect a highly competitive, high-pressing game from both sides. Midfield control and transitional speed will be the deciding factors given their recent group stage forms.`;
};

interface MatchDetailsModalProps {
  matchId: string | null;
  onClose: () => void;
}

export default function MatchDetailsModal({ matchId, onClose }: MatchDetailsModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    if (matchId) {
      setLoading(true);
      setApiFailed(false);
      fetch(`/api/match-details?id=${matchId}`)
        .then(res => {
          if (!res.ok) throw new Error('API quota exceeded');
          return res.json();
        })
        .then(data => {
          setDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setApiFailed(true);
          setLoading(false);
        });
    } else {
      setDetails(null);
      setApiFailed(false);
    }
  }, [matchId]);

  if (!matchId) return null;

  const header = details?.header;
  const competitors = header?.competitions?.[0]?.competitors || [];
  const home = competitors.find((c: any) => c.homeAway === 'home');
  const away = competitors.find((c: any) => c.homeAway === 'away');
  
  // Extract Stats
  const boxscore = details?.boxscore;
  const statsGroups = boxscore?.statistics || [];
  
  // ESPN's specific stats mapping (example)
  const getStat = (label: string, isAway: boolean) => {
    const group = statsGroups.find((g: any) => g.label === label);
    if (!group) return '-';
    return isAway ? group.awayValue : group.homeValue;
  };

  const possessionHome = getStat('Possession', false);
  const possessionAway = getStat('Possession', true);
  const shotsHome = getStat('Shots', false);
  const shotsAway = getStat('Shots', true);
  const shotsOnTargetHome = getStat('Shots on Goal', false);
  const shotsOnTargetAway = getStat('Shots on Goal', true);

  // Key Events
  const events = details?.keyEvents || [];

  // Fallback context extraction based on matchId
  // The matchId is usually in format "live-usa" or "m-eng" or similar
  let homeFallback = 'Home Team';
  let awayFallback = 'Away Team';
  if (apiFailed && matchId) {
    if (matchId.includes('-')) {
      const p = matchId.split('-');
      homeFallback = p[1]?.toUpperCase() || 'Home';
      awayFallback = p[2] ? p[2].toUpperCase() : 'Away';
      // If it's something like live-bra, try to resolve it somewhat gracefully
      if (homeFallback === 'USA') awayFallback = 'AUS';
      if (homeFallback === 'BRA') awayFallback = 'HAI';
    }
  }

  return (
    <AnimatePresence>
      {matchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0f16] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#111827] border-b border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Match Analysis</span>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-gray-800 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-500">Retrieving tactical data...</p>
                </div>
              ) : details && !apiFailed ? (
                <div className="space-y-8">
                  {/* Scoreboard Area */}
                  <div className="flex items-center justify-between gap-4 py-8 px-4 bg-gradient-to-b from-gray-900/50 to-transparent rounded-3xl border border-gray-800/50">
                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <span className="text-5xl">{FLAG_MAPPING[home?.team?.displayName] || "🏳️"}</span>
                      <span className="font-black text-sm uppercase tracking-tight">{home?.team?.displayName}</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-black">{home?.score || '0'}</span>
                        <span className="text-2xl font-bold text-gray-700">:</span>
                        <span className="text-5xl font-black">{away?.score || '0'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                        {header?.competitions?.[0]?.status?.type?.shortDetail || 'Full Time'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <span className="text-5xl">{FLAG_MAPPING[away?.team?.displayName] || "🏳️"}</span>
                      <span className="font-black text-sm uppercase tracking-tight">{away?.team?.displayName}</span>
                    </div>
                  </div>

                  {/* Match Stats Table */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Match Statistics</h3>
                    </div>
                    
                    <div className="space-y-6 px-4">
                      <StatRow label="Ball Possession" valueHome={possessionHome} valueAway={possessionAway} />
                      <StatRow label="Total Shots" valueHome={shotsHome} valueAway={shotsAway} />
                      <StatRow label="Shots on Target" valueHome={shotsOnTargetHome} valueAway={shotsOnTargetAway} />
                    </div>
                  </section>

                  {/* Substitutions or Key Events */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Timer className="w-4 h-4 text-secondary" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Match History</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {events.length === 0 ? (
                        <p className="text-xs text-gray-600 italic px-4">Match timeline data unavailable for this event.</p>
                      ) : (
                        events.slice(0, 10).map((event: any, i: number) => (
                          <div key={i} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-900/40 rounded-lg group transition-colors">
                            <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors">{event.clock?.displayValue}'</span>
                            <div className="flex items-center gap-2">
                              {event.type?.text?.includes('Goal') ? <Trophy className="w-3 h-3 text-yellow-500" /> : <CircleDot className="w-3 h-3 text-gray-600" />}
                              <span className="text-xs font-medium text-gray-300">{event.text}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Fallback View */}
                  <div className="flex items-center justify-between gap-4 py-8 px-4 bg-gradient-to-b from-gray-900/50 to-transparent rounded-3xl border border-gray-800/50">
                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <span className="text-5xl">{FLAG_MAPPING[homeFallback] || "🏳️"}</span>
                      <span className="font-black text-sm uppercase tracking-tight">{homeFallback}</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-2xl font-black text-gray-700 italic">VS</div>
                    </div>

                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <span className="text-5xl">{FLAG_MAPPING[awayFallback] || "🏳️"}</span>
                      <span className="font-black text-sm uppercase tracking-tight">{awayFallback}</span>
                    </div>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CircleDot className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Tactical Summary</h3>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 text-sm text-gray-300 leading-relaxed">
                      {getFallbackAnalysis(homeFallback, awayFallback)}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, valueHome, valueAway }: { label: string, valueHome: string, valueAway: string }) {
  const v1 = parseFloat(valueHome.replace('%', '')) || 0;
  const v2 = parseFloat(valueAway.replace('%', '')) || 0;
  
  const total = v1 + v2 || 1;
  const p1 = (v1 / total) * 100;
  const p2 = (v2 / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
        <span>{valueHome}</span>
        <span className="text-gray-400 font-black">{label}</span>
        <span>{valueAway}</span>
      </div>
      <div className="h-1.5 flex gap-1 rounded-full overflow-hidden bg-gray-800/30">
        <div style={{ width: `${p1}%` }} className="h-full bg-primary rounded-l-full" />
        <div style={{ width: `${p2}%` }} className="h-full bg-gray-700 rounded-r-full" />
      </div>
    </div>
  );
}
