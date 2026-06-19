import React, { useState } from 'react';
import { ResultCard, Match } from './ResultCard';
import MatchDetailsModal from './MatchDetailsModal';

export default function MatchResultsGrid({ matches }: { matches: any[] }) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  // Map our match objects to the interface the user expects
  const mappedMatches: Match[] = matches.map(m => ({
    id: m.id,
    date: m.startTime || m.date, // Try ISO first
    team1Code: m.team1Code,
    team1Name: m.team1Name,
    team1Score: m.team1Score,
    team1Logo: m.team1Logo,
    team2Code: m.team2Code,
    team2Name: m.team2Name,
    team2Score: m.team2Score,
    team2Logo: m.team2Logo,
    status: m.status,
    statusDetail: m.statusDetail,
    completed: m.completed,
    winner: m.winner,
    venue: m.venue,
    group: m.group,
    stage: m.stage
  }));

  const completed = mappedMatches.filter(m => m.completed);
  
  if (completed.length === 0) return (
    <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-4">
      <p className="text-sm font-medium">No results available yet. The tournament starts June 11, 2026.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {completed.map(m => (
          <ResultCard 
            key={m.id} 
            m={m} 
            onClick={(id) => setSelectedMatchId(id)}
          />
        ))}
      </div>

      <MatchDetailsModal 
        matchId={selectedMatchId} 
        onClose={() => setSelectedMatchId(null)} 
      />
    </div>
  );
}
