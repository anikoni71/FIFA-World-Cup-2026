import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { teams, groupMatches, groups } from '@/data/teams';
import { getLiveData, GetLiveDataOutputType, formatToBDT, getMatchTimestamp } from '@/lib/api';
import MiniGroup from '@/components/MiniGroup';
import BracketMatchWorkstation from '@/components/BracketMatchWorkstation';
import MatchResults from '@/components/MatchResults';
import MatchResultsGrid from '@/components/MatchResultsGrid';
import { MatchResultsSkeleton } from '@/components/MatchResultsSkeleton';
import { StandingsGrid, GroupStandings } from '@/components/StandingsGrid';
import { StandingsSkeleton } from '@/components/StandingsSkeleton';
import PlayerStatsWorkstation from '@/components/PlayerStatsWorkstation';
import AllMatchScheduleWorkstation from '@/components/AllMatchScheduleWorkstation';
import ScheduleWorkstation from '@/components/ScheduleWorkstation';
import TeamCompare from '@/components/TeamCompare';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Trophy, Search, Globe, Zap, BarChart3, RefreshCw, LineChart, CalendarDays, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'motion/react';

const leftGroups = ['A', 'B', 'C', 'D', 'E', 'F'];
const rightGroups = ['G', 'H', 'I', 'J', 'K', 'L'];

function getGroupMatchData(g: string, liveAllMatches: GetLiveDataOutputType['allMatches'] = []) {
  if (liveAllMatches.length > 0) {
    return liveAllMatches
      .filter(m => m.group === g)
      .map(m => ({ 
        t1: m.team1Code, 
        t2: m.team2Code, 
        date: `${m.bdt.time} BDT • ${m.bdt.date}` 
      }));
  }

  // Fallback for initial load if liveData hasn't reached yet
  return groupMatches
    .filter(m => m.group === g)
    .map(m => {
      const ts = getMatchTimestamp(m.date, m.time, m.venue);
      const bdt = formatToBDT(ts);
      return { 
        t1: m.team1, 
        t2: m.team2, 
        date: bdt.time === 'TBD' ? `Time TBD • ${m.date}` : `${bdt.time} BDT • ${bdt.date}`
      };
    });
}

