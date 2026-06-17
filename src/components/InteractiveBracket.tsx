import { GetLiveDataOutputType } from '@/lib/api';
import { knockoutMatches, teams } from '@/data/teams';
import { resolveBracket } from '@/lib/bracketResolver';
import { Trophy } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  standings: GetLiveDataOutputType['standings'];
  knockoutResults: GetLiveDataOutputType['knockoutResults'];
}

export default function InteractiveBracket({ standings, knockoutResults }: Props) {
  const { resolveNode, matchWinners } = resolveBracket(standings, knockoutResults);

  const getTeamLabel = (teamCode: string) => {
    return teams[teamCode]?.name || teamCode;
  };

  const getTeamFlag = (teamCode: string) => {
    return teams[teamCode]?.flag || ' ';
  };

  const getScore = (mId: string, teamCode: string) => {
    // If not TBD and not placeholder like 1A, find result
    if (teamCode === 'TBD' || teamCode.length <= 2) return '-'; 
    const match = knockoutMatches.find(m => m.id === mId);
    if (!match) return '-';
    // This requires cross referencing the knockout result by actual playing teams.
    const t1Resolved = resolveNode(match.team1);
    const t2Resolved = resolveNode(match.team2);
    
    const res = knockoutResults?.find(k => 
      (k.team1Code === t1Resolved && k.team2Code === t2Resolved) ||
      (k.team2Code === t1Resolved && k.team1Code === t2Resolved)
    );
    if (!res) return '-';
    if (res.team1Code === teamCode) return res.team1Score;
    if (res.team2Code === teamCode) return res.team2Score;
    return '-';
  };

  const MatchBox = ({ mId, reverse = false, stageName = '' }: { mId: string, reverse?: boolean, stageName?: string }) => {
    const match = knockoutMatches.find(m => m.id === mId);
    if (!match) return <div className="h-[60px]" />;

    const t1 = resolveNode(match.team1);
    const t2 = resolveNode(match.team2);
    const s1 = getScore(mId, t1);
    const s2 = getScore(mId, t2);
    const w = matchWinners.get(mId);

    return (
      <div className="flex flex-col relative my-1 min-w-[140px] sm:min-w-[160px]">
        {stageName && <div className="text-[9px] text-muted-foreground uppercase mb-1 font-bold tracking-wider">{stageName}</div>}
        
        {/* Match description label - e.g., 'R32-1 - 1E VS 3ABCDF' */}
        {!stageName && mId.startsWith('R32') && (
          <div className="text-[8px] sm:text-[9px] text-muted-foreground uppercase mb-1 tracking-wider truncate">
            {mId} — {match.team1} VS {match.team2}
          </div>
        )}

        <div className="bg-card/80 border border-border/60 rounded-xl overflow-hidden flex flex-col text-[10px] w-full hover:border-primary/50 transition-colors shadow-sm">
          <div className={cn("flex items-center justify-between px-2.5 py-1.5 border-b border-border/40", w === t1 && "bg-primary/5 font-bold text-primary")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-sm shrink-0">{getTeamFlag(t1)}</span>
              <span className={cn("truncate", t1 === 'TBD' && "text-muted-foreground font-normal")}>{t1}</span>
            </div>
            <span className={cn("tabular-nums", w === t1 ? "text-primary" : "text-muted-foreground")}>{s1}</span>
          </div>
          <div className={cn("flex items-center justify-between px-2.5 py-1.5", w === t2 && "bg-primary/5 font-bold text-primary")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-sm shrink-0">{getTeamFlag(t2)}</span>
              <span className={cn("truncate", t2 === 'TBD' && "text-muted-foreground font-normal")}>{t2}</span>
            </div>
            <span className={cn("tabular-nums", w === t2 ? "text-primary" : "text-muted-foreground")}>{s2}</span>
          </div>
        </div>

        {/* Date and Venue info */}
        {match.date && (
          <div className="text-[8px] text-muted-foreground mt-1 truncate">
            {match.date} • {match.time} • {match.venue}
          </div>
        )}
      </div>
    );
  };

  const Column = ({ title, matchIds, reverse = false, align = 'center' }: { title?: string, matchIds: string[], reverse?: boolean, align?: 'center'|'between'|'around' }) => (
    <div className={cn("flex flex-col gap-2 relative z-10 w-[140px] sm:w-[160px]", 
      align === 'center' ? 'justify-center' : align === 'between' ? 'justify-between' : 'justify-around'
    )}>
      {title && <h3 className="text-center text-xs font-bold text-muted-foreground mb-4 mt-6 absolute -top-10 w-full">{title}</h3>}
      {matchIds.map(id => <MatchBox key={id} mId={id} reverse={reverse} />)}
    </div>
  );

  return (
    <div className="w-full bg-[#111318]/5 rounded-xl border border-border/20 p-4 sm:p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Automated Bracket — Live from Standings</h2>
        <div className="text-[10px] flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full border border-current" /> Auto-updates from real-time group standings
        </div>
      </div>
      
      <div className="flex gap-4 sm:gap-6 min-w-[1200px] pb-12 relative items-stretch">
        {/* LEFT SIDE */}
        <Column matchIds={['R32-1', 'R32-2', 'R32-3', 'R32-4', 'R32-5', 'R32-6', 'R32-7', 'R32-8']} align="around" title="ROUND OF 32" />
        <Column matchIds={['R16-1', 'R16-2', 'R16-3', 'R16-4']} align="around" title="ROUND OF 16" />
        <Column matchIds={['QF-1', 'QF-2']} align="around" title="QUARTER-FINAL" />
        <Column matchIds={['SF-1']} align="center" title="SEMI-FINAL" />

        {/* CENTER FINAL */}
        <div className="flex flex-col justify-center items-center gap-4 min-w-[180px] z-10">
          <div className="flex flex-col items-center">
            <Trophy className="w-8 h-8 text-accent mb-2" />
            <span className="font-black text-accent tracking-widest text-sm">FINAL</span>
          </div>
          <MatchBox mId="F" stageName="FINAL" />
          
          <div className="mt-8 relative origin-top">
             <MatchBox mId="TP" stageName="THIRD PLACE PLAY-OFF" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <Column matchIds={['SF-2']} reverse align="center" title="SEMI-FINAL" />
        <Column matchIds={['QF-3', 'QF-4']} reverse align="around" title="QUARTER-FINAL" />
        <Column matchIds={['R16-5', 'R16-6', 'R16-7', 'R16-8']} reverse align="around" title="ROUND OF 16" />
        <Column matchIds={['R32-9', 'R32-10', 'R32-11', 'R32-12', 'R32-13', 'R32-14', 'R32-15', 'R32-16']} reverse align="around" title="ROUND OF 32" />

        {/* Background connection lines could go here via robust SVGs, 
            but CSS borders + absolute positioning scales better. 
            For now, placing flex items closely simulates the bracket visual flow without complex SVGs. */}
      </div>
    </div>
  );
}
