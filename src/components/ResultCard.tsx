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
}

export function ResultCard({ m, onClick }: { m: Match; onClick?: (id: string) => void }) {
  const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && !str.includes('http');

  return (
    <div 
      onClick={() => onClick?.(m.id)}
      className={`bg-[#111827] border border-gray-800 rounded-xl p-3 shadow-sm flex flex-col justify-between h-full hover:border-primary/50 hover:bg-[#1f2937]/50 transition-all cursor-pointer group`}
    >
      <div>
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800/50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{m.stage || (m.group ? `Group ${m.group}` : 'Group Stage')}</span>
          <span className="text-[10px] text-gray-500">{m.date ? format(parseISO(m.date), 'MMM d') : '-'}</span>
        </div>
        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              {isEmoji(m.team1Logo) ? (
                <span className="text-sm">{m.team1Logo}</span>
              ) : (
                <img src={m.team1Logo} alt={m.team1Code} className="w-4 h-4 object-contain shrink-0" />
              )}
              <span className="font-bold text-xs truncate max-w-[120px] text-gray-200">{m.team1Name}</span>
            </div>
            <span className={`font-black text-sm ${m.winner === m.team1Code ? "text-primary" : "text-gray-400"}`}>{m.team1Score}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              {isEmoji(m.team2Logo) ? (
                <span className="text-sm">{m.team2Logo}</span>
              ) : (
                <img src={m.team2Logo} alt={m.team2Code} className="w-4 h-4 object-contain shrink-0" />
              )}
              <span className="font-bold text-xs truncate max-w-[120px] text-gray-200">{m.team2Name}</span>
            </div>
            <span className={`font-black text-sm ${m.winner === m.team2Code ? "text-primary" : "text-gray-400"}`}>{m.team2Score}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[8px] text-gray-500 font-medium flex items-center justify-between italic">
        <span className="truncate mr-2">{m.statusDetail}</span>
        <span className="truncate max-w-[80px]">{m.venue}</span>
      </div>
    </div>
  );
}
