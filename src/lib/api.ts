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
}

export async function getLiveData(options: LiveDataOptions): Promise<GetLiveDataOutputType> {
  const res = await fetch('/api/live');
  if (!res.ok) {
    throw new Error('Failed to fetch live data from backend');
  }
  return await res.json() as GetLiveDataOutputType;
}
