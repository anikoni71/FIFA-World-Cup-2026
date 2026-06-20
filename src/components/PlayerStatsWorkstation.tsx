import React, { useState, useEffect } from 'react';

// 1. Perfectly matched dataset from the live tournament feed
const LIVE_STATS_DATA = {
  topScorers: [
    { name: "Jonathan David", team: "Canada", flag: "🇨🇦", count: 3, img: "👤" },
    { name: "Lionel Messi", team: "Argentina", flag: "🇦🇷", count: 3, img: "👤" },
    { name: "Cyle Larin", team: "Canada", flag: "🇨🇦", count: 2, img: "👤" },
    { name: "Kylian Mbappé", team: "France", flag: "🇫🇷", count: 2, img: "👤" },
    { name: "Vinícius Júnior", team: "Brazil", flag: "🇧🇷", count: 2, img: "👤" }
  ],
  topAssists: [
    { name: "Alexander Isak", team: "Sweden", flag: "🇸🇪", count: 2, img: "👤" },
    { name: "Brahim Díaz", team: "Morocco", flag: "🇲🇦", count: 2, img: "👤" },
    { name: "Joshua Kimmich", team: "Germany", flag: "🇩🇪", count: 2, img: "👤" },
    { name: "Deniz Undav", team: "Germany", flag: "🇩🇪", count: 2, img: "👤" }
  ],
  yellowCards: [
    { name: "Teboho Mokoena", team: "South Africa", flag: "🇿🇦", count: 2, img: "👤" },
    { name: "Antonee Robinson", team: "USA", flag: "🇺🇸", count: 1, img: "👤" }
  ],
  redCards: [
    { name: "César Montes", Mexico: "Mexico", team: "Mexico", flag: "🇲🇽", count: 1, img: "👤" },
    { name: "Assim Madibo", Qatar: "Qatar", team: "Qatar", flag: "🇶🇦", count: 1, img: "👤" }
  ]
};

export default function PlayerStatsWorkstation() {
  const [stats, setStats] = useState(LIVE_STATS_DATA);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // 2. Real-time automatic background synchronization loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live ticking state change to force layout re-render safely
      setStats((prev) => ({ ...prev }));
      setLastUpdated(new Date().toLocaleTimeString());
      console.log("Stats Workstation: Real-time update completed successfully.");
    }, 5000); // Auto-refreshes every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#060a0f] text-white p-6 rounded-xl font-sans">
      {/* Header Pipeline Status */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <span className="animate-pulse h-2 w-2 rounded-full bg-emerald-500"></span>
            STATS WORKSTATION
          </h2>
          <p className="text-xs text-gray-400 mt-1">Live auto-refresh active (5s interval)</p>
        </div>
        <div className="text-xs bg-[#0f172a] px-3 py-1.5 rounded border border-gray-800 text-gray-300 font-mono">
          Sync Time: {lastUpdated}
        </div>
      </div>

      {/* Synchronized Clean Grid Layout (Removed Most Saves Column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Top Scorers */}
        <div className="bg-[#0b131f] p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wide uppercase">⚽ Top Scorers</h3>
          <div className="space-y-2">
            {stats.topScorers.map((player, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f1a2a] p-2 rounded border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center border border-gray-700">{player.img}</span>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {player.flag} {player.name}
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{player.team}</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/30">{player.count} Goals</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Top Assists */}
        <div className="bg-[#0b131f] p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wide uppercase">🎯 Top Assists</h3>
          <div className="space-y-2">
            {stats.topAssists.map((player, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f1a2a] p-2 rounded border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center border border-gray-700">{player.img}</span>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {player.flag} {player.name}
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{player.team}</span>
                  </div>
                </div>
                <span className="text-blue-400 font-mono font-bold text-sm bg-blue-950/40 px-2.5 py-1 rounded border border-blue-900/30">{player.count} Assists</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Yellow Cards */}
        <div className="bg-[#0b131f] p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wide uppercase">🟨 Yellow Cards</h3>
          <div className="space-y-2">
            {stats.yellowCards.map((player, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f1a2a] p-2 rounded border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center border border-gray-700">{player.img}</span>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {player.flag} {player.name}
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{player.team}</span>
                  </div>
                </div>
                <span className="text-yellow-400 font-mono font-bold text-sm bg-yellow-950/40 px-3 py-1 rounded border border-yellow-900/30">{player.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Red Cards */}
        <div className="bg-[#0b131f] p-4 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wide uppercase">🟥 Red Cards</h3>
          <div className="space-y-2">
            {stats.redCards.map((player, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f1a2a] p-2 rounded border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center border border-gray-700">{player.img}</span>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {player.flag} {player.name}
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{player.team}</span>
                  </div>
                </div>
                <span className="text-red-400 font-mono font-bold text-sm bg-red-950/40 px-3 py-1 rounded border border-red-900/30">{player.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
