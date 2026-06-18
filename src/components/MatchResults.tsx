import { useState, useMemo } from "react";
import { GetLiveDataOutputType } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, Zap, CalendarDays, Filter } from "lucide-react";
import { HeadToHeadModal } from "./HeadToHeadModal";

export type MatchResult = GetLiveDataOutputType["allMatches"][0];

function getMatchDateInfo(match: MatchResult) {
  const fallback = {
    date: "Date TBD",
    time: "Time TBD",
    dayLabel: match.date ? `${match.date}` : "Match Schedule Pending",
    sortTime: Infinity,
  };

  // If we have local formats from our schedule (e.g. "June 11", "8PM")
  if (match.date && match.time) {
    try {
      const timeRe = match.time.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);

      let sortTime = Infinity;
      if (!timeRe) {
        const dateTry = `${match.date}, 2026 12:00 PM EDT`;
        const d = new Date(dateTry);
        if (!isNaN(d.getTime())) {
          sortTime = d.getTime();
        }
        return {
          date: match.date,
          time: match.time.toLowerCase().includes("tbd")
            ? "Time TBD"
            : match.time,
          dayLabel: `${match.date}`,
          sortTime,
        };
      }

      const [_, h, m, ampm] = timeRe;
      const dateTry = `${match.date}, 2026 ${h}:${m || "00"} ${ampm} EDT`;
      const d = new Date(dateTry);

      if (isNaN(d.getTime())) {
        return fallback;
      }

      sortTime = d.getTime();

      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        weekday: "long",
        month: "short",
        day: "numeric",
      }).formatToParts(d);

      let hour = "",
        minute = "",
        dayPeriod = "",
        month = "",
        day = "",
        weekday = "";
      for (const part of formatted) {
        if (part.type === "hour") hour = part.value;
        if (part.type === "minute") minute = part.value;
        if (part.type === "dayPeriod") dayPeriod = part.value;
        if (part.type === "month") month = part.value;
        if (part.type === "day") day = part.value;
        if (part.type === "weekday") weekday = part.value;
      }
      return {
        date: `${day} ${month}`,
        time: `${hour}:${minute} ${dayPeriod}`,
        dayLabel: `${weekday}, ${day} ${month}`,
        sortTime,
      };
    } catch {
      return fallback;
    }
  }

  // Backup for pure ISO dates (like from ESPN API direct without our schedule fallback)
  if (match.startTime) {
    try {
      const date = parseISO(match.startTime);
      if (isNaN(date.getTime())) return fallback;
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      const bdt = new Date(utc + 6 * 3600000);
      return {
        date: format(bdt, "dd MMM"),
        time: format(bdt, "h:mm a"),
        dayLabel: format(bdt, "EEEE, dd MMM"),
        sortTime: date.getTime(),
      };
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function MatchCard({
  match,
  onClick,
}: {
  match: MatchResult;
  onClick?: () => void;
}) {
  const isLive = match.status === "in";
  const isFinished = match.completed;
  const bdt = getMatchDateInfo(match);

  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded-xl p-3 sm:p-4 transition-colors cursor-pointer hover:bg-muted/20 ${
        isLive
          ? "border-primary/50 ring-1 ring-primary/20"
          : isFinished
            ? "border-border/50"
            : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-semibold">
          {match.stage ||
            (match.group ? `Group ${match.group}` : "Group Stage")}
        </span>
        <div
          className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
          {match.team1Logo && (
            <img
              src={match.team1Logo}
              alt={match.team1Code}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          )}
          <span
            className={`text-[10px] sm:text-xs font-bold ${match.winner === match.team1Code ? "text-primary" : ""}`}
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
            <span
              className={`text-xl sm:text-2xl font-extrabold ${match.winner === match.team1Code ? "text-primary" : ""}`}
            >
              {match.status === "pre" ? "-" : match.team1Score}
            </span>
            <span className="text-muted-foreground text-xs">:</span>
            <span
              className={`text-xl sm:text-2xl font-extrabold ${match.winner === match.team2Code ? "text-primary" : ""}`}
            >
              {match.status === "pre" ? "-" : match.team2Score}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[50px] sm:min-w-[60px]">
          {match.team2Logo && (
            <img
              src={match.team2Logo}
              alt={match.team2Code}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          )}
          <span
            className={`text-[10px] sm:text-xs font-bold ${match.winner === match.team2Code ? "text-primary" : ""}`}
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
    </div>
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

    // Compute sortTime and sort chronological
    const withSortInfo = list.map((m) => {
      const info = getMatchDateInfo(m);
      return { ...m, _info: info };
    });

    withSortInfo.sort((a, b) => a._info.sortTime - b._info.sortTime);
    return withSortInfo;
  }, [matches, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, (typeof sortedAndFiltered)[0][]>();
    for (const m of sortedAndFiltered) {
      const key = m._info.dayLabel;
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
