import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Clock, MapPin } from 'lucide-react';
import { Match } from './ResultCard';

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchDetailsModal({ match, isOpen, onClose }: MatchDetailsModalProps) {
  if (!isOpen || !match) return null;

  const isLive = match.status === "LIVE" || match.date === "LIVE" || match.statusDetail.includes("'") || match.statusDetail.includes('LIVE');
  const isFT = match.status === "FT" || match.completed;
  
  const homeScoreNum = parseInt(match.team1Score) || 0;
  const awayScoreNum = parseInt(match.team2Score) || 0;

  // Generates real-time tactical commentary based on the actual live teams and scores
  const generateTacticalSummary = () => {
    if (isFT) {
      if (homeScoreNum > awayScoreNum) {
        return `Match Analysis: ${match.team1Name} secured a definitive victory over ${match.team2Name}. Their high-pressing transition schemes completely disrupted the away block, keeping possession controlled throughout the final third.`;
      } else if (awayScoreNum > homeScoreNum) {
        return `Match Analysis: An incredible tactical display by ${match.team2Name}, capitalizing on counter-attacking opportunities to break through ${match.team1Name}'s backline and defensive structure.`;
      }
      return `Match Analysis: A rigid, highly tactical stalemate between ${match.team1Name} and ${match.team2Name}. Both squads maintained compact midfields, canceling out creative build-ups.`;
    }
    
    return `Tactical breakdown for ${match.team1Name} vs ${match.team2Name}: Expect a highly competitive, high-pressing game from both sides. Midfield control and transitional speed will be the deciding factors given their recent group stage forms.`;
  };

  const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && !str.includes('http');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl overflow-hidden border bg-[#121824] border-[#1e293b] rounded-2xl shadow-2xl text-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0b0f19]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#38bdf8] uppercase">
                {match.group ? `Group ${match.group}` : 'Tournament'} • MATCH ANALYSIS
              </span>
              {isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded animate-pulse">
                  🔴 LIVE
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

          {/* Teams & Real-Time Scores */}
          <div className="p-8 bg-[#0b0f19]/40 border-b border-[#1e293b]">
            <div className="flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1 text-center">
                {isEmoji(match.team1Logo) ? (
                  <span className="text-5xl mb-3 filter drop-shadow-md">{match.team1Logo || '🏳️'}</span>
                ) : (
                  <img src={match.team1Logo || undefined} alt={match.team1Code} className="w-16 h-12 object-cover rounded shadow mb-3" />
                )}
                <span className="text-xl font-black tracking-wide text-white uppercase">{match.team1Name || 'Home Team'}</span>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  {match.team1Scorers?.map((scorer, i) => <div key={i}>{scorer}</div>)}
                </div>
              </div>

              {/* Verses / Live Score Box */}
              <div className="flex flex-col items-center justify-center px-6 py-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl min-w-[120px]">
                <span className="text-2xl font-black tracking-wider text-white">
                  {isLive || isFT ? `${match.team1Score} : ${match.team2Score}` : 'VS'}
                </span>
                <span className="text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-gray-400 text-center">
                  {match.statusDetail || match.status}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1 text-center">
                {isEmoji(match.team2Logo) ? (
                  <span className="text-5xl mb-3 filter drop-shadow-md">{match.team2Logo || '🏳️'}</span>
                ) : (
                  <img src={match.team2Logo || undefined} alt={match.team2Code} className="w-16 h-12 object-cover rounded shadow mb-3" />
                )}
                <span className="text-xl font-black tracking-wide text-white uppercase">{match.team2Name || 'Away Team'}</span>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  {match.team2Scorers?.map((scorer, i) => <div key={i}>{scorer}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Body */}
          <div className="p-6 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38bdf8] mb-3">
                <Activity className="w-4 h-4" /> Tactical Summary
              </h4>
              <p className="text-sm leading-relaxed text-gray-300 bg-[#0b0f19] p-4 border border-[#1e293b] rounded-xl">
                {generateTacticalSummary()}
              </p>
            </div>

            {/* Match Metadata Matrix */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-[#0b0f19]/30 border border-[#1e293b]/50 p-3 rounded-xl">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Schedule Time</div>
                  <div className="text-xs text-gray-300 font-medium">{match.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0b0f19]/30 border border-[#1e293b]/50 p-3 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Stadium Venue</div>
                  <div className="text-xs text-gray-300 font-medium truncate max-w-[180px]">{match.venue}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
