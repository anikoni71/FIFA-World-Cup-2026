import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { teams, groupMatches, groups } from '@/data/teams';
import { getLiveData, GetLiveDataOutputType } from '@/lib/api';
import MiniGroup from '@/components/MiniGroup';
import InteractiveBracket from '@/components/InteractiveBracket';
import LiveScores from '@/components/LiveScores';
import LiveStandings from '@/components/LiveStandings';
import PlayerStatsChart from '@/components/PlayerStatsChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Trophy, Search, Globe, Zap, BarChart3, RefreshCw, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const leftGroups = ['A', 'B', 'C', 'D', 'E', 'F'];
const rightGroups = ['G', 'H', 'I', 'J', 'K', 'L'];

function getGroupMatchData(g: string) {
  return groupMatches
    .filter(m => m.group === g)
    .map(m => ({ t1: m.team1, t2: m.team2, date: m.date }));
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const navigate = useNavigate();

  const fetchLive = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLiveData({});
      setLiveData(data);
      setLastRefresh(new Date());
    } catch (e) {
      console.error('Failed to fetch live data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchLive]);

  const filteredTeams = search.trim()
    ? Object.values(teams).filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <Button variant="outline" size="sm" onClick={fetchLive} disabled={loading} className="shrink-0 h-8 sm:h-9">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
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
            Live — auto-refreshes every 60s • Last: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 pb-20 sm:pb-4">
        <Tabs defaultValue="live">
          <TabsList className="fixed bottom-0 left-0 right-0 z-50 w-full grid grid-cols-5 bg-background/95 backdrop-blur border-t border-border p-1.5 sm:relative sm:w-auto sm:flex sm:bg-muted/50 sm:p-1 sm:rounded-lg sm:border-0 rounded-none h-[calc(64px+env(safe-area-inset-bottom))] pb-[calc(4px+env(safe-area-inset-bottom))] sm:pb-1 sm:h-auto sm:mb-4 group-data-horizontal/tabs:h-[calc(64px+env(safe-area-inset-bottom))] sm:group-data-horizontal/tabs:h-8 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] sm:shadow-none select-none">
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
              <Globe className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-col gap-1 rounded-[10px] sm:flex-row sm:rounded-md text-[10px] sm:text-sm h-full sm:h-auto data-active:text-primary group-data-[variant=default]/tabs-list:data-active:bg-primary/10 sm:group-data-[variant=default]/tabs-list:data-active:bg-background sm:group-data-[variant=default]/tabs-list:data-active:text-foreground outline-none">
              <LineChart className="!size-5 sm:!size-4" /> <span className="font-bold sm:font-medium">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* LIVE TAB */}
          <TabsContent value="live">
            {loading && !liveData ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-36 rounded-xl" />)}
                </div>
              </div>
            ) : liveData ? (
              <div className="space-y-6">
                <LiveScores matches={liveData.todayMatches} />
                {liveData.todayMatches.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium">No matches scheduled for today</p>
                    <p className="text-sm">Check the Standings or Schedule tabs</p>
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" /> Group Standings
                  </h2>
                  <LiveStandings standings={liveData.standings} />
                </div>
              </div>
            ) : null}
          </TabsContent>

          {/* STANDINGS TAB */}
          <TabsContent value="standings">
            {liveData ? (
              <LiveStandings standings={liveData.standings} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
              </div>
            )}
          </TabsContent>

          {/* BRACKET TAB */}
          <TabsContent value="bracket">
            <div className="hidden xl:grid xl:grid-cols-[180px_1fr_180px] gap-3">
              <div className="space-y-2">
                {leftGroups.map(g => (
                  <MiniGroup key={g} groupKey={g} teamCodes={groups[g]} matches={getGroupMatchData(g)} />
                ))}
              </div>
              <div className="overflow-x-auto">
                <InteractiveBracket standings={liveData?.standings || []} knockoutResults={liveData?.knockoutResults || []} />
              </div>
              <div className="space-y-2">
                {rightGroups.map(g => (
                  <MiniGroup key={g} groupKey={g} teamCodes={groups[g]} matches={getGroupMatchData(g)} />
                ))}
              </div>
            </div>
            <div className="xl:hidden space-y-6">
              <InteractiveBracket standings={liveData?.standings || []} knockoutResults={liveData?.knockoutResults || []} />
            </div>
          </TabsContent>

          {/* SCHEDULE TAB */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[...leftGroups, ...rightGroups].map(g => (
                <MiniGroup key={g} groupKey={g} teamCodes={groups[g]} matches={getGroupMatchData(g)} />
              ))}
            </div>
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats">
            <PlayerStatsChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
