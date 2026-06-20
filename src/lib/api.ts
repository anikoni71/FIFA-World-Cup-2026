import { groupMatches, knockoutMatches, teams } from '../data/teams';

export interface LiveDataOptions {}

export interface GetLiveDataOutputType {
  standings: Array<{
    group: string;
    teams: Array<{
      id: string;
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
    bdt: {
      date: string;
      time: string;
      dayLabel: string;
      sortTime: number;
    };
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
    bdt: {
      date: string;
      time: string;
      dayLabel: string;
      sortTime: number;
    };
  }>;
  playerStats: Array<{
    category: string;
    categoryLabel: string;
    players: Array<{
      rank: number;
      name: string;
      team: string;
      teamLogo: string;
      value: string | number;
      headshot?: string;
    }>;
  }>;
  lastUpdated: string;
  hasError?: boolean;
}

export interface TeamDetails {
  squad: Array<{
    id: string;
    name: string;
    position: string;
    age: number;
    club: string;
    role?: string;
    number?: string;
  }>;
  recentForm: Array<{
    id: string;
    opponentCode: string;
    opponentName: string;
    score: string;
    result: 'W' | 'D' | 'L';
    date: string;
  }>;
}

export async function getTeamDetails(teamId: string, teamCode: string, allMatches: any[]): Promise<TeamDetails> {
  let squad: any[] = [];
  
  if (teamId) {
    try {
      const res = await fetch(`/api/team?id=${teamId}`);
      if (res.ok) {
        const data = await res.json();
        squad = (data.athletes || []).flatMap((group: any) => 
          (group.items || []).map((player: any) => ({
            id: player.id,
            name: player.displayName,
            position: player.position?.displayName || group.name,
            age: player.age,
            club: player.location,
            role: group.name,
            number: player.jersey
          }))
        );
      }
    } catch (e) {
      console.error("Error fetching squad:", e);
    }
  }

  // Recent Form from allMatches (up to 5 most recent completed matches)
  const recentForm = allMatches
    .filter(m => m.completed && (m.team1Code === teamCode || m.team2Code === teamCode) && m.bdt)
    .sort((a, b) => (b.bdt?.sortTime || 0) - (a.bdt?.sortTime || 0))
    .slice(0, 5)
    .map(m => {
      const isTeam1 = m.team1Code === teamCode;
      const opponentCode = isTeam1 ? m.team2Code : m.team1Code;
      const opponentName = isTeam1 ? m.team2Name : m.team1Name;
      const t1s = parseInt(m.team1Score);
      const t2s = parseInt(m.team2Score);
      
      let result: 'W' | 'D' | 'L' = 'D';
      if (isTeam1) {
        if (t1s > t2s) result = 'W';
        else if (t1s < t2s) result = 'L';
      } else {
        if (t2s > t1s) result = 'W';
        else if (t2s < t1s) result = 'L';
      }

      return {
        id: m.id,
        opponentCode,
        opponentName,
        score: `${m.team1Score}-${m.team2Score}`,
        result,
        date: m.bdt?.date || 'Unknown'
      };
    });

  return { squad, recentForm };
}

/**
 * Accurate timestamp parsing for World Cup venues.
 */
export function getMatchTimestamp(dateStr: string, timeStr: string, venueStr: string): number {
  if (!dateStr || !timeStr || timeStr.toLowerCase().includes('tbd')) return Infinity;

  const venue = venueStr.toLowerCase();
  let tzOffset = '-06:00'; // Default: Central (Mexico/Dallas)

  if (venue.includes('toronto') || venue.includes('atlanta') || venue.includes('new york') || 
      venue.includes('boston') || venue.includes('philadelphia') || venue.includes('miami')) {
    tzOffset = '-04:00'; // Eastern Daylight
  } else if (venue.includes('vancouver') || venue.includes('san francisco') || 
             venue.includes('los angeles') || venue.includes('seattle')) {
    tzOffset = '-07:00'; // Pacific Daylight
  } else if (venue.includes('mexico city') || venue.includes('guadalajara') || venue.includes('monterrey')) {
    tzOffset = '-06:00';
  } else if (venue.includes('dallas') || venue.includes('houston') || venue.includes('kansas city')) {
    tzOffset = '-05:00';
  }

  const timeMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!timeMatch) return Infinity;

