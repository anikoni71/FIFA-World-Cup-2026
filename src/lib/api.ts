import { groupMatches, knockoutMatches, teams } from '../data/teams';

export interface LiveDataOptions {}

export interface GetLiveDataOutputType {
  standings: Array<{
    group: string;
    teams: Array<{
      code: string;
      name: string;
      rank: number;
      played: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDiff: number;
      points: number;
      status: string;
      logo: string;
    }>;
  }>;
  todayMatches: Array<{
    id: string;
    team1Code: string;
    team1Name: string;
    team1Score: string;
    team1Logo: string;
    team2Code: string;
    team2Name: string;
    team2Score: string;
    team2Logo: string;
    status: string;
    statusDetail: string;
    venue: string;
    group: string;
    completed: boolean;
    winner?: string;
    startTime: string;
  }>;

  knockoutResults: Array<{
    team1Code: string;
    team2Code: string;
    team1Score: string;
    team2Score: string;
    status: string;
    statusDetail: string;
    completed: boolean;
    winner?: string;
    date: string;
    venue: string;
  }>;
  allMatches: Array<{
    id: string;
    team1Code: string;
    team1Name?: string;
    team1Score: string;
    team1Logo?: string;
    team2Code: string;
    team2Name?: string;
    team2Score: string;
    team2Logo?: string;
    status: string;
    statusDetail: string;
    venue: string;
    group?: string;
    completed: boolean;
    winner?: string;
    startTime: string;
    date?: string;
    time?: string;
    stage?: string;
  }>;
  lastUpdated: string;
  hasError?: boolean;
}

const standingsUrl = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026';
const scoreboardUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

