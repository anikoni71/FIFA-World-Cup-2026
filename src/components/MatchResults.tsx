import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Zap, CalendarDays, Filter } from 'lucide-react';

export type MatchResult = {
  id: string;
  team1Code: string;
  team1Logo?: string;
  team2Code: string;
  team2Logo?: string;
  team1Score: string;
  team2Score: string;
  status: string;
  statusDetail: string;
  completed: boolean;
  winner?: string;
  date?: string;
  startTime?: string;
  venue?: string;
  stage?: string;
  group?: string;
};

function formatBDT(isoDate: string) {
  try {
    const date = parseISO(isoDate);
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const bdt = new Date(utc + 6 * 3600000); // BDT is UTC+6
    return {
      date: format(bdt, 'dd MMM yyyy'),
      time: format(bdt, 'h:mm a'),
      dayLabel: format(bdt, 'EEEE, dd MMM'),
    };
  } catch {
    return null;
  }
}

function MatchCard({ match }: { match: MatchResult }) {
  const isLive = match.status === 'in';
  const isFinished = match.completed;
  const bdt = formatBDT(match.date || match.startTime || '');

  return (
    <div className={`bg-card border rounded-xl p-3 sm:p-4 ${
      isLive ? 'border-primary/50 ring-1 ring-primary/20' :
      isFinished ? 'border-border/50' : 'border-border'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-semibold">{match.stage || (match.group ? `Group ${match.group}` : '')}</span>
        <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
          isLive ? 'bg-primary/20 text-primary animate-pulse' :
          isFinished ? 'bg-muted text-muted-foreground' :
          'bg-secondary/20 text-secondary'
        }`}>
          {isLive && <Zap className="w-2.5 h-2.5" />}
          {isFinished && <CheckCircle2 className="w-2.5 h-2.5" />}
          {!isLive && !isFinished && <Clock className="w-2.5 h-2.5" />}
          {isFinished ? 'FT' : isLive ? match.statusDetail : 'Scheduled'}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          {match.team1Logo && <img src={match.team1Logo} alt={match.team1Code} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />}
          <span className={`text-[10px] sm:text-xs font-bold ${match.winner === match.team1Code ? 'text-primary' : ''}`}>
            {match.team1Code}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`text-xl sm:text-2xl font-extrabold ${match.winner === match.team1Code ? 'text-primary' : ''}`}>
            {match.status === 'pre' ? '-' : match.team1Score}
          </span>
          <span className="text-muted-foreground text-xs">:</span>
          <span className={`text-xl sm:text-2xl font-extrabold ${match.winner === match.team2Code ? 'text-primary' : ''}`}>
            {match.status === 'pre' ? '-' : match.team2Score}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          {match.team2Logo && <img src={match.team2Logo} alt={match.team2Code} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />}
          <span className={`text-[10px] sm:text-xs font-bold ${match.winner === match.team2Code ? 'text-primary' : ''}`}>
            {match.team2Code}
          </span>
        </div>
      </div>

      {/* Date + Venue */}
      {bdt && (
        <div className="text-center mt-2 text-[9px] sm:text-[10px] text-muted-foreground space-y-0.5">
          <div>{bdt.date} • {bdt.time} BDT</div>
          {match.venue && <div className="truncate">📍 {match.venue}</div>}
        </div>
      )}
    </div>
  );
}

export default function MatchResults({ matches }: { matches: MatchResult[] }) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const filtered = useMemo(() => {
    if (filter === 'completed') return matches.filter(m => m.completed);
    if (filter === 'upcoming') return matches.filter(m => !m.completed);
    return matches;
  }, [matches, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, MatchResult[]>();
    for (const m of filtered) {
      const bdt = formatBDT(m.date || m.startTime || '');
      const key = bdt?.dayLabel || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (!matches.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">Match results will appear here</p>
        <p className="text-sm">Results update as matches are played</p>
      </div>
    );
  }

  const completedCount = matches.filter(m => m.completed).length;
  const upcomingCount = matches.filter(m => !m.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold">All Match Results</h2>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {matches.length} matches
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {[
            { key: 'all' as const, label: `All (${matches.length})` },
            { key: 'completed' as const, label: `Played (${completedCount})` },
            { key: 'upcoming' as const, label: `Upcoming (${upcomingCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {grouped.map(([day, dayMatches]) => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground px-2 bg-background">
                {day}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {dayMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
