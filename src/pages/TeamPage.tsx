import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teams, getTeamMatches } from '@/data/teams';
import { ArrowLeft, MapPin, Calendar, Clock, ChevronDown, ChevronUp, History, TrendingUp, ShieldAlert, Zap, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeamCompare from '@/components/TeamCompare';
import TeamFormChart from '@/components/TeamFormChart';
import TeamStatsChart from '@/components/TeamStatsChart';
import { getLiveData, GetLiveDataOutputType, getTeamDetails, TeamDetails } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';

function TeamSquad({ squad }: { squad: TeamDetails['squad'] }) {
  const grouped = useMemo(() => {
    const map: Record<string, TeamDetails['squad']> = {};
    squad.forEach(p => {
      const role = p.role || 'Others';
      if (!map[role]) map[role] = [];
      map[role].push(p);
    });
    return map;
  }, [squad]);

  const rolesOrder = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  if (squad.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">Squad information is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rolesOrder.map(role => {
        const players = grouped[role];
        if (!players) return null;
        return (
          <div key={role}>
            <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider px-1">{role}s</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {p.number || '#'}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.club || 'Free Agent'}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {p.age}y
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentFormHistory({ recentForm }: { recentForm: TeamDetails['recentForm'] }) {
  if (recentForm.length === 0) {
    return (
      <div className="bg-muted/30 rounded-xl p-6 text-center border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No recent matches found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentForm.map(m => (
        <div key={m.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
              m.result === 'W' ? 'bg-green-500 text-white' : 
              m.result === 'L' ? 'bg-destructive text-white' : 
              'bg-muted text-muted-foreground'
            }`}>
              {m.result}
            </div>
            <div>
              <div className="text-xs font-bold">vs {m.opponentName}</div>
              <div className="text-[10px] text-muted-foreground">{m.date}</div>
            </div>
          </div>
          <div className="text-sm font-mono font-bold">{m.score}</div>
        </div>
      ))}
    </div>
  );
}

function TeamHistoricalStats({ team, groupTeams, recentForm }: { team: any, groupTeams: any[], recentForm: TeamDetails['recentForm'] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">Historical Head-to-Head & Trends</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50 bg-muted/10"
          >
            <div className="p-4 space-y-5">
              {/* Recent trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Tournament Results</h3>
                  <RecentFormHistory recentForm={recentForm} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance Metrics</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1 text-green-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Attack Rating</span>
                      </div>
                      <div className="text-lg font-extrabold items-baseline flex gap-1">8.5 <span className="text-[10px] text-muted-foreground font-normal">/ 10</span></div>
                      <div className="text-[9px] text-muted-foreground mt-1">Averaging 2.3 goals per game over last 10 matches</div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1 text-blue-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Defensive Solidity</span>
                      </div>
                      <div className="text-lg font-extrabold items-baseline flex gap-1">7.2 <span className="text-[10px] text-muted-foreground font-normal">/ 10</span></div>
                      <div className="text-[9px] text-muted-foreground mt-1">4 clean sheets in recent international fixtures</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* H2H against group */}
              <div>
                 <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">H2H vs Group Opponents</h3>
                 <div className="space-y-2">
                   {groupTeams.map(opp => {
                     // Generate some deterministic mock stats based on team names length
                     const wins = (team.name.length + opp.name.length) % 4;
                     const draws = (team.name.length) % 3;
                     const losses = (opp.name.length) % 4;
                     
                     return (
                       <div key={opp.code} className="flex justify-between items-center bg-background border border-border/50 rounded-lg p-2.5">
                         <div className="flex items-center gap-2">
                           <span className="text-xl">{opp.flag}</span>
                           <span className="text-xs font-bold">{opp.name}</span>
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                           <div className="flex flex-col items-center"><span className="text-primary font-bold text-xs">{wins}</span><span>W</span></div>
                           <div className="flex flex-col items-center"><span className="text-xs">{draws}</span><span>D</span></div>
                           <div className="flex flex-col items-center"><span className="text-destructive font-bold text-xs">{losses}</span><span>L</span></div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TeamPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const team = code ? teams[code] : null;
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);

  useEffect(() => {
    getLiveData({}).then(setLiveData).catch(console.error);
  }, []);

  useEffect(() => {
    if (liveData && code) {
      const teamEntry = liveData.standings.flatMap(g => g.teams).find(t => t.code === code);
      if (teamEntry) {
        setDetailsLoading(true);
        getTeamDetails(teamEntry.id, code, liveData.allMatches)
          .then(setTeamDetails)
          .catch(console.error)
          .finally(() => setDetailsLoading(false));
      } else {
        // Fallback for teams not in standings yet or if API structure differs
        setDetailsLoading(false);
      }
    }
  }, [liveData, code]);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Team not found</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const matches = getTeamMatches(team.code);
  const groupTeams = Object.values(teams).filter(t => t.group === team.group && t.code !== team.code);

  return (
    <div className="bg-background text-foreground overflow-y-auto" style={{ minHeight: '-webkit-fill-available', height: '100dvh' }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-background border-b border-border sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-5xl sm:text-6xl">{team.flag}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{team.name}</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                  Group {team.group} • {team.code}
                </p>
              </div>
            </div>
            {/* Compare Button */}
            <div className="hidden sm:block">
              <TeamCompare baseTeamCode={team.code} />
            </div>
          </div>
          {/* Mobile Compare Button */}
          <div className="mt-4 sm:hidden">
            <TeamCompare baseTeamCode={team.code} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] space-y-6 sm:space-y-8">
        {/* Group opponents */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3">Group {team.group} Opponents</h2>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3 sm:flex-wrap">
            {groupTeams.map(t => (
              <button
                key={t.code}
                onClick={() => navigate(`/team/${t.code}`)}
                className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 bg-card border border-border rounded-xl px-3 py-3 sm:px-4 hover:border-primary/50 active:bg-muted/40 transition-colors"
              >
                <span className="text-2xl sm:text-2xl">{t.flag}</span>
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-xs sm:text-sm">{t.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground">{t.code}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left/Main Column: Matches & Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Match schedule */}
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Upcoming Matches
              </h2>
              <div className="space-y-3">
                {matches.map(m => {
                  const opponent = m.team1 === team.code ? m.team2 : m.team1;
                  const opp = teams[opponent];
                  return (
                    <div key={m.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center justify-end gap-3">
                          <span className="text-sm font-bold hidden sm:inline">{team.name}</span>
                          <span className="text-2xl">{team.flag}</span>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">VS</div>
                        <div className="flex-1 flex items-center justify-start gap-3">
                          <button
                            onClick={() => navigate(`/team/${opp.code}`)}
                            className="text-2xl hover:scale-110 transition-transform"
                          >
                            {opp.flag}
                          </button>
                          <button
                            onClick={() => navigate(`/team/${opp.code}`)}
                            className="text-sm font-bold hidden sm:inline hover:text-primary transition-colors text-left"
                          >
                            {opp.name}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {m.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {m.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {m.venue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Performance */}
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Team Performance
              </h2>
              {liveData ? (
                <div className="space-y-4">
                  <TeamFormChart teamCode={team.code} standings={liveData.standings} />
                  <TeamHistoricalStats 
                    team={team} 
                    groupTeams={groupTeams} 
                    recentForm={teamDetails?.recentForm || []} 
                  />
                  
                  <div className="pt-4 border-t border-border/50">
                    <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary"/> Team Statistics</h2>
                    <TeamStatsChart 
                      goalDistribution={[
                        { minuteRange: '0-15', goals: 2 },
                        { minuteRange: '16-30', goals: 1 },
                        { minuteRange: '31-45', goals: 4 },
                        { minuteRange: '46-60', goals: 3 },
                        { minuteRange: '61-75', goals: 5 },
                        { minuteRange: '76-90+', goals: 7 }
                      ]} 
                      possessionStats={[
                        { match: 'Match 1', possession: 55 },
                        { match: 'Match 2', possession: 48 },
                        { match: 'Match 3', possession: 62 },
                        { match: 'Match 4', possession: 51 },
                        { match: 'Match 5', possession: 58 }
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-6 h-[200px] animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-6 h-6 text-muted-foreground mx-auto mb-2 animate-pulse" />
                    <span className="text-muted-foreground text-sm">Synchronizing performance data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right/Side Column: Squad */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Detailed Squad
              </h2>
              <div className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">
                2026 OFFICIAL
              </div>
            </div>

            {detailsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            ) : (
              <TeamSquad squad={teamDetails?.squad || []} />
            )}
            
            <div className="bg-muted/30 border border-border rounded-xl p-4 flex gap-3 text-muted-foreground">
              <Info className="w-5 h-5 shrink-0 text-primary" />
              <p className="text-[10px] leading-relaxed">
                Squad lists are updated in real-time based on official FIFA declarations and recent international call-ups for the 2026 World Cup campaign.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