  const [_, h, m, ampm] = timeMatch;
  let hours = parseInt(h);
  if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

  // The new data has dates like '12 Jun (Fri)'
  const dateParts = dateStr.split(' ');
  const dayStr = dateParts[0]; // e.g. '12'
  const monthMap: Record<string, string> = { 'Jun': '06', 'Jul': '07', 'June': '06', 'July': '07' };
  const monthName = dateParts.length > 1 ? dateParts[1] : 'Jun';
  const month = monthMap[monthName] || monthMap['June'];
  const day = dayStr.padStart(2, '0');

  // If timeStr explicitly contains BDT, it means the time is ALREADY in BDT (+06:00)
  if (timeStr.toLowerCase().includes('bdt')) {
    tzOffset = '+06:00';
  }

  const iso = `2026-${month}-${day}T${hours.toString().padStart(2, '0')}:${(m || '00').padStart(2, '0')}:00${tzOffset}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? Infinity : d.getTime();
}

/**
 * Formats a timestamp into a robust BDT date/time object.
 */
export function formatToBDT(timestamp: number) {
  if (timestamp === Infinity) return { date: 'TBD', time: 'TBD', dayLabel: 'TBD', sortTime: Infinity };

  const d = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const parts = formatter.formatToParts(d);
  let hour = '', minute = '', dayPeriod = '', month = '', day = '', weekday = '';
  for (const part of parts) {
    if (part.type === 'hour') hour = part.value;
    if (part.type === 'minute') minute = part.value;
    if (part.type === 'dayPeriod') dayPeriod = part.value;
    if (part.type === 'month') month = part.value;
    if (part.type === 'day') day = part.value;
    if (part.type === 'weekday') weekday = part.value;
  }

  return {
    date: `${day} ${month} (${weekday})`,
    time: `${hour}:${minute} ${dayPeriod.toUpperCase()}`,
    dayLabel: `${weekday}, ${day} ${month}`,
    sortTime: timestamp
  };
}

export async function getLiveData(options: LiveDataOptions): Promise<GetLiveDataOutputType> {
  let hasError = false;
  let data: any = null;

  try {
    const res = await fetch('/api/live');
    if (res.ok) {
      data = await res.json();
    } else {
      hasError = true;
    }
  } catch (error) {
    console.error("Error fetching live data from proxy:", error);
    hasError = true;
  }

  // Use data from proxy or empty fallbacks
  const standings = data?.standings || [];
  const todayMatches = (data?.todayMatches || []).map((m: any) => ({
    ...m,
    bdt: m.bdt || formatToBDT(m.startTime ? new Date(m.startTime).getTime() : Infinity)
  }));
  const knockoutResults = (data?.knockoutResults || []).map((m: any) => ({
    ...m,
    bdt: m.bdt || formatToBDT(m.startTime ? new Date(m.startTime).getTime() : 
                 (m.date ? new Date(m.date).getTime() : Infinity))
  }));
  let playerStats = data?.playerStats || [];

  // Robust Fallback for 2026 with realistic names and categories requested
  if (playerStats.length < 3) {
    playerStats = [
      {
        category: 'goals',
        categoryLabel: 'Top Scorers',
        players: [
          { rank: 1, name: 'Jonathan David', team: 'Canada', teamLogo: '🇨🇦', value: 3, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/264511.png' },
          { rank: 2, name: 'Lionel Messi', team: 'Argentina', teamLogo: '🇦🇷', value: 3, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/45843.png' },
          { rank: 3, name: 'Cyle Larin', team: 'Canada', teamLogo: '🇨🇦', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/188812.png' },
          { rank: 4, name: 'Kylian Mbappé', team: 'France', teamLogo: '🇫🇷', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/215662.png' },
          { rank: 5, name: 'Vinícius Júnior', team: 'Brazil', teamLogo: '🇧🇷', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/231353.png' }
        ]
      },
      {
        category: 'assists',
        categoryLabel: 'Top Assists',
        players: [
          { rank: 1, name: 'Alexander Isak', team: 'Sweden', teamLogo: '🇸🇪', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/253683.png' },
          { rank: 2, name: 'Brahim Díaz', team: 'Morocco', teamLogo: '🇲🇦', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/240391.png' },
          { rank: 3, name: 'Joshua Kimmich', team: 'Germany', teamLogo: '🇩🇪', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/196650.png' },
          { rank: 4, name: 'Deniz Undav', team: 'Germany', teamLogo: '🇩🇪', value: 2, headshot: 'https://a.espncdn.com/i/headshots/soccer/players/full/222162.png' }
        ]
      },
      {
        category: 'saves',
        categoryLabel: 'Most Saves',
        players: [
          { rank: 1, name: 'Emi Martínez', team: 'Argentina', teamLogo: teams['ARG'].flag, value: 18 },
          { rank: 2, name: 'Thibaut Courtois', team: 'Belgium', teamLogo: teams['BEL'].flag, value: 15 },
          { rank: 3, name: 'Jordan Pickford', team: 'England', teamLogo: teams['ENG'].flag, value: 14 },
          { rank: 4, name: 'Alisson Becker', team: 'Brazil', teamLogo: teams['BRA'].flag, value: 12 },
          { rank: 5, name: 'Mike Maignan', team: 'France', teamLogo: teams['FRA'].flag, value: 11 }
        ]
      },
      {
        category: 'yellowCards',
        categoryLabel: 'Yellow Cards',
        players: [
          { rank: 1, name: 'Teboho Mokoena', team: 'South Africa', teamLogo: '🇿🇦', value: 2 },
          { rank: 2, name: 'Antonee Robinson', team: 'USA', teamLogo: '🇺🇸', value: 1 }
        ]
      },
      {
        category: 'redCards',
        categoryLabel: 'Red Cards',
        players: [
          { rank: 1, name: 'César Montes', team: 'Mexico', teamLogo: '🇲🇽', value: 1 },
          { rank: 2, name: 'Assim Madibo', team: 'Qatar', teamLogo: '🇶🇦', value: 1 }
        ]
      }
    ];
  }

  const combinedESPN = [...todayMatches, ...knockoutResults.map(ko => ({...ko, startTime: ko.date, id: ko.date + ko.team1Code + ko.team2Code}))];
  
  const allMatchesSorted = [...groupMatches, ...knockoutMatches].map(m => {
    // Find if we have live data for this match in combinedESPN
    const espnMatch = combinedESPN.find(e => 
      (e.team1Code === m.team1 && e.team2Code === m.team2)
    );
    
    const timestamp = getMatchTimestamp(m.date || '', m.time || '', m.venue || '');
    const bdt = formatToBDT(timestamp);
    
    // Default values if no live data
    let status = 'pre';
    let statusDetail = 'Scheduled';
    let completed = false;
    let team1Score = '0';
    let team2Score = '0';
    let winner = undefined;

    const now = Date.now();
    const duration = 110 * 60 * 1000;

    // Use ESPN data if available
    if (espnMatch) {
      status = espnMatch.status || 'pre';
      statusDetail = espnMatch.statusDetail || 'Scheduled';
      completed = espnMatch.completed || false;
      team1Score = espnMatch.team1Score || '0';
      team2Score = espnMatch.team2Score || '0';
      winner = espnMatch.winner;
    } else {
      // Fallback for real-time status if no ESPN data but time has passed
      if (timestamp !== Infinity) {
        if (now > timestamp + duration) {
          status = 'post';
          statusDetail = 'FT';
          completed = true;
          // In real application, we would NOT invent scores here. 
          // They stay 0-0 until real data comes.
        } else if (now > timestamp) {
          status = 'in';
          const mins = Math.floor((now - timestamp) / 60000);
          statusDetail = mins > 90 ? '90+\'' : `${mins}'`;
        }
      }
    }
    
    return {
      id: m.id,
      team1Code: m.team1,
      team1Name: teams[m.team1]?.name || m.team1,
      team1Score: m.id === "m22" || m.id === "m21" ? "0" : team1Score, // Will overwrite later
      team1Logo: teams[m.team1]?.flag || '',
      team2Code: m.team2,
      team2Name: teams[m.team2]?.name || m.team2,
      team2Score: m.id === "m22" || m.id === "m21" ? "0" : team2Score, // Will overwrite later
      team2Logo: teams[m.team2]?.flag || '',
      status: m.id === "m22" || m.id === "m21" ? "in" : status,
      statusDetail: m.id === "m22" || m.id === "m21" ? "LIVE" : statusDetail,
      venue: m.venue,
      group: m.group || '',
      stage: m.stage || '',
      completed: m.id === "m22" || m.id === "m21" ? false : completed,
      winner,
      startTime: espnMatch?.startTime || (timestamp !== Infinity ? new Date(timestamp).toISOString() : ''),
      date: m.id === "m22" || m.id === "m21" ? "LIVE" : m.date,
      time: m.time,
      bdt,
      team1Scorers: [] as string[],
      team2Scorers: [] as string[]
    };
  }).sort((a, b) => (a.bdt.sortTime || 0) - (b.bdt.sortTime || 0));

  // --- START SIMULATION INJECTION FOR USA AND TURKEY MATCHES ---
  const nowForSim = Date.now();
  const simStart = 1718000000000; // arbitrary fixed point in past
  const elapsedMinutes = Math.floor((nowForSim - simStart) / 8000) % 95; // Loops 0-95 fast
  
  // Historical Matches Injection
  const match19 = allMatchesSorted.find(m => m.id === "m19" || (m.team1Code === "USA" && m.team2Code === "AUS" && m.id === "m21")); // Wait, m19 is USA vs PAR in original data, but the prompt says m19 is USA vs AUS. Let's just override by id m21 or m19.
  const usaAusMatch = allMatchesSorted.find(m => m.team1Code === "USA" && m.team2Code === "AUS") || allMatchesSorted.find(m => m.id === "m19");
  if (usaAusMatch) {
    usaAusMatch.statusDetail = "FT";
    usaAusMatch.completed = true;
    usaAusMatch.team1Score = "2";
    usaAusMatch.team2Score = "0";
    usaAusMatch.team1Scorers = ["⚽ 12' Pulisic", "⚽ 68' Balogun"];
    usaAusMatch.team2Scorers = [];
  }

  const match15 = allMatchesSorted.find(m => m.id === "m15" || (m.team1Code === "SCO" && m.team2Code === "MAR"));
  if (match15) {
    match15.statusDetail = "FT";
    match15.completed = true;
    match15.team1Score = "0";
    match15.team2Score = "1";
    match15.team1Scorers = [];
    match15.team2Scorers = ["⚽ 41' En-Nesyri"];
  }

  const match16 = allMatchesSorted.find(m => m.id === "m16" || (m.team1Code === "BRA" && m.team2Code === "HAI"));
  if (match16) {
    match16.statusDetail = "FT";
    match16.completed = true;
    match16.team1Score = "3";
    match16.team2Score = "0";
    match16.team1Scorers = ["⚽ 18' Vinícius Jr", "⚽ 45' Rodrygo", "⚽ 82' Endrick"];
    match16.team2Scorers = [];
  }

  // TUR vs PAR
  const turMatch = allMatchesSorted.find(m => m.team1Code === "TUR" && m.team2Code === "PAR") || allMatchesSorted.find(m => m.id === "m22");
  if (turMatch) {
    turMatch.status = "in";
    turMatch.statusDetail = `${Math.min(96, 45 + elapsedMinutes)}' • LIVE`;
    
    // Simulate a goal around 85th minute for TUR
    const hasTurScored = elapsedMinutes > 85; 
    
    turMatch.team1Score = hasTurScored ? "1" : "0";
    turMatch.team2Score = "1";
    
    const hScorers = [];
    if (Math.random() > 0.5 && hasTurScored) {
        hScorers.push(`⚽ ${Math.min(96, 45 + elapsedMinutes)}' Güler`);
    } else if (hasTurScored) {
        hScorers.push(`⚽ 86' Yılmaz`);
    }

    turMatch.team1Scorers = hScorers;
    turMatch.team2Scorers = ["⚽ 24' Almirón"];
  }
  // --- END SIMULATION INJECTION ---

  return {
    standings,
    todayMatches,
    knockoutResults,
    playerStats,
    allMatches: allMatchesSorted,
    lastUpdated: new Date().toISOString(),
    hasError
  };
}
