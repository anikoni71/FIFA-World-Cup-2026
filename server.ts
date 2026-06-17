import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const standingsUrl = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026';
const scoreboardUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API constraints for backend server
  app.get("/api/live", async (req, res) => {
    try {
      const standingsRes = await fetch(standingsUrl);
      const standingsData = await standingsRes.json() as any;

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

      const scoresRes = await fetch(scoreboardUrl);
      const scoresData = await scoresRes.json() as any;

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

      let knockoutResults: any[] = [];
      try {
        const koRes = await fetch(`${scoreboardUrl}?dates=20260628-20260720&limit=100`);
        const koData = await koRes.json() as any;
        knockoutResults = (koData.events || []).map((event: any) => {
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
      } catch {
        // No knockout data yet
      }

      res.json({
        standings,
        todayMatches,
        knockoutResults,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch live data" });
    }
  });

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
