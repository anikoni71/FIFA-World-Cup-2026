import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Clock, MapPin } from 'lucide-react';
import { MatchData } from './ScheduleWorkstation';

interface MatchDetailsModalProps {
  match: MatchData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleMatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ match, isOpen, onClose }) => {
  if (!isOpen || !match) return null;

  const isLive = match.status.includes("'") || match.status === "LIVE" || match.date === "LIVE";
  const isFT = match.status === "FT";

  const homeScoreNum = typeof match.homeScore === 'string' ? parseInt(match.homeScore) || 0 : match.homeScore;
  const awayScoreNum = typeof match.awayScore === 'string' ? parseInt(match.awayScore) || 0 : match.awayScore;

  // Real-time custom summary generator based on match conditions
  const generateSummary = () => {
    if (isFT) {
      if (homeScoreNum > awayScoreNum) {
        return `A decisive performance from ${match.home}. They controlled the tempo effectively, capitalizing on defensive transitions to secure the victory over ${match.away}.`;
      } else if (awayScoreNum > homeScoreNum) {
        return `${match.away} executed an excellent tactical blueprint, frustrating ${match.home}'s midfield build-up and safely securing the three points.`;
      }
      return `A highly tactical chess match between ${match.home} and ${match.away}. Both systems canceled each other out in deep defensive blocks, resulting in a well-fought draw.`;
    }
    if (isLive) {
      return `The match between ${match.home} and ${match.away} is dynamically altering tactics right now. High defensive lines and rapid counter-attacks are defining this phase of play. Check back at full-time for a complete analytical breakdown.`;
    }
    return `Tactical preview for ${match.home} vs ${match.away}: Expect an intense, high-pressing setup from both camps. Midfield possession retention and wing-back transitional speeds will be the deciding factors.`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl overflow-hidden border bg-[#121824] border-[#1e293b] rounded-2xl shadow-2xl text-gray-200"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0b0f19]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#38bdf8] uppercase">
                {match.group} • Match Analysis
              </span>
              {isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded animate-pulse">
                  <Activity className="w-3 h-3" /> LIVE
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 transition rounded-lg hover:bg-slate-800 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Scoreboard Section */}
          <div className="p-6 bg-[#0b0f19]/40 border-b border-[#1e293b]">
            <div className="flex items-center justify-between gap-4">
              {/* Home Side */}
              <div className="flex flex-col items-center flex-1 text-center">
                <span className="text-4xl mb-2 filter drop-shadow-sm select-none">{match.homeFlag}</span>
                <span className="text-lg font-black tracking-wide text-white uppercase">{match.home}</span>
                <div className="mt-3 space-y-1 text-xs text-slate-400 min-h-[40px]">
                  {match.homeScorers?.map((scorer, i) => <div key={i} className="animate-fade-in">{scorer}</div>)}
                </div>
              </div>

              {/* Central Real-Time Scorebox */}
              <div className="flex flex-col items-center justify-center px-5 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl min-w-[110px]">
                <motion.span 
                  key={`${match.homeScore}-${match.awayScore}`}
                  initial={{ scale: 1.2, color: '#38bdf8' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-2xl font-black tracking-wider text-white"
                >
                  {isLive || isFT ? `${match.homeScore} : ${match.awayScore}` : '- : -'}
                </motion.span>
                <span className={`text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded uppercase tracking-wider ${isLive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800/80 text-gray-400'}`}>
                  {match.status}
                </span>
              </div>

              {/* Away Side */}
              <div className="flex flex-col items-center flex-1 text-center">
                <span className="text-4xl mb-2 filter drop-shadow-sm select-none">{match.awayFlag}</span>
                <span className="text-lg font-black tracking-wide text-white uppercase">{match.away}</span>
                <div className="mt-3 space-y-1 text-xs text-slate-400 min-h-[40px]">
                  {match.awayScorers?.map((scorer, i) => <div key={i} className="animate-fade-in">{scorer}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Tactical Analysis Blocks */}
          <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto scrollbar-none">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <Activity className="w-4 h-4 text-[#38bdf8]" /> Tactical Summary
              </h4>
              <p className="text-sm leading-relaxed text-gray-300 bg-[#0b0f19] p-4 border border-[#1e293b] rounded-xl shadow-inner">
                {generateSummary()}
              </p>
            </div>

            {/* Stadium & Timings Footer Matrix */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex items-center gap-3 bg-[#0b0f19]/30 border border-[#1e293b]/50 p-3 rounded-xl">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Kickoff Time (BST)</div>
                  <div className="text-xs text-gray-300 font-medium">{match.date} • {match.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0b0f19]/30 border border-[#1e293b]/50 p-3 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Venue Location</div>
                  <div className="text-xs text-gray-300 font-medium truncate max-w-[190px]">{match.stadium}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
