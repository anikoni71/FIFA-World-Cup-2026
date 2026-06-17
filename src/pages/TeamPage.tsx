import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teams, getTeamMatches } from '@/data/teams';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeamCompare from '@/components/TeamCompare';
import TeamFormChart from '@/components/TeamFormChart';
import { getLiveData, GetLiveDataOutputType } from '@/lib/api';

export default function TeamPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const team = code ? teams[code] : null;
  const [liveData, setLiveData] = useState<GetLiveDataOutputType | null>(null);

  useEffect(() => {
    getLiveData({}).then(setLiveData).catch(console.error);
  }, []);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-background border-b border-border">
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

      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-6 sm:space-y-8">
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

        {/* Match schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:items-start">
          <div>
            <h2 className="text-base sm:text-lg font-bold mb-3">Match Schedule</h2>
            <div className="space-y-2.5 sm:space-y-3">
              {matches.map(m => {
                const opponent = m.team1 === team.code ? m.team2 : m.team1;
                const opp = teams[opponent];
                return (
                  <div key={m.id} className="bg-card border border-border rounded-xl p-3 sm:p-4">
                    {/* Teams row */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3">
                      <div className="text-center">
                        <span className="text-3xl sm:text-4xl block">{team.flag}</span>
                        <div className="text-[10px] sm:text-xs font-bold mt-1">{team.code}</div>
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">vs</div>
                      <button
                        onClick={() => navigate(`/team/${opp.code}`)}
                        className="text-center active:opacity-70 transition-opacity"
                      >
                        <span className="text-3xl sm:text-4xl block">{opp.flag}</span>
                        <div className="text-[10px] sm:text-xs font-bold mt-1">{opp.code}</div>
                      </button>
                    </div>
                    {/* Info row */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-[10px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {m.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {m.time}
                      </span>
                      <span className="flex items-center gap-1 max-w-[160px] sm:max-w-none truncate">
                        <MapPin className="w-3 h-3 shrink-0" /> {m.venue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold mb-3">Team Performance</h2>
            {liveData ? (
              <TeamFormChart teamCode={team.code} standings={liveData.standings} />
            ) : (
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6 h-[200px] animate-pulse flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Loading performance...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
