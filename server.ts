import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const standingsUrl = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026';
const scoreboardUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const statsUrl = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/statistics';

const app = express();

const formatToBDT = (timestamp: number) => {
  if (timestamp === Infinity || isNaN(timestamp)) return { date: 'TBD', time: 'TBD', dayLabel: 'TBD', sortTime: Infinity };
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
};

// API constraints for backend server
app.get("/api/live", async (req, res) => {
  try {
    const [standingsRes, scoresRes, koRes, statsRes] = await Promise.all([
      fetch(standingsUrl),
      fetch(scoreboardUrl),
      fetch(`${scoreboardUrl}?dates=20260628-20260720&limit=100`).catch(() => null),
      fetch(statsUrl).catch(() => null)
    ]);

    const standingsData = await standingsRes.json() as any;
    const scoresData = await scoresRes.json() as any;
    const koData = koRes ? await koRes.json() as any : { events: [] };
    const statsData = statsRes ? await statsRes.json() as any : { categories: [] };

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
            id: entry.team?.id || '',
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
      const startTime = event.date || comp?.date || '';
      const ts = startTime ? new Date(startTime).getTime() : Infinity;
      const bdt = formatToBDT(ts);

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
        startTime,
        bdt
      };
    });

    const knockoutResults = (koData.events || []).map((event: any) => {
      const { comp, home, away, winner } = parseEvent(event);
      const startTime = event.date || comp?.date || '';
      const ts = startTime ? new Date(startTime).getTime() : Infinity;
      const bdt = formatToBDT(ts);

      return {
        id: event.id,
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
        bdt
      };
    });

    const playerStats = (statsData.categories || []).map((cat: any) => ({
      category: cat.name,
      categoryLabel: cat.displayName,
      players: (cat.athletes || []).map((athlete: any, idx: number) => ({
        rank: idx + 1,
        name: athlete.athlete?.displayName || '',
        team: athlete.team?.displayName || athlete.team?.abbreviation || '',
        teamLogo: athlete.team?.logos?.[0]?.href || '',
        value: athlete.displayValue || athlete.value || '0',
        headshot: athlete.athlete?.headshot?.href
      }))
    }));

    res.json({
      standings,
      todayMatches,
      knockoutResults,
      playerStats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch live data" });
  }
});

app.get("/api/team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/${id}/roster`);
    if (!response.ok) throw new Error("Failed to fetch roster");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch team details" });
  }
});

app.get("/api/match-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`);
    if (!response.ok) throw new Error("Failed to fetch match summary");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match details" });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 is critical for container routing
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Local server execution
if (process.env.VERCEL === undefined) {
  startServer();
}

// Export for Vercel Serverless
export default app;
