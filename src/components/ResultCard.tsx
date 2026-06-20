import { format, parseISO } from 'date-fns';

export interface Match {
  id: string;
  date: string;
  team1Code: string;
  team1Name: string;
  team1Score: string;
  team1Logo: string;
  team2Code: string;
  team2Name: string;
  team2Score: string;
  team2Logo: string;
  status: string;
  statusDetail: string;
  completed: boolean;
  winner?: string;
  venue: string;
  group?: string;
  stage?: string;
  team1Scorers?: string[];
  team2Scorers?: string[];
}

export function ResultCard({ m, onClick }: { m: Match; onClick?: (id: string) => void }) {
  const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && !str.includes('http');

  return (
    <div 
      onClick={() => onClick?.(m.id)}
      className={`bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-40 hover:border-slate-700/50 transition-all backdrop-blur-sm relative overflow-hidden cursor-pointer group`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center text-[11px] font-medium tracking-wider text-slate-400 mb-1">
        <span className="uppercase">{m.stage || (m.group ? `Group ${m.group}` : 'Group Stage')}</span>
        {m.status === 'LIVE' || m.statusDetail.includes('LIVE') ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            LIVE
          </span>
        ) : (
          <span>{m.date !== "LIVE" && m.date ? format(parseISO(m.date), 'MMM d, HH:mm') : '-'}</span>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-3 items-center my-auto relative z-10">
        
        {/* HOME TEAM */}
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          {isEmoji(m.team1Logo) ? (
            <span className="text-2xl drop-shadow-md">{m.team1Logo}</span>
          ) : (
            <img src={m.team1Logo || undefined} alt={m.team1Code} className="w-8 h-6 object-cover rounded-sm shadow-sm" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{m.team1Code}</span>
          
          {/* Home Goal Scorers */}
          <div className="text-[10px] text-slate-400 font-mono mt-1 min-h-[14px] leading-tight max-w-[85px] truncate">
            {m.team1Scorers && m.team1Scorers.length > 0 ? (
              m.team1Scorers.map((scorer, i) => <div key={i}>{scorer}</div>)
            ) : null}
          </div>
        </div>

        {/* CENTER SCORE */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/40 px-3 py-0.5 rounded-full mb-1">
            {m.status === 'LIVE' || m.statusDetail.includes('LIVE') ? m.statusDetail.split(' • ')[0] : m.statusDetail}
          </span>
          <span className="text-2xl font-black font-mono tracking-tight text-white mb-2">
            {m.team1Score} : {m.team2Score}
          </span>
        </div>

        {/* AWAY TEAM */}
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          {isEmoji(m.team2Logo) ? (
            <span className="text-2xl drop-shadow-md">{m.team2Logo}</span>
          ) : (
            <img src={m.team2Logo || undefined} alt={m.team2Code} className="w-8 h-6 object-cover rounded-sm shadow-sm" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{m.team2Code}</span>
          
          {/* Away Goal Scorers */}
          <div className="text-[10px] text-slate-400 font-mono mt-1 min-h-[14px] leading-tight max-w-[85px] truncate">
            {m.team2Scorers && m.team2Scorers.length > 0 ? (
              m.team2Scorers.map((scorer, i) => <div key={i}>{scorer}</div>)
            ) : null}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="text-[10px] text-slate-500 text-center truncate border-t border-slate-800/50 pt-2 mt-1">
        📍 {m.venue || '-'}
      </div>
    </div>
  );
}