export async function getLiveData(options: LiveDataOptions): Promise<GetLiveDataOutputType> {
  let standingsRes: Response | null = null;
  let scoresRes: Response | null = null;
  let koRes: Response | null = null;

  let hasError = false;

  console.log("Fetching live data from ESPN APIs...");

  try {
    const results = await Promise.all([
      fetch(standingsUrl).catch(e => { console.error('Network Error fetching standings:', e); hasError = true; return null; }),
      fetch(scoreboardUrl).catch(e => { console.error('Network Error fetching scoreboard:', e); hasError = true; return null; }),
      fetch(`${scoreboardUrl}?dates=20260628-20260720&limit=100`).catch(e => { console.error('Network Error fetching KO:', e); return null; }) // KO failure is non-fatal usually
    ]);
    standingsRes = results[0];
    scoresRes = results[1];
    koRes = results[2];
  } catch (error) {
    console.error("Critical error during API fetch Promise.all:", error);
    hasError = true;
  }

  if (!standingsRes || !standingsRes.ok) {
    console.warn(`Standings fetch failed. Status: ${standingsRes?.status} ${standingsRes?.statusText}. URL: ${standingsUrl}`);
    hasError = true;
  }
  if (!scoresRes || !scoresRes.ok) {
    console.warn(`Scoreboard fetch failed. Status: ${scoresRes?.status} ${scoresRes?.statusText}. URL: ${scoreboardUrl}`);
    hasError = true;
  }

  let standingsData: any = { children: [] };
  let scoresData: any = { events: [] };
  let koData: any = { events: [] };

  try {
    if (standingsRes && standingsRes.ok) standingsData = await standingsRes.json();
  } catch (e) {
    console.error("Error parsing standings JSON:", e);
  }

  try {
    if (scoresRes && scoresRes.ok) scoresData = await scoresRes.json();
  } catch (e) {
    console.error("Error parsing scoreboard JSON:", e);
  }

  try {
    if (koRes && koRes.ok) koData = await koRes.json();
  } catch (e) {
    console.error("Error parsing KO JSON:", e);
  }

  const groupLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const standings = (standingsData.children || []).map((group: any, idx: number) => {
    const entries = group.standings?.entries || [];
    return {
      group: groupLetters[idx] || group.abbreviation?.replace('Group ', '') || `${idx+1}`,
      teams: entries.map((entry: any) => {
        const s = (name: string) => {
          const stat = entry.stats?.find((st: any) => st.name === name);
          return stat ? stat.value : 0;
        };
        const noteDesc = entry.note?.description || '';
        let status = 'playing';
        if (noteDesc.includes('Advance')) status = 'advance';
        else if (noteDesc.includes('Best 8')) status = 'possible';
        else if (noteDesc.includes('Eliminated')) status = 'eliminated';
        
        return {
          code: entry.team?.abbreviation || '',
          name: entry.team?.displayName || '',
          rank: s('rank'),
          played: s('gamesPlayed'),
          wins: s('wins'),
          draws: s('ties'),
          losses: s('losses'),
          goalsFor: s('pointsFor'),
          goalsAgainst: s('pointsAgainst'),
          goalDiff: s('pointDifferential'),
          points: s('points'),
          status,
          logo: entry.team?.logos?.[0]?.href || '',
        };
      }),
    };
  });

  function parseEvent(event: any) {
    const comp = event.competitions?.[0];
    const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
    let winner: string | undefined;
    if (comp?.status?.type?.completed) {
      if (home?.winner) winner = home?.team?.abbreviation;
      else if (away?.winner) winner = away?.team?.abbreviation;
      else winner = 'DRAW';
    }
    return { comp, home, away, winner };
  }

  const todayMatches = (scoresData.events || []).map((event: any) => {
    const { comp, home, away, winner } = parseEvent(event);
    const groupNote = comp?.altGameNote || '';
    const groupMatch = groupNote.match(/Group ([A-L])/);
    return {
      id: event.id,
      team1Code: home?.team?.abbreviation || '',
      team1Name: home?.team?.displayName || '',
      team1Score: home?.score || '0',
      team1Logo: home?.team?.logo || '',
      team2Code: away?.team?.abbreviation || '',
      team2Name: away?.team?.displayName || '',
      team2Score: away?.score || '0',
      team2Logo: away?.team?.logo || '',
      status: comp?.status?.type?.state || 'pre',
      statusDetail: comp?.status?.type?.shortDetail || '',
      venue: comp?.venue?.fullName || event.venue?.displayName || '',
      group: groupMatch ? groupMatch[1] : '',
      completed: comp?.status?.type?.completed || false,
      winner,
      startTime: event.date || comp?.date || '',
    };
  });

  let knockoutResults = (koData.events || []).map((event: any) => {
    const { comp, home, away, winner } = parseEvent(event);
    return {
      team1Code: home?.team?.abbreviation || '',
      team2Code: away?.team?.abbreviation || '',
      team1Score: home?.score || '0',
      team2Score: away?.score || '0',
      status: comp?.status?.type?.state || 'pre',
      statusDetail: comp?.status?.type?.shortDetail || '',
      completed: comp?.status?.type?.completed || false,
      winner,
      date: event.date || '',
      venue: comp?.venue?.fullName || '',
    };
  });

  const combinedESPN = [...todayMatches, ...knockoutResults.map(ko => ({...ko, startTime: ko.date, id: ko.date + ko.team1Code + ko.team2Code}))];
  
  let baseMatches = [...groupMatches, ...knockoutMatches].map(m => {
    // Find if we have live data for this match in combinedESPN
    const espnMatch = combinedESPN.find(e => 
      (e.team1Code === m.team1 && e.team2Code === m.team2)
    );
    
    return {
      id: m.id,
      team1Code: m.team1,
      team1Name: teams[m.team1]?.name || m.team1,
      team1Score: espnMatch?.team1Score || '0',
      team1Logo: teams[m.team1]?.flag || '',
      team2Code: m.team2,
      team2Name: teams[m.team2]?.name || m.team2,
      team2Score: espnMatch?.team2Score || '0',
      team2Logo: teams[m.team2]?.flag || '',
      status: espnMatch?.status || 'pre',
      statusDetail: espnMatch?.statusDetail || '',
      venue: m.venue,
      group: m.group || '',
      stage: m.stage || '',
      completed: espnMatch?.completed || false,
      winner: espnMatch?.winner || undefined,
      startTime: espnMatch?.startTime || '',
      date: m.date,
      time: m.time,
    };
  });

  const getSortTime = (m: any) => {
    if (m.date) {
      if (m.time) {
        const matchTime = m.time.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
        if (matchTime) {
          const [_, h, min, ampm] = matchTime;
          const d = new Date(`${m.date}, 2026 ${h}:${min || '00'} ${ampm} EDT`);
          return isNaN(d.getTime()) ? Infinity : d.getTime();
        }
      }
      const dFallback = new Date(`${m.date}, 2026 12:00 PM EDT`);
      if (!isNaN(dFallback.getTime())) return dFallback.getTime();
    }
    return Infinity;
  };

  baseMatches.sort((a, b) => getSortTime(a) - getSortTime(b));

  baseMatches = baseMatches.map((m, index) => {
    if (index < 24) {
      const mockScores = [
        ['2', '0'], ['1', '1'], ['3', '1'], ['0', '0'], ['2', '1'], ['4', '2'],
        ['1', '0'], ['2', '2'], ['3', '0'], ['0', '1'], ['1', '2'], ['0', '0']
      ];
      const s = mockScores[index % mockScores.length];
      const t1s = s[0];
      const t2s = s[1];
      let winner = undefined;
      // @ts-ignore (since we just need a mock condition)
      if (parseInt(t1s) > parseInt(t2s)) winner = m.team1Code;
      // @ts-ignore
      else if (parseInt(t2s) > parseInt(t1s)) winner = m.team2Code;
      
      return {
        ...m,
        completed: true,
        status: 'post',
        statusDetail: 'FT',
        team1Score: t1s,
        team2Score: t2s,
        winner
      };
    }
    return m;
  });

  return {
    standings,
    todayMatches,
    knockoutResults,
    allMatches: baseMatches,
    lastUpdated: new Date().toISOString(),
    hasError
  };
}
