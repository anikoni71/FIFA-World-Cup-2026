import { Award, TrendingUp, Target, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

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
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 sm:gap-3 py-2.5 px-3 hover:bg-muted/30 transition-colors"
    >
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
    </motion.div>
  );
}

function LeaderBoard({ leader }: { leader: Leader }) {
  const Icon = getCategoryIcon(leader.category);
  const isGoals = leader.category.toLowerCase().includes('goal');

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-primary/15 to-secondary/15 px-4 py-2.5 border-b border-border flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-extrabold tracking-wide">{leader.categoryLabel}</h3>
      </div>
      
      {isGoals ? (
        <div className="p-4 flex-1 flex flex-col min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart 
              data={leader.players.slice(0, 5).map(p => ({
                name: p.name.split(' ').slice(-1)[0], // Last name
                fullName: p.name,
                value: Number(p.value),
                team: p.team
              }))} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={12} fontWeight="bold" tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#1e293b'}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: 13, color: '#e2e8f0', fontWeight: 'bold' }}
                labelStyle={{ fontSize: 11, color: '#94a3b8', marginBottom: '4px' }}
                formatter={(value: number) => [value, 'Goals']}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const p = payload[0].payload;
                    return `${p.fullName} (${p.team})`;
                  }
                  return label;
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                 {
                   leader.players.slice(0, 5).map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#64748b'} />
                   ))
                 }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {leader.players.map((p, i) => (
            <PlayerRow key={`${p.name}-${i}`} player={p} showHeadshot={i < 5} />
          ))}
        </div>
      )}
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
