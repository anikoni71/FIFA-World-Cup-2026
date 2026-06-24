import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teams } from '@/data/teams';
import { getLiveData, GetLiveDataOutputType, getTeamDetails, TeamDetails } from '@/lib/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  baseTeamCode?: string;
  trigger?: React.ReactNode;
}

export default function TeamCompare({ baseTeamCode, trigger }: Props) {
  const [team1Code, setTeam1Code] = useState<string>(baseTeamCode || '');
  const [team2Code, setTeam2Code] = useState<string>('');
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);
  
  const [team1Details, setTeam1Details] = useState<TeamDetails | null>(null);
  const [team2Details, setTeam2Details] = useState<TeamDetails | null>(null);

  useEffect(() => {
    // Real-time update logic
    let isMounted = true;
    const fetchCompareData = async () => {
      try {
        const data = await getLiveData({});
        if (!isMounted) return;
        setLiveData(data);

        if (team1Code) {
          const t1Info = teams[team1Code];
          const t1 = await getTeamDetails(t1Info?.id || '', team1Code, data.allMatches || []);
          if (isMounted) setTeam1Details(t1);
        }
        if (team2Code) {
          const t2Info = teams[team2Code];
          const t2 = await getTeamDetails(t2Info?.id || '', team2Code, data.allMatches || []);
          if (isMounted) setTeam2Details(t2);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchCompareData();
    const interval = setInterval(fetchCompareData, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [team1Code, team2Code]);

  const getTeamStats = (code: string) => {
    if (!liveData) return null;
    for (const group of liveData.standings) {
      const stats = group.teams.find(t => t.code === code);
      if (stats) return stats;
    }
    return null;
  };

  const stats1 = getTeamStats(team1Code);
  const stats2 = getTeamStats(team2Code);

  const t1Info = teams[team1Code];
  const t2Info = teams[team2Code];

  // Radar chart data preparation
  const chartData = [
    { subject: 'Goals For', A: stats1?.goalsFor || 0, B: stats2?.goalsFor || 0, fullMark: 10 },
    { subject: 'Defense', A: 10 - (stats1?.goalsAgainst || 0), B: 10 - (stats2?.goalsAgainst || 0), fullMark: 10 },
    { subject: 'Points', A: stats1?.points || 0, B: stats2?.points || 0, fullMark: 9 },
    { subject: 'Wins', A: stats1?.wins || 0, B: stats2?.wins || 0, fullMark: 3 },
    { subject: 'Played', A: stats1?.played || 0, B: stats2?.played || 0, fullMark: 3 },
  ];

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger ? (
            trigger as React.ReactElement
          ) : (
            <Button size="sm" variant="secondary" className="gap-2">
              <Swords className="w-4 h-4" /> Compare Teams
            </Button>
          )
        }
      />
      <DialogContent className="max-w-3xl bg-[#0b0f19] border-[#1e293b] sm:rounded-2xl text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Head-to-Head Comparison</DialogTitle>
          <DialogDescription className="text-slate-400">
            Real-time tournament statistics and form comparison for FIFA World Cup 2026.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4 bg-[#121824]/50 p-4 rounded-xl border border-[#1e293b]/50">
          <div className="flex-1 w-full">
            {!baseTeamCode ? (
              <Select value={team1Code} onValueChange={setTeam1Code}>
                <SelectTrigger className="w-full bg-[#0b0f19] border-[#1e293b]">
                  <SelectValue placeholder="Select Team 1" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0f19] border-[#1e293b]">
                  {Object.values(teams).sort((a,b) => a.name.localeCompare(b.name)).map(t => (
                    <SelectItem key={`t1-${t.code}`} value={t.code} disabled={t.code === team2Code}>
                      {t.flag} {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center">
                <span className="text-4xl block mb-2">{t1Info?.flag}</span>
                <span className="font-bold text-white">{t1Info?.name}</span>
              </div>
            )}
          </div>
          
          <div className="font-black text-xl text-slate-600 bg-[#0b0f19] rounded-full w-10 h-10 flex items-center justify-center border border-[#1e293b] shrink-0">VS</div>
          
          <div className="flex-1 w-full">
            <Select value={team2Code} onValueChange={setTeam2Code}>
              <SelectTrigger className="w-full bg-[#0b0f19] border-[#1e293b]">
                <SelectValue placeholder="Select Team 2" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b0f19] border-[#1e293b]">
                {Object.values(teams).sort((a,b) => a.name.localeCompare(b.name)).map(t => (
                  <SelectItem key={`t2-${t.code}`} value={t.code} disabled={t.code === team1Code}>
                    {t.flag} {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {team1Code && team2Code && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {/* Stats Comparison */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Tournament Stats</h3>
              <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-4">
                {[
                  { label: 'Matches Played', k1: stats1?.played, k2: stats2?.played },
                  { label: 'Wins', k1: stats1?.wins, k2: stats2?.wins },
                  { label: 'Draws', k1: stats1?.draws, k2: stats2?.draws },
                  { label: 'Losses', k1: stats1?.losses, k2: stats2?.losses },
                  { label: 'Goals For', k1: stats1?.goalsFor, k2: stats2?.goalsFor },
                  { label: 'Goals Against', k1: stats1?.goalsAgainst, k2: stats2?.goalsAgainst },
                  { label: 'Goal Difference', k1: stats1?.goalDifference, k2: stats2?.goalDifference },
                  { label: 'Points', k1: stats1?.points, k2: stats2?.points },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#1e293b]/50 last:border-0 text-sm">
                    <span className={cn("font-bold w-8 text-center", (stat.k1 || 0) > (stat.k2 || 0) ? "text-[#10b981]" : "text-slate-300")}>{stat.k1 !== undefined ? stat.k1 : '-'}</span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">{stat.label}</span>
                    <span className={cn("font-bold w-8 text-center", (stat.k2 || 0) > (stat.k1 || 0) ? "text-[#f59e0b]" : "text-slate-300")}>{stat.k2 !== undefined ? stat.k2 : '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form & Chart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Recent Form</h3>
                <div className="flex justify-between items-center bg-[#121824] border border-[#1e293b] rounded-xl p-4">
                  <div className="flex gap-1">
                    {team1Details?.recentForm.map((f, i) => (
                      <span key={i} className={cn(
                        "w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold text-white",
                        f.result === 'W' ? 'bg-green-500' : f.result === 'D' ? 'bg-slate-500' : 'bg-red-500'
                      )} title={`${f.opponent} (${f.score})`}>{f.result}</span>
                    ))}
                    {(!team1Details?.recentForm || team1Details.recentForm.length === 0) && <span className="text-xs text-slate-500">No data</span>}
                  </div>
                  <span className="text-xs text-slate-500">FORM</span>
                  <div className="flex gap-1">
                    {team2Details?.recentForm.map((f, i) => (
                      <span key={i} className={cn(
                        "w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold text-white",
                        f.result === 'W' ? 'bg-green-500' : f.result === 'D' ? 'bg-slate-500' : 'bg-red-500'
                      )} title={`${f.opponent} (${f.score})`}>{f.result}</span>
                    ))}
                    {(!team2Details?.recentForm || team2Details.recentForm.length === 0) && <span className="text-xs text-slate-500">No data</span>}
                  </div>
                </div>
              </div>

              {stats1 && stats2 && (
                <div className="h-[220px] w-full bg-[#121824] border border-[#1e293b] rounded-xl p-2 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#475569', fontSize: 9 }} />
                      <Radar
                        name={t1Info?.name}
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                      />
                      <Radar
                        name={t2Info?.name}
                        dataKey="B"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.4}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!team2Code && (
          <div className="h-[200px] flex items-center justify-center text-slate-500 border border-dashed border-[#1e293b] rounded-xl mt-4">
            Select two teams to view head-to-head analysis
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
