import React, { useState, useEffect } from 'react';
import { Trophy, CalendarDays, MapPin } from 'lucide-react';
import type { Match } from '@/types';

interface AllMatchScheduleWorkstationProps {
  allMatches?: Match[];
}

export default function AllMatchScheduleWorkstation({ allMatches = [] }: AllMatchScheduleWorkstationProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  if (!allMatches.length) return <div className="text-center p-8 text-slate-400">Loading schedule...</div>;

  // Group matches by stage
  const groupMatchCards = allMatches.filter(m => m.stage && m.stage.includes('Group'));
  
  // Custom knockout groupings
  const rd32 = allMatches.filter(m => m.stage === 'Round of 32');
  const rd16 = allMatches.filter(m => m.stage === 'Round of 16');
  const qf = allMatches.filter(m => m.stage === 'Quarter-finals');
  const sf = allMatches.filter(m => m.stage === 'Semi-finals');
  const thirdPlace = allMatches.filter(m => m.stage === 'Third Place');
  const final = allMatches.filter(m => m.stage === 'Final');

  const sections = [
    { title: 'Group Stage', matches: groupMatchCards },
    { title: 'Round of 32', matches: rd32 },
    { title: 'Round of 16', matches: rd16 },
    { title: 'Quarter-finals', matches: qf },
    { title: 'Semi-finals', matches: sf },
    { title: 'Third place play-off', matches: thirdPlace },
    { title: 'Final', matches: final }
  ].filter(section => section.matches.length > 0);

  const getCountdown = (sortTime?: number, status?: string, completed?: boolean) => {
    if (completed) return <span className="text-[#1a73e8] bg-[#e8f0fe] px-1.5 py-[2px] rounded text-[0.75rem] font-semibold">FT</span>;
    if (status === 'in') return <span className="text-[#e81123] bg-[#fce8e6] px-1.5 py-[2px] rounded text-[0.75rem] font-semibold animate-pulse">LIVE / FT</span>;
    if (!sortTime) return <span className="text-[#1a73e8] bg-[#e8f0fe] px-1.5 py-[2px] rounded text-[0.75rem] font-semibold">TBD</span>;

    const diff = sortTime - now;
    if (diff <= 0) return <span className="text-[#e81123] bg-[#fce8e6] px-1.5 py-[2px] rounded text-[0.75rem] font-semibold animate-pulse">LIVE / FT</span>;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let text = "";
    if (days > 0) text += `${days}d `;
    text += `${hours}h ${minutes}m left`;

    return <span className="text-[#1a73e8] bg-[#e8f0fe] px-1.5 py-[2px] rounded text-[0.75rem] font-semibold">{text}</span>;
  };

  const getTeamDisplay = (code: string, name: string, logo: string, score?: string) => {
    const hasScore = score !== undefined && score !== null && score !== "";
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center text-[1rem] font-medium text-[#1a1a1a]">
          {logo ? (
            <span className="w-6 h-6 mr-3 text-lg leading-none inline-flex items-center justify-center">{logo}</span>
          ) : (
            <span className="w-6 h-6 mr-3 bg-[#eee] rounded-full inline-block" />
          )}
          <span className="truncate">{name || code}</span>
        </div>
        {hasScore && (
          <span className="font-bold text-[1rem] text-[#1a1a1a] pr-2">{score}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 max-w-[800px] mx-auto bg-[#f8f9fa] p-4 text-[#1a1a1a] rounded-xl font-sans">
      {sections.map(section => (
        <div key={section.title}>
          <div className="text-[1.2rem] font-semibold text-[#1a1a1a] border-b border-[#dadce0] mb-3 pb-2 font-sans">
            {section.title}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.matches.map(m => (
              <div key={m.id} className="bg-[#ffffff] border border-[#dadce0] rounded-lg p-4 flex justify-between items-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                
                <div className="flex flex-col gap-3 flex-grow">
                  {getTeamDisplay(m.team1Code, m.team1Name, m.team1Logo, m.team1Score)}
                  {getTeamDisplay(m.team2Code, m.team2Name, m.team2Logo, m.team2Score)}
                </div>

                <div className="border-l border-[#dadce0] pl-4 text-right min-w-[110px]">
                  <div className="font-bold text-[0.95rem] text-[#1a1a1a]">
                    {m.bdt?.time || m.time || 'TBD'}
                  </div>
                  <div className="text-[0.8rem] text-[#5f6368] mt-0.5">
                    {m.bdt?.dayLabel || m.date || 'TBD'}
                  </div>
                  <div className="mt-1">
                    {getCountdown(m.bdt?.sortTime, m.status, m.completed)}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}
      
      <footer className="mt-10 text-center text-[0.8rem] text-[#5f6368]">
        * All times are live updates optimized for Bangladesh Standard Time (BST)
      </footer>
    </div>
  );
}
