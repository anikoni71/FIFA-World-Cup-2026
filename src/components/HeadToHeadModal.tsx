import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, TrendingUp, Users } from "lucide-react";
import { teams } from "@/data/teams";

interface HeadToHeadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  team1Code: string;
  team2Code: string;
}

export function HeadToHeadModal({
  isOpen,
  onOpenChange,
  team1Code,
  team2Code,
}: HeadToHeadModalProps) {
  const team1 = teams[team1Code];
  const team2 = teams[team2Code];

  if (!team1 || !team2) return null;

  // Mocked comparison data since it isn't in the API/teams.ts
  const stats = {
    team1: {
      winProb: Math.floor(Math.random() * 40) + 30, // 30-70%
      worldCups: Math.floor(Math.random() * 4),
      form: ["W", "D", "W", "L", "W"]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5),
      topScorer: "Striker (9)",
      keyStat: `${Math.floor(Math.random() * 20 + 10)} Goals`,
    },
    team2: {
      winProb: 0, // Calculated below
      worldCups: Math.floor(Math.random() * 3),
      form: ["W", "L", "D", "W", "W"]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5),
      topScorer: "Forward (10)",
      keyStat: `${Math.floor(Math.random() * 20 + 10)} Goals`,
    },
  };
  stats.team2.winProb = 100 - stats.team1.winProb;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-center text-sm font-bold tracking-widest uppercase text-muted-foreground">
            Head-to-Head Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Versus Section */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-6xl sm:text-7xl drop-shadow-md" title={team1.name}>
                {team1.flag}
              </span>
              <div className="text-center">
                <div className="text-lg font-bold">{team1Code}</div>
                <div className="text-xs text-muted-foreground">
                  {team1.name}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <div className="text-2xl font-black text-muted-foreground/30 italic">
                VS
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-6xl sm:text-7xl drop-shadow-md" title={team2.name}>
                {team2.flag}
              </span>
              <div className="text-center">
                <div className="text-lg font-bold">{team2Code}</div>
                <div className="text-xs text-muted-foreground">
                  {team2.name}
                </div>
              </div>
            </div>
          </div>

          {/* Win Probability Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold px-1">
              <span
                className={
                  stats.team1.winProb >= 50
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {stats.team1.winProb}% Win
              </span>
              <span
                className={
                  stats.team2.winProb > 50
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {stats.team2.winProb}% Win
              </span>
            </div>
            <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${stats.team1.winProb}%` }}
              />
              <div
                className="h-full bg-border transition-all duration-1000"
                style={{ width: `${stats.team2.winProb}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {/* Form */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3">
                <TrendingUp className="w-3.5 h-3.5" /> Recent Form
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {stats.team1.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${f === "W" ? "bg-green-500/20 text-green-500" : f === "L" ? "bg-red-500/20 text-red-500" : "bg-gray-500/20 text-gray-500"}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {stats.team2.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${f === "W" ? "bg-green-500/20 text-green-500" : f === "L" ? "bg-red-500/20 text-red-500" : "bg-gray-500/20 text-gray-500"}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                <History className="w-3.5 h-3.5" /> World Cup Titles
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-lg">{stats.team1.worldCups}</span>
                <span className="text-lg">{stats.team2.worldCups}</span>
              </div>
            </div>

            {/* Key Players */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3">
                <Users className="w-3.5 h-3.5" /> Key Players
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">{stats.team1.topScorer}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    ⚽ {stats.team1.keyStat}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="font-bold">{stats.team2.topScorer}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                    ⚽ {stats.team2.keyStat}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
