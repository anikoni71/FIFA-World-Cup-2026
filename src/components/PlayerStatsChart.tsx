import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { match: 'M1', mbappe: 8.5, messi: 8.2, ronaldo: 7.8, bellingham: 8.9 },
  { match: 'M2', mbappe: 8.7, messi: 8.9, ronaldo: 8.1, bellingham: 8.5 },
  { match: 'M3', mbappe: 9.1, messi: 8.6, ronaldo: 7.5, bellingham: 9.2 },
  { match: 'R32', mbappe: 9.5, messi: 9.0, ronaldo: 8.5, bellingham: 9.0 },
  { match: 'R16', mbappe: 9.2, messi: 9.4, ronaldo: null, bellingham: 8.8 },
];

export default function PlayerStatsChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 w-full">
      <div className="flex flex-col mb-6">
        <h3 className="font-bold text-lg">Top Players Performance Trends</h3>
        <p className="text-sm text-muted-foreground mt-1">Average match rating progression over the tournament</p>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="match" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[6, 10]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ fontSize: 13 }}
              labelStyle={{ fontSize: 11, color: '#94a3b8', marginBottom: '8px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Line type="monotone" name="K. Mbappé" dataKey="mbappe" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" name="L. Messi" dataKey="messi" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Line type="monotone" name="C. Ronaldo" dataKey="ronaldo" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} connectNulls />
            <Line type="monotone" name="J. Bellingham" dataKey="bellingham" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
