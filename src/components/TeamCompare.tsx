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
import { getLiveData, GetLiveDataOutputType } from '@/lib/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Swords } from 'lucide-react';

interface Props {
  baseTeamCode: string;
}

export default function TeamCompare({ baseTeamCode }: Props) {
  const [compareTeamCode, setCompareTeamCode] = useState<string>('');
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);

  useEffect(() => {
    getLiveData({}).then(setLiveData).catch(console.error);
  }, []);

  const getTeamStats = (code: string) => {
    if (!liveData) return null;
    for (const group of liveData.standings) {
      const stats = group.teams.find(t => t.code === code);
      if (stats) return stats;
    }
    return null;
  };

  const baseStats = getTeamStats(baseTeamCode);
  const compareStats = getTeamStats(compareTeamCode);

  const baseTeamInfo = teams[baseTeamCode];
  const compareTeamInfo = teams[compareTeamCode];

  // Radar chart data preparation
  const chartData = [
    { subject: 'Goals For', A: baseStats?.goalsFor || 0, B: compareStats?.goalsFor || 0, fullMark: 10 },
    { subject: 'Goals Against (Inv)', A: 10 - (baseStats?.goalsAgainst || 0), B: 10 - (compareStats?.goalsAgainst || 0), fullMark: 10 },
    { subject: 'Points', A: baseStats?.points || 0, B: compareStats?.points || 0, fullMark: 9 },
    { subject: 'Wins', A: baseStats?.wins || 0, B: compareStats?.wins || 0, fullMark: 3 },
    { subject: 'Played', A: baseStats?.played || 0, B: compareStats?.played || 0, fullMark: 3 },
  ];

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" variant="secondary" className="gap-2">
            <Swords className="w-4 h-4" /> Compare Team
          </Button>
        }
      />
      <DialogContent className="max-w-xl bg-card border-border sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Compare Teams</DialogTitle>
          <DialogDescription>Select an opponent to compare real-time tournament statistics.</DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 items-center justify-between mt-4 bg-muted/30 p-4 rounded-xl border border-border/50">
          <div className="flex-1 text-center">
            <span className="text-4xl block mb-2">{baseTeamInfo?.flag}</span>
            <span className="font-bold">{baseTeamInfo?.name}</span>
          </div>
          
          <div className="font-black text-xl text-muted-foreground">VS</div>
          
          <div className="flex-1">
            <Select value={compareTeamCode} onValueChange={setCompareTeamCode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select opponent" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(teams).filter(t => t.code !== baseTeamCode).sort((a,b) => a.name.localeCompare(b.name)).map(t => (
                  <SelectItem key={t.code} value={t.code}>
                    {t.flag} {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {compareTeamCode && (!baseStats || !compareStats) && (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No live data available for comparison yet.
          </div>
        )}

        {compareTeamCode && baseStats && compareStats && (
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar
                  name={baseTeamInfo?.name}
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Radar
                  name={compareTeamInfo?.name}
                  dataKey="B"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.4}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
