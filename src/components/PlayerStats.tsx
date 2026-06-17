import { Award, TrendingUp, Target, Shield } from 'lucide-react';

export type Player = {
  rank: number;
  name: string;
  headshot?: string;
  team: string;
  teamLogo?: string;
  value: string | number;
};

export type Leader = {
  category: string;
  categoryLabel: string;
  players: Player[];
};

const categoryIcons: Record<string, typeof Award> = {
  goals: Target,
  assists: TrendingUp,
  saves: Shield,
};

function getCategoryIcon(cat: string) {
  const key = cat.toLowerCase();
  for (const [k, Icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return Icon;
  }
  return Award;
}

function PlayerRow({ player, showHeadshot }: { player: Player; showHeadshot: boolean }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 py-2.5 px-3 hover:bg-muted/30 transition-colors">
      <span className={`w-6 text-center text-xs font-extrabold ${
        player.rank <= 3 ? 'text-accent' : 'text-muted-foreground'
      }`}>
        {player.rank <= 3 ? ['🥇','🥈','🥉'][player.rank - 1] : player.rank}
      </span>

      {showHeadshot && player.headshot ? (
        <img src={player.headshot} alt={player.name} className="w-8 h-8 rounded-full object-cover bg-muted" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{player.name}</div>
        <div className="flex items-center gap-1.5">
          {player.teamLogo && (
            <img src={player.teamLogo} alt={player.team} className="w-3.5 h-3.5 object-contain" />
          )}
          <span className="text-[10px] text-muted-foreground font-medium">{player.team}</span>
        </div>
      </div>

      <span className="text-lg font-extrabold text-primary">{player.value}</span>
    </div>
  );
}

function LeaderBoard({ leader }: { leader: Leader }) {
  const Icon = getCategoryIcon(leader.category);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/15 to-secondary/15 px-4 py-2.5 border-b border-border flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-extrabold tracking-wide">{leader.categoryLabel}</h3>
      </div>
      <div className="divide-y divide-border/40">
        {leader.players.map((p, i) => (
          <PlayerRow key={`${p.name}-${i}`} player={p} showHeadshot={i < 5} />
        ))}
      </div>
    </div>
  );
}

export default function PlayerStats({ leaders }: { leaders: Leader[] }) {
  if (!leaders.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">Player stats will appear here</p>
        <p className="text-sm">Stats update as matches are played</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-accent" />
        <h2 className="text-base font-bold">Top Player Performance</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaders.map((l, i) => <LeaderBoard key={i} leader={l} />)}
      </div>
    </div>
  );
}
