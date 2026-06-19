import React from 'react';

export interface TeamStats {
  id: string;
  name: string;
  flagUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  points: number;
}

export interface GroupStandings {
  groupName: string; // e.g., "Group A"
  teams: TeamStats[];
}

interface StandingsGridProps {
  groups: GroupStandings[];
}

export const StandingsGrid: React.FC<StandingsGridProps> = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
      {groups.map((group) => (
        <div 
          key={group.groupName} 
          className="bg-[#111827] border border-gray-800 rounded-lg p-3 shadow-lg"
        >
          {/* Group Header */}
          <h3 className="text-gray-400 font-semibold tracking-wider uppercase mb-2 text-sm border-b border-gray-800 pb-1">
            {group.groupName}
          </h3>

          {/* Table Headers */}
          <div className="grid grid-cols-12 text-gray-500 font-medium pb-1 mb-1 text-center border-b border-gray-900">
            <div className="col-span-5 text-left">Team</div>
            <div className="col-span-1">P</div>
            <div className="col-span-1">W</div>
            <div className="col-span-1">D</div>
            <div className="col-span-1">L</div>
            <div className="col-span-1">GD</div>
            <div className="col-span-2 font-bold text-gray-400">PTS</div>
          </div>

          {/* Team Rows */}
          <div className="space-y-1">
            {group.teams.map((team, idx) => {
              // Highlight qualification zones (top 2 teams)
              const isQualificationZone = idx < 2;

              return (
                <div 
                  key={team.id} 
                  className="grid grid-cols-12 items-center text-center py-1.5 hover:bg-gray-800/30 rounded transition-colors text-gray-300"
                >
                  {/* Team Name & Position Indicator */}
                  <div className="col-span-5 flex items-center gap-2 text-left font-medium">
                    <span className={`w-1 h-4 rounded-sm ${isQualificationZone ? 'bg-green-500' : 'bg-transparent'}`} />
                    <img src={team.flagUrl} alt="" className="w-4 h-3.5 object-cover rounded-sm border border-gray-700" />
                    <span className="truncate">{team.name}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="col-span-1 text-gray-400">{team.played}</div>
                  <div className="col-span-1">{team.won}</div>
                  <div className="col-span-1">{team.drawn}</div>
                  <div className="col-span-1">{team.lost}</div>
                  <div className="col-span-1 font-mono text-gray-400">
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </div>
                  <div className="col-span-2 font-bold text-white font-mono">{team.points}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
