import { teams, groupMatches, groups } from '@/data/teams';
import { useNavigate } from 'react-router-dom';

function TeamRow({ code, onClick }: { code: string; onClick: () => void }) {
  const team = teams[code];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors w-full text-left"
    >
      <span className="text-xl">{team.flag}</span>
      <span className="text-sm font-semibold">{team.code}</span>
    </button>
  );
}

function MatchRow({ team1, team2, date, time, venue }: { team1: string; team2: string; date: string; time: string; venue: string }) {
  const t1 = teams[team1];
  const t2 = teams[team2];
  return (
    <div className="flex items-center gap-2 py-1.5 text-xs">
      <div className="flex items-center gap-1 flex-1 justify-end">
        <span className="font-bold">{t1.code}</span>
        <span>{t1.flag}</span>
      </div>
      <span className="text-muted-foreground font-medium px-1">vs</span>
      <div className="flex items-center gap-1 flex-1">
        <span>{t2.flag}</span>
        <span className="font-bold">{t2.code}</span>
      </div>
      <div className="text-muted-foreground text-[10px] leading-tight text-right min-w-[90px]">
        <div>{date} • {time}</div>
        <div className="truncate max-w-[90px]">{venue}</div>
      </div>
    </div>
  );
}

export default function GroupCard({ groupKey }: { groupKey: string }) {
  const navigate = useNavigate();
  const teamCodes = groups[groupKey] || [];
  const matches = groupMatches.filter(m => m.group === groupKey);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-2.5 border-b border-border">
        <h3 className="font-bold text-sm tracking-wide">GROUP {groupKey}</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {teamCodes.map(c => teams[c]?.name).join(' • ')}
        </p>
      </div>
      <div className="p-3">
        <div className="flex gap-1 mb-3 flex-wrap">
          {teamCodes.map(code => (
            <TeamRow key={code} code={code} onClick={() => navigate(`/team/${code}`)} />
          ))}
        </div>
        <div className="space-y-0.5 border-t border-border pt-2">
          {matches.map(m => (
            <MatchRow key={m.id} team1={m.team1} team2={m.team2} date={m.date} time={m.time} venue={m.venue} />
          ))}
        </div>
      </div>
    </div>
  );
}
