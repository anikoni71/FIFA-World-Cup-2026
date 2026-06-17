import { GetLiveDataOutputType } from '@/lib/api';
import { Zap, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type Match = GetLiveDataOutputType['todayMatches'][0];

function formatBDT(isoDate: string) {
  if (!isoDate) return null;
  try {
    const date = parseISO(isoDate);
    // Convert to BDT (UTC+6) manually or just format it logically
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const bdt = new Date(utc + 6 * 3600000);
    const timeStr = format(bdt, 'h:mm a');
    const dateStr = format(bdt, 'dd MMM');
    return { timeStr, dateStr };
  } catch {
    return null;
  }
}

function TeamSide({ logo, code, isWinner }: { logo: string; code: string; isWinner: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {logo ? (
        <img src={logo} alt={code} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center font-bold">
          ?
        </div>
      )}
      <span className={`text-sm sm:text-base font-bold ${isWinner ? 'text-primary' : ''}`}>
        {code || 'TBD'}
      </span>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === 'in';
  const isFinished = match.completed;
  const isPre = match.status === 'pre';
  const bdtTime = formatBDT(match.startTime);

  return (
    <div className={`bg-card border rounded-xl p-2.5 sm:p-4 ${
      isLive ? 'border-primary/50 ring-1 ring-primary/20' :
      isFinished ? 'border-border/50' : 'border-border'
    }`}>
      {/* Header: Group + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted-foreground font-semibold tracking-wide">
          {match.group ? `Group ${match.group}` : 'Knockout'}
        </span>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isLive ? 'bg-primary/20 text-primary animate-pulse' :
          isFinished ? 'bg-muted text-muted-foreground' :
          'bg-secondary/20 text-secondary'
        }`}>
          {isLive && <Zap className="w-3 h-3" />}
          {isFinished && <CheckCircle2 className="w-3 h-3" />}
          {isPre && <Clock className="w-3 h-3" />}
          {isFinished ? 'FT' : isLive ? match.statusDetail : 'Scheduled'}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between">
        <TeamSide logo={match.team1Logo} code={match.team1Code}
          isWinner={match.winner === match.team1Code} />

        <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3">
          <span className={`text-lg sm:text-2xl font-extrabold ${
            isFinished && match.winner === match.team1Code ? 'text-primary' : ''
          }`}>{isPre ? '-' : match.team1Score}</span>
          <span className="text-muted-foreground text-xs sm:text-sm">:</span>
          <span className={`text-lg sm:text-2xl font-extrabold ${
            isFinished && match.winner === match.team2Code ? 'text-primary' : ''
          }`}>{isPre ? '-' : match.team2Score}</span>
        </div>

        <TeamSide logo={match.team2Logo} code={match.team2Code}
          isWinner={match.winner === match.team2Code} />
      </div>

      {/* Time (BDT) for scheduled matches */}
      {isPre && bdtTime && (
        <div className="text-center mt-2">
          <span className="text-xs font-semibold text-accent">
            {bdtTime.timeStr} BDT
          </span>
          <span className="text-[10px] text-muted-foreground ml-1.5">
            {bdtTime.dateStr}
          </span>
        </div>
      )}

      {/* Venue */}
      {match.venue && (
        <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-muted-foreground truncate">
          <MapPin className="w-3 h-3 shrink-0 text-accent" />
          <span className="truncate">{match.venue}</span>
        </div>
      )}
    </div>
  );
}

export default function LiveScores({ matches }: { matches: Match[] }) {
  if (!matches || matches.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {matches.map(m => <MatchCard key={m.id} match={m} />)}
    </div>
  );
}
