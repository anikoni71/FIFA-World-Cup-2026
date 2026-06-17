import { GetLiveDataOutputType } from './api';
import { knockoutMatches, teams } from '@/data/teams';

export function resolveBracket(
  standings: GetLiveDataOutputType['standings'],
  knockoutResults: GetLiveDataOutputType['knockoutResults']
) {
  const resolvedTeams = new Map<string, string>(); // placeholder -> team code
  const matchWinners = new Map<string, string>(); // match id -> winner team code

  // Helper to extract team code for a group position e.g., '1E' -> Group E, Rank 1
  const resolveGroupPosition = (placeholder: string) => {
    const match = placeholder.match(/^(\d)([A-L])$/);
    if (match) {
      const position = parseInt(match[1]);
      const groupLetter = match[2];
      const groupStandings = standings.find(s => s.group === groupLetter);
      if (groupStandings) {
        // Find team by rank or array index if rank is duplicated
        const sortedTeams = [...groupStandings.teams].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
        if (sortedTeams[position - 1]) {
          return sortedTeams[position - 1].code;
        }
      }
    }
    
    // For 3rd place teams placeholder like '3ABCDF'
    const thirdMatch = placeholder.match(/^3([A-L]+)$/);
    if (thirdMatch) {
      const validGroups = thirdMatch[1].split('');
      // Gather all 3rd place teams from all valid groups
      const thirdPlaceTeams: any[] = [];
      validGroups.forEach((g: string) => {
        const groupStandings = standings.find(s => s.group === g);
        if (groupStandings) {
          const sortedTeams = [...groupStandings.teams].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
          if (sortedTeams[2]) {
            thirdPlaceTeams.push({ group: g, team: sortedTeams[2] });
          }
        }
      });
      // Sort them globally
      thirdPlaceTeams.sort((a, b) => b.team.points - a.team.points || b.team.goalDiff - a.team.goalDiff || b.team.goalsFor - a.team.goalsFor);
      if (thirdPlaceTeams.length > 0) {
        // Return the best one for this placeholder (this is a simplified logic since we don't have the real complex 8-team grid mapping)
        return thirdPlaceTeams[0].team.code;
      }
    }

    return null;
  };

  // 1. Resolve Round of 32 from standings
  knockoutMatches.filter(m => m.stage === 'Round of 32').forEach(match => {
    let t1 = resolveGroupPosition(match.team1);
    let t2 = resolveGroupPosition(match.team2);
    if (t1) resolvedTeams.set(match.team1, t1);
    if (t2) resolvedTeams.set(match.team2, t2);
  });

  // Helper to determine winner from live results
  const getWinner = (mId: string, scheduledTeam1: string, scheduledTeam2: string) => {
    const res = knockoutResults?.find(k => 
      (k.team1Code === scheduledTeam1 && k.team2Code === scheduledTeam2) ||
      (k.team2Code === scheduledTeam1 && k.team1Code === scheduledTeam2)
    );
    if (res && res.completed && res.winner) return res.winner;
    return null;
  };

  // Helper to resolve W(matchId) or L(matchId)
  const resolveNode = (placeholder: string): string => {
    if (!placeholder.includes('(')) {
      return resolvedTeams.get(placeholder) || placeholder; // group position
    }

    const match = placeholder.match(/^W\((.+)\)$/);
    if (match) {
      const parentId = match[1];
      return matchWinners.get(parentId) || 'TBD';
    }

    const lossMatch = placeholder.match(/^L\((.+)\)$/);
    if (lossMatch) {
      const parentId = lossMatch[1];
      const parentMatch = knockoutMatches.find(m => m.id === parentId);
      if (parentMatch) {
        const pT1 = resolveNode(parentMatch.team1);
        const pT2 = resolveNode(parentMatch.team2);
        const winner = matchWinners.get(parentId);
        if (winner && pT1 !== 'TBD' && pT2 !== 'TBD') {
          return winner === pT1 ? pT2 : pT1;
        }
      }
      return 'TBD';
    }

    return placeholder;
  };

  // Iterate over rounds in order to propagate winners
  const stagesInOrder = ['Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];

  stagesInOrder.forEach(stage => {
    knockoutMatches.filter(m => m.stage === stage).forEach(m => {
      const t1 = resolveNode(m.team1);
      const t2 = resolveNode(m.team2);
      
      const winner = getWinner(m.id, t1, t2);
      // Wait, simulated win propagation if testing with current standings
      // Let's just let it be TBD if no actual result exists. The user wants it to display teams.
      if (winner) {
        matchWinners.set(m.id, winner);
      }
    });
  });

  return { resolveNode, matchWinners };
}
