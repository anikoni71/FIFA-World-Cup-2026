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

  return {
    standings,
    todayMatches,
    knockoutResults,
    lastUpdated: new Date().toISOString(),
    hasError
  };
}
