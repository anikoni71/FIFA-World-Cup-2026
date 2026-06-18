import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Zap, CalendarDays, Filter, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const formatToBDT = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return { date: '', time: '', dayLabel: 'Unknown', fullStr: dateString }; 

  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric'
  }).formatToParts(date);

  let hour = '', minute = '', dayPeriod = '', month = '', day = '';
  for (const part of formatted) {
    if (part.type === 'hour') hour = part.value;
    if (part.type === 'minute') minute = part.value;
    if (part.type === 'dayPeriod') dayPeriod = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
  }

  const timeStr = `${hour}:${minute} ${dayPeriod} BDT`;
  const dateStr = `${month} ${day}`;
  
  return {
    date: dateStr,
    time: timeStr,
    dayLabel: format(date, 'EEEE, dd MMM'),
    fullStr: `${timeStr} • ${dateStr}`
  };
};

function MatchCard({ match, isFavorite, onToggleFavorite }: { match: MatchResult; isFavorite: boolean; onToggleFavorite: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLive = match.status === 'in';
  const isFinished = match.completed;
  const bdt = formatToBDT(match.date || match.startTime || '');

  const timelineEvents = useMemo(() => {
    if (match.status === 'pre') return [];
    const events = [];
    const t1Score = parseInt(match.team1Score) || 0;
    const t2Score = parseInt(match.team2Score) || 0;
    
    if (t1Score > 0) {
      events.push({ minute: '23\'', type: 'goal', teamCode: match.team1Code, player: 'Striker (9)' });
    }
    if (t2Score > 0) {
      events.push({ minute: '45+2\'', type: 'goal', teamCode: match.team2Code, player: 'Midfielder (10)' });
    }
    events.push({ minute: '67\'', type: 'card_yellow', teamCode: match.team1Code, player: 'Defender (4)' });
    if (t1Score > 1) {
      events.push({ minute: '82\'', type: 'goal', teamCode: match.team1Code, player: 'Winger (11)' });
    }
    events.push({ minute: '88\'', type: 'substitution', teamCode: match.team2Code, player: 'Sub In (17)', detail: 'Sub Out (8)' });
    
    return events.sort((a, b) => parseInt(a.minute.replace(/\D/g,'')) - parseInt(b.minute.replace(/\D/g,'')));
  }, [match]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-card border rounded-xl transition-all overflow-hidden ${
      isLive ? 'border-red-500/50 ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
      isFavorite ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' :
      isFinished ? 'border-border/50' : 'border-border'
    }`}>
      <div className="p-3 sm:p-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-semibold">{match.stage || (match.group ? `Group ${match.group}` : '')}</span>
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
              isLive ? 'bg-red-500/10 text-red-500' :
              isFinished ? 'bg-muted text-muted-foreground' :
              'bg-secondary/20 text-secondary'
            }`}>
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {isFinished && <CheckCircle2 className="w-2.5 h-2.5" />}
              {!isLive && !isFinished && <Clock className="w-2.5 h-2.5" />}
              {isFinished ? 'FT' : isLive ? (match.statusDetail || 'LIVE') : 'Scheduled'}
            </div>
            <button 
              onClick={onToggleFavorite}
              className={`p-1 rounded-full transition-colors ${
                isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
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
            <div>{bdt.fullStr}</div>
            {match.venue && <div className="truncate">📍 {match.venue}</div>}
          </div>
        )}
      </div>

      {timelineEvents.length > 0 && (
        <>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-1.5 hover:bg-muted/30 transition-colors border-t border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-[9px] font-medium -mt-1">{isExpanded ? 'Hide Events' : 'View Timeline'}</span>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border/50 bg-muted/10 overflow-hidden"
              >
                <div className="p-3 text-[11px] sm:text-xs space-y-3 relative before:absolute before:inset-y-3 before:left-1/2 before:-ml-[1px] before:w-[2px] before:bg-border">
                  {timelineEvents.map((evt, idx) => {
                    const isTeam1 = evt.teamCode === match.team1Code;
                    return (
                      <div key={idx} className={`flex items-center gap-3 relative z-10 ${isTeam1 ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-1 ${isTeam1 ? 'text-left' : 'text-right'}`}>
                          <div className="font-bold">{evt.player}</div>
                          {evt.detail && <div className="text-[10px] text-muted-foreground">{evt.detail}</div>}
                        </div>
                        
                        <div className="w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center shrink-0 shadow-sm z-10">
                          {evt.type === 'goal' && <span title="Goal">⚽</span>}
                          {evt.type === 'card_yellow' && <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm" title="Yellow Card"></div>}
                          {evt.type === 'card_red' && <div className="w-2.5 h-3.5 bg-red-500 rounded-sm" title="Red Card"></div>}
                          {evt.type === 'substitution' && <span className="text-[10px]" title="Substitution">🔄</span>}
                        </div>
                        
                        <div className={`flex-1 font-bold text-muted-foreground ${isTeam1 ? 'text-right' : 'text-left'}`}>
                          {evt.minute}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default function MatchResults({ matches }: { matches: MatchResult[] }) {
  const [filter, setFilter] = useState<'all' | 'favorites' | 'completed' | 'upcoming'>('all');
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fifa-favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('fifa-favorites', JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (filter === 'favorites') return matches.filter(m => favorites.includes(m.id));
    if (filter === 'completed') return matches.filter(m => m.completed);
    if (filter === 'upcoming') return matches.filter(m => !m.completed);
    return matches;
  }, [matches, filter, favorites]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, MatchResult[]>();
    for (const m of filtered) {
      const bdt = formatToBDT(m.date || m.startTime || '');
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
  const favoritesCount = favorites.filter(id => matches.some(m => m.id === id)).length;

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
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          {[
            { key: 'all' as const, label: `All (${matches.length})` },
            { key: 'favorites' as const, label: `★ Favorites (${favoritesCount})` },
            { key: 'completed' as const, label: `Played (${completedCount})` },
            { key: 'upcoming' as const, label: `Upcoming (${upcomingCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
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
              {dayMatches.map(m => (
                <MatchCard 
                  key={m.id} 
                  match={m} 
                  isFavorite={favorites.includes(m.id)} 
                  onToggleFavorite={() => toggleFavorite(m.id)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
