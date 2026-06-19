import { useState, useMemo } from "react";
import { GetLiveDataOutputType } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, Zap, CalendarDays, Filter } from "lucide-react";
import { HeadToHeadModal } from "./HeadToHeadModal";
import { teams } from "@/data/teams";
import { motion, AnimatePresence } from "motion/react";

export type MatchResult = GetLiveDataOutputType["allMatches"][0];

function ScoreDigit({ value, highlight }: { value: string | number; highlight?: boolean }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -5, opacity: 0 }}
        className={`text-xl sm:text-2xl font-extrabold ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

function MatchCard({
  match,
  onClick,
}: {
  match: MatchResult;
  onClick?: () => void;
}) {
  const isLive = match.status === "in" || match.status === "live";
  const isFinished = match.completed || match.status === "post" || match.statusDetail === "FT";
  const bdt = match.bdt;

  const getFlagUrl = (code: string) => {
    const team = teams[code];
    if (team?.iso) return `https://flagcdn.com/w40/${team.iso.toLowerCase()}.png`;
    return "";
  };

  const t1Flag = getFlagUrl(match.team1Code);
  const t2Flag = getFlagUrl(match.team2Code);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className={`bg-card border rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-primary/40 relative overflow-hidden ${
        isLive
          ? "border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          : isFinished
            ? "border-border/50"
            : "border-border"
      }`}
    >
      {isLive && (
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/5 pointer-events-none"
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-semibold">
          {match.stage ||
            (match.group ? `Group ${match.group}` : "Group Stage")}
        </span>
        <div
          className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
            isLive
              ? "bg-primary/20 text-primary animate-pulse"
              : isFinished
                ? "bg-muted text-muted-foreground"
                : "bg-secondary/20 text-secondary"
          }`}
        >
          {isLive && <Zap className="w-2.5 h-2.5" />}
          {isFinished && <CheckCircle2 className="w-2.5 h-2.5" />}
          {!isLive && !isFinished && <Clock className="w-2.5 h-2.5" />}
          {isFinished ? "FT" : isLive ? match.statusDetail : "Scheduled"}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          {t1Flag ? (
            <img
              src={t1Flag}
              alt={match.team1Code}
              referrerPolicy="no-referrer"
              className="w-7 h-5 sm:w-8 sm:h-5.5 object-cover rounded shadow-sm border border-border/20"
            />
          ) : (
            <div className="w-7 h-5 sm:w-8 sm:h-5.5 bg-muted rounded flex items-center justify-center text-[8px] font-bold">
              {match.team1Code}
            </div>
          )}
          <span
            className={`text-[10px] sm:text-xs font-bold truncate max-w-full ${match.winner === match.team1Code ? "text-primary" : ""}`}
          >
            {match.team1Code}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          {isLive && (
            <span className="text-[9px] text-primary font-bold animate-pulse -mb-0.5">
              {match.statusDetail || "LIVE"}
            </span>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ScoreDigit 
              value={match.status === "pre" ? "-" : match.team1Score} 
              highlight={match.winner === match.team1Code} 
            />
            <span className="text-muted-foreground text-xs">:</span>
            <ScoreDigit 
              value={match.status === "pre" ? "-" : match.team2Score} 
              highlight={match.winner === match.team2Code} 
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          {t2Flag ? (
            <img
              src={t2Flag}
              alt={match.team2Code}
              referrerPolicy="no-referrer"
              className="w-7 h-5 sm:w-8 sm:h-5.5 object-cover rounded shadow-sm border border-border/20"
            />
          ) : (
            <div className="w-7 h-5 sm:w-8 sm:h-5.5 bg-muted rounded flex items-center justify-center text-[8px] font-bold">
              {match.team2Code}
            </div>
          )}
          <span
            className={`text-[10px] sm:text-xs font-bold truncate max-w-full ${match.winner === match.team2Code ? "text-primary" : ""}`}
          >
            {match.team2Code}
          </span>
        </div>
      </div>

      {/* Date + Venue */}
      <div className="text-center mt-2 text-[9px] sm:text-[10px] text-muted-foreground space-y-0.5">
        <div>
          {bdt?.time !== "Time TBD"
            ? `${bdt?.time} BDT • ${bdt?.date}`
            : `${bdt?.time} • ${bdt?.date}`}
        </div>
        {match.venue && <div className="truncate">📍 {match.venue}</div>}
      </div>
    </motion.div>
  );
}

export default function MatchResults({
  matches = [],
}: {
  matches?: MatchResult[];
}) {
  const [filter, setFilter] = useState<"all" | "completed" | "upcoming">("all");
  const [selectedMatch, setSelectedMatch] = useState<{
    t1: string;
    t2: string;
  } | null>(null);

  const sortedAndFiltered = useMemo(() => {
    let list = matches;
    if (!list) return [];
    if (filter === "completed") list = list.filter((m) => m.completed);
    if (filter === "upcoming") list = list.filter((m) => !m.completed);

    const withSortInfo = [...list];
    withSortInfo.sort((a, b) => a.bdt.sortTime - b.bdt.sortTime);
    return withSortInfo;
  }, [matches, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, (typeof sortedAndFiltered)[0][]>();
    for (const m of sortedAndFiltered) {
      const key = m.bdt.dayLabel;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [sortedAndFiltered]);

  if (!matches || !matches.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">Match results will appear here</p>
        <p className="text-sm">Results update as matches are played</p>
      </div>
    );
  }

  const completedCount = matches.filter((m) => m.completed).length;
  const upcomingCount = matches.filter((m) => !m.completed).length;

  return (
    <>
      <HeadToHeadModal
        isOpen={!!selectedMatch}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
        team1Code={selectedMatch?.t1 || ""}
        team2Code={selectedMatch?.t2 || ""}
      />
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
              { key: "all" as const, label: `All (${matches.length})` },
              {
                key: "completed" as const,
                label: `Played (${completedCount})`,
              },
              {
                key: "upcoming" as const,
                label: `Upcoming (${upcomingCount})`,
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium transition-colors ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
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
                {dayMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    onClick={() => {
                      if (m.team1Code !== "TBD" && m.team2Code !== "TBD") {
                        setSelectedMatch({ t1: m.team1Code, t2: m.team2Code });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
