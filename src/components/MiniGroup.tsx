import { teams } from '@/data/teams';
import { useNavigate } from 'react-router-dom';

interface MiniGroupProps {
  groupKey: string;
  teamCodes: string[];
  matches: { t1: string; t2: string; date: string }[];
}

export default function MiniGroup({ groupKey, teamCodes, matches }: MiniGroupProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card/80 border border-border rounded-lg overflow-hidden w-full">
      <div className="bg-primary/20 px-2 py-1 border-b border-border">
        <span className="text-[10px] font-extrabold tracking-widest">GROUP {groupKey}</span>
      </div>
      <div className="px-1.5 py-1 text-[9px] text-muted-foreground leading-tight">
        {teamCodes.map(c => teams[c]?.name).join(' • ')}
      </div>
      <div className="px-1.5 pb-1.5 space-y-[2px]">
        {matches.map((m, i) => (
          <div key={i} className="flex items-center gap-1 text-[9px]">
            <button onClick={() => navigate(`/team/${m.t1}`)} className="flex items-center gap-0.5 hover:text-primary transition-colors font-bold">
              <span>{teams[m.t1]?.flag}</span>
              <span>{m.t1}</span>
            </button>
            <span className="text-muted-foreground">v</span>
            <button onClick={() => navigate(`/team/${m.t2}`)} className="flex items-center gap-0.5 hover:text-primary transition-colors font-bold">
              <span>{teams[m.t2]?.flag}</span>
              <span>{m.t2}</span>
            </button>
            <span className="text-muted-foreground ml-auto whitespace-nowrap shrink-0 text-[8.5px]">{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
