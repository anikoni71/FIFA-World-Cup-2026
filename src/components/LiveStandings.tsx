import { useState, useMemo } from 'react';
import { GetLiveDataOutputType } from '@/lib/api';
import { Star } from 'lucide-react';

export default function LiveStandings({ standings }: { standings: GetLiveDataOutputType['standings'] }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fifa-team-favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const toggleFavorite = (teamCode: string) => {
    setFavorites(prev => {
      const next = prev.includes(teamCode) ? prev.filter(f => f !== teamCode) : [...prev, teamCode];
      localStorage.setItem('fifa-team-favorites', JSON.stringify(next));
      return next;
    });
  };

  const sortedStandings = useMemo(() => {
    if (!standings) return [];
    return standings.map(g => {
      return {
        ...g,
        teams: [...g.teams].sort((a, b) => {
          const aFav = favorites.includes(a.code);
          const bFav = favorites.includes(b.code);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return 0; // Default order comes from the server, which sorts by points/GD
        })
      };
    });
  }, [standings, favorites]);

  if (!standings || standings.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">No standings data available yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedStandings.map((groupData) => (
        <div key={groupData.group} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-3 py-2 border-b border-border text-xs font-bold">
            Group {groupData.group}
          </div>
          <table className="w-full text-[10px] sm:text-xs text-left">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="font-medium px-2 py-1.5">Team</th>
                <th className="font-medium px-1 py-1.5 text-center">MP</th>
                <th className="font-medium px-1 py-1.5 text-center">W</th>
                <th className="font-medium px-1 py-1.5 text-center">D</th>
                <th className="font-medium px-1 py-1.5 text-center">L</th>
                <th className="font-medium px-1 py-1.5 text-center">GD</th>
                <th className="font-medium px-2 py-1.5 text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {groupData.teams.map((team, idx) => {
                const isFav = favorites.includes(team.code);
                return (
                <tr key={team.code} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${isFav ? 'bg-yellow-500/5' : ''}`}>
                  <td className="px-2 py-1.5 flex items-center gap-1.5">
                    <span className="w-3 text-muted-foreground text-[9px] text-right">{idx + 1}</span>
                    <button 
                      onClick={() => toggleFavorite(team.code)}
                      className="p-0.5 text-muted-foreground hover:text-yellow-500 transition-colors focus:outline-none"
                    >
                      <Star className={`w-3 h-3 ${isFav ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </button>
                    {team.logo ? (
                      <img src={team.logo} alt={team.code} className="w-4 h-4 object-contain" />
                    ) : (
                      <span className="w-4 h-4 bg-muted rounded-full inline-block" />
                    )}
                    <span className={`font-bold truncate max-w-[60px] sm:max-w-[80px] ${isFav ? 'text-yellow-500' : ''}`} title={team.name}>{team.code}</span>
                  </td>
                  <td className="px-1 py-1.5 text-center">{team.played}</td>
                  <td className="px-1 py-1.5 text-center">{team.wins}</td>
                  <td className="px-1 py-1.5 text-center">{team.draws}</td>
                  <td className="px-1 py-1.5 text-center">{team.losses}</td>
                  <td className="px-1 py-1.5 text-center text-muted-foreground">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</td>
                  <td className="px-2 py-1.5 text-right font-bold text-primary">{team.points}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
