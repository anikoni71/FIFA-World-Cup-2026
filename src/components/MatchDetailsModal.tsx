import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Timer, CircleDot, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MatchDetailsModalProps {
  matchId: string | null;
  onClose: () => void;
}

export default function MatchDetailsModal({ matchId, onClose }: MatchDetailsModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matchId) {
      setLoading(true);
      fetch(`/api/match-details?id=${matchId}`)
        .then(res => res.json())
        .then(data => {
          setDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setDetails(null);
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
              ) : details ? (
                <div className="space-y-8">
                  {/* Scoreboard Area */}
                  <div className="flex items-center justify-between gap-4 py-8 px-4 bg-gradient-to-b from-gray-900/50 to-transparent rounded-3xl border border-gray-800/50">
                    <div className="flex flex-col items-center gap-3 flex-1 text-center">
                      <img src={home?.team?.logo} alt="" className="w-16 h-16 object-contain" />
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
                      <img src={away?.team?.logo} alt="" className="w-16 h-16 object-contain" />
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
                <div className="text-center py-20">
                  <p className="text-sm text-gray-600">Failed to load detailed analytics.</p>
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