function LiveMarquee({ liveData, showTicker }: { liveData: GetLiveDataOutputType | null, showTicker: boolean }) {
  if (!showTicker) return null;
  
  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 w-full bg-slate-950/95 text-white py-2.5 overflow-hidden border-t border-slate-800 z-40 backdrop-blur-md shadow-2xl">
      <div className="flex whitespace-nowrap animate-marquee">
        {(() => {
          const liveGames = (liveData?.allMatches || []).filter(
            (m) => m.status === 'live' || m.status === 'in' || m.status === 'LIVE' || m.status === 'IN_PROGRESS'
          );
          const upcomingGames = (liveData?.allMatches || []).filter(
            (m) => m.status === 'pre' || m.status === 'SCHEDULED' || m.status === 'UPCOMING'
          );

        if (liveGames.length > 0) {
          return liveGames.map((match) => (
            <div key={match.id} className="inline-flex items-center mx-6 text-xs font-semibold tracking-wide">
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black mr-2 animate-pulse uppercase">
                LIVE
              </span>
              <span className="text-slate-200">{match.team1Code} {match.team1Score} - {match.team2Score} {match.team2Code}</span>
              <span className="ml-6 text-slate-800 font-light text-sm">|</span>
            </div>
          ));
        } 
        
        if (upcomingGames.length > 0) {
          return upcomingGames.map((match) => (
            <div key={match.id} className="inline-flex items-center mx-6 text-xs font-semibold tracking-wide">
              <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black mr-2 uppercase tracking-wider">
                SOON
              </span>
              <span className="text-slate-200">{match.team1Code || match.team1Name} vs {match.team2Code || match.team2Name}</span>
              {match.bdt?.time && (
                <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-medium ml-1">
                  {match.bdt.time}
                </span>
              )}
              <span className="ml-6 text-slate-800 font-light text-sm">|</span>
            </div>
          ));
        }

        return null;
        })()}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);
  const [prevStates, setPrevStates] = useState<Record<string, { s1: string, s2: string, status: string }>>({});
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [showTicker, setShowTicker] = useState(true);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [alertsMuted, setAlertsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wc2026_alerts_muted') === 'true';
    }
    return false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('wc2026_alerts_muted', String(alertsMuted));
  }, [alertsMuted]);

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifs = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(perm => setNotifPermission(perm));
    }
  };

  const fetchLive = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await getLiveData({});
      
      // Notification Logic
      if (Notification.permission === "granted" && !alertsMuted && Object.keys(prevStates).length > 0) {
        data.allMatches.forEach(match => {
          const prev = prevStates[match.id];
          if (prev) {
            // Kick-off notification
            if (match.status === 'in' && prev.status === 'pre') {
              new Notification("Match Started! ⚽", {
                body: `${match.team1Name} vs ${match.team2Name} is now LIVE!`,
                icon: "/favicon.ico"
              });
            }
            
            // Goal notification
            if ((match.status === 'in' || match.status === 'live') && (match.team1Score !== prev.s1 || match.team2Score !== prev.s2)) {
              const scorer = match.team1Score !== prev.s1 ? match.team1Name : match.team2Name;
              new Notification(`GOAL for ${scorer}! ⚽`, {
                body: `${match.team1Name} ${match.team1Score} - ${match.team2Score} ${match.team2Name}`,
                silent: false,
                tag: `goal-${match.id}-${match.team1Score}-${match.team2Score}`
              });
            }
          }
        });
      }

      // Update state for next comparison
      const nextStates: Record<string, { s1: string, s2: string, status: string }> = {};
      data.allMatches.forEach(m => {
        nextStates[m.id] = { s1: m.team1Score, s2: m.team2Score, status: m.status };
      });
      setPrevStates(nextStates);
      
      setLiveData(data);
      setLastRefresh(new Date());
    } catch (e) {
      // Silently handle fetch errors during development
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [prevStates, alertsMuted]);

  useEffect(() => {
    fetchLive(true);
    const interval = setInterval(() => fetchLive(false), 60000); // Poll every 60s for live updates
    return () => clearInterval(interval);
  }, [fetchLive]);

  const filteredTeams = search.trim()
    ? Object.values(teams).filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="bg-background text-foreground overflow-y-auto" style={{ minHeight: '-webkit-fill-available', height: '100dvh' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/20 via-primary/15 to-secondary/20 border-b border-border sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">
                  ⚽ WORLD CUP 2026
                </h1>
                <p className="text-muted-foreground text-[10px] sm:text-[11px]">USA • MEXICO • CANADA • LIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Ticker Toggle */}
              <div className="hidden sm:flex items-center space-x-2.5 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/60 transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Ticker
                </span>
                <button
                  onClick={() => setShowTicker(!showTicker)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    showTicker ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                      showTicker ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-[10px] font-bold text-slate-400 w-6">
                  {showTicker ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Strategic Placement: Alerts Toggle */}
              <div className="flex items-center gap-2 bg-background/40 border border-border px-3 py-1.5 rounded-full shadow-sm">
                <AnimatePresence mode="wait">
                  {alertsMuted ? (
                    <motion.div
                      key="muted"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Bell className="w-4 h-4 text-primary animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Alerts</span>
                  <span className="text-[8px] text-muted-foreground uppercase mt-1 leading-none">
                    {alertsMuted ? 'Muted' : 'Active'}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    if (notifPermission !== "granted") {
                      requestNotifs();
                    } else {
                      setAlertsMuted(!alertsMuted);
                    }
                  }}
                  className={`w-9 h-5 rounded-full transition-all relative flex items-center p-0.5 ${
                    alertsMuted ? 'bg-muted border border-border' : 'bg-primary/20 border border-primary/30'
                  }`}
                  aria-label="Toggle Alerts"
                >
                  <motion.div 
                    animate={{ x: alertsMuted ? 0 : 16 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-3.5 h-3.5 rounded-full shadow-sm ${
                      alertsMuted ? 'bg-muted-foreground/60' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]'
                    }`}
                  />
                </button>
              </div>

              <TeamCompare trigger={
                <Button variant="outline" size="sm" className="shrink-0 h-9 rounded-full px-4 border-primary/20 hover:bg-primary/5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1 font-bold">Compare</span>
                </Button>
              } />

              <Button variant="outline" size="sm" onClick={() => fetchLive(true)} disabled={loading} className="shrink-0 h-9 rounded-full px-4 border-primary/20 hover:bg-primary/5">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline ml-1 font-bold">Refresh</span>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card h-9 text-sm"
            />
            {filteredTeams.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredTeams.map(t => (
                  <button
                    key={t.code}
                    onClick={() => { navigate(`/team/${t.code}`); setSearch(''); }}
                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-muted/60 active:bg-muted transition-colors text-left"
                  >
                    <span className="text-lg">{t.flag}</span>
                    <span className="font-semibold text-sm">{t.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">Group {t.group}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      {lastRefresh && (
        <div className="container mx-auto px-3 sm:px-4 pt-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live — auto-refreshes every 5s • Last: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 pb-20 sm:pb-4">
        <Tabs defaultValue="live">
          <TabsList className="fixed bottom-0 left-0 right-0 z-50 w-full grid grid-cols-6 bg-background/95 backdrop-blur border-t border-border p-1 sm:relative sm:w-auto sm:flex sm:bg-muted/50 sm:p-1 sm:rounded-lg sm:border-0 rounded-none h-[calc(64px+env(safe-area-inset-bottom))] pb-[calc(4px+env(safe-area-inset-bottom))] sm:pb-1 sm:h-auto sm:mb-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] sm:shadow-none select-none overflow-x-auto">
            <TabsTrigger value="live" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <Zap className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Live</span>
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <BarChart3 className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Standings</span>
            </TabsTrigger>
            <TabsTrigger value="bracket" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <Trophy className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Bracket</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <Globe className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Groups</span>
            </TabsTrigger>
            <TabsTrigger value="schedule-wk" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <CalendarDays className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium text-center leading-tight">Match Results<br className="sm:hidden" />& Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <LineChart className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <CalendarDays className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Match Results</span>
            </TabsTrigger>
          </TabsList>

          {/* LIVE TAB */}
          <TabsContent value="live">
            {loading && !liveData ? (
              <div className="space-y-4">
                <MatchResultsSkeleton />
              </div>
            ) : liveData ? (
              <div className="space-y-6">
                {liveData.hasError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold">Failed to load live updates</p>
                      <p className="opacity-80">We couldn't connect to the sports data provider. Showing cached or empty data.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchLive(true)} className="h-8 border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                      Retry
                    </Button>
                  </div>
                )}
                
                <MatchResults matches={liveData.todayMatches} />
                {!liveData.hasError && liveData.todayMatches.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium">No matches scheduled for today</p>
                    <p className="text-sm">Check the Standings or Schedule tabs</p>
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" /> Group Standings
                  </h2>
                  <StandingsGrid 
                    groups={liveData.standings.map((group: any) => ({
                      groupName: `Group ${group.group}`,
                      teams: group.teams.map((team: any) => ({
                        id: team.id,
                        name: team.name,
                        flagUrl: team.logo,
                        played: team.played,
                        won: team.wins,
                        drawn: team.draws,
                        lost: team.losses,
                        goalDifference: team.goalDiff,
                        points: team.points
                      }))
                    }))} 
                  />
                </div>
              </div>
            ) : null}
          </TabsContent>

          {/* STANDINGS TAB */}
          <TabsContent value="standings">
            {liveData ? (
              <div className="space-y-4">
                {liveData.hasError ? (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold">Failed to load standings</p>
                      <p className="opacity-80">Network error fetching from provider.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fetchLive(true)} className="h-8 border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                      Retry
                    </Button>
                  </div>
                ) : null}
                <StandingsGrid 
                  groups={liveData.standings.map((group: any) => ({
                    groupName: `Group ${group.group}`,
                    teams: group.teams.map((team: any) => ({
                      id: team.id,
                      name: team.name,
                      flagUrl: team.logo,
                      played: team.played,
                      won: team.wins,
                      drawn: team.draws,
                      lost: team.losses,
                      goalDifference: team.goalDiff,
                      points: team.points
                    }))
                  }))} 
                />
              </div>
            ) : (
              <StandingsSkeleton />
            )}
          </TabsContent>

          {/* BRACKET TAB */}
          <TabsContent value="bracket">
            <BracketMatchWorkstation standings={liveData?.standings || []} knockoutResults={liveData?.knockoutResults || []} />
          </TabsContent>

          {/* SCHEDULE TAB */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[...leftGroups, ...rightGroups].map(g => (
                <MiniGroup key={g} groupKey={g} teamCodes={groups[g as keyof typeof groups]} matches={getGroupMatchData(g, liveData?.allMatches)} />
              ))}
            </div>
          </TabsContent>

          {/* ALL MATCHES TAB */}
          <TabsContent value="schedule-wk">
            <ScheduleWorkstation />
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats">
            <div className="space-y-8 pb-12">
              <PlayerStatsWorkstation />
            </div>
          </TabsContent>

          {/* RESULTS TAB */}
          <TabsContent value="results">
            {loading && !liveData ? (
              <div className="space-y-4">
                <MatchResultsSkeleton />
              </div>
            ) : liveData ? (
              <div className="space-y-6">
                <MatchResultsGrid matches={liveData.allMatches} />
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>

      <LiveMarquee liveData={liveData} showTicker={showTicker} />
    </div>
  );
}
