import { GetLiveDataOutputType } from '@/lib/api';

export default function LiveStandings({ standings }: { standings: GetLiveDataOutputType['standings'] }) {
  if (!standings || standings.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">No standings data available yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {standings.map((groupData) => (
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
              {groupData.teams.map((team, idx) => (
                <tr key={team.code} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="px-2 py-1.5 flex items-center gap-1.5">
                    <span className="w-3 text-muted-foreground text-[9px] text-right">{idx + 1}</span>
                    {team.logo ? (
                      <img src={team.logo} alt={team.code} className="w-4 h-4 object-contain" />
                    ) : (
                      <span className="w-4 h-4 bg-muted rounded-full inline-block" />
                    )}
                    <span className="font-bold truncate max-w-[60px] sm:max-w-[80px]" title={team.name}>{team.code}</span>
                  </td>
                  <td className="px-1 py-1.5 text-center">{team.played}</td>
                  <td className="px-1 py-1.5 text-center">{team.wins}</td>
                  <td className="px-1 py-1.5 text-center">{team.draws}</td>
                  <td className="px-1 py-1.5 text-center">{team.losses}</td>
                  <td className="px-1 py-1.5 text-center text-muted-foreground">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</td>
                  <td className="px-2 py-1.5 text-right font-bold text-primary">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
