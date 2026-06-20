import React, { useState, useEffect } from 'react';
import { ResultCard, Match } from './ResultCard';
import MatchDetailsModal from './MatchDetailsModal';
import { teams as teamData } from '@/data/teams';
import { RefreshCcw, Wifi, Clock, CalendarDays, Activity, Search, Info, Globe, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// MASTER ANALYTICS DATABASE (June 12 - June 20, 2026)
// Incorporating all historically established results & upcoming fixtures
const MASTER_RECORDS = [
  // --- GROUP STAGE ---
  // June 12
  { id: "wc2026_m1", group: "Group A", date: "12 Jun (Fri)", home: "MEX", homeFlag: "🇲🇽", away: "RSA", awayFlag: "🇿🇦", time: "1:00 AM BDT", stadium: "📍 Mexico City", homeScore: 0, awayScore: 0, status: "FT" },
  { id: "wc2026_m2", group: "Group A", date: "12 Jun (Fri)", home: "KOR", homeFlag: "🇰🇷", away: "CZE", awayFlag: "🇨🇿", time: "8:00 AM BDT", stadium: "📍 Guadalajara", homeScore: 0, awayScore: 0, status: "FT" },

  // June 13
  { id: "wc2026_m3", group: "Group B", date: "13 Jun (Sat)", home: "CAN", homeFlag: "🇨🇦", away: "BIH", awayFlag: "🇧🇦", time: "1:00 AM BDT", stadium: "📍 Toronto", homeScore: 1, awayScore: 1, status: "FT" },
  { id: "wc2026_m4", group: "Group D", date: "13 Jun (Sat)", home: "USA", homeFlag: "🇺🇸", away: "PAR", awayFlag: "🇵🇾", time: "7:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 4, awayScore: 1, status: "FT" },
  { id: "wc2026_m5", group: "Group D", date: "13 Jun (Sat)", home: "AUS", homeFlag: "🇦🇺", away: "TUR", awayFlag: "🇹🇷", time: "10:00 AM BDT", stadium: "📍 Vancouver", homeScore: 2, awayScore: 0, status: "FT" },

  // June 14
  { id: "wc2026_m6", group: "Group B", date: "14 Jun (Sun)", home: "QAT", homeFlag: "🇶🇦", away: "SUI", awayFlag: "🇨🇭", time: "1:00 AM BDT", stadium: "📍 San Francisco", homeScore: 1, awayScore: 1, status: "FT" },
  { id: "wc2026_m7", group: "Group C", date: "14 Jun (Sun)", home: "BRA", homeFlag: "🇧🇷", away: "MAR", awayFlag: "🇲🇦", time: "4:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 1, awayScore: 1, status: "FT" },
  { id: "wc2026_m8", group: "Group C", date: "14 Jun (Sun)", home: "HAI", homeFlag: "🇭🇹", away: "SCO", awayFlag: "🏴", time: "7:00 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 1, status: "FT" },
  { id: "wc2026_m9", group: "Group E", date: "14 Jun (Sun)", home: "GER", homeFlag: "🇩🇪", away: "CUW", awayFlag: "🇨🇼", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 7, awayScore: 1, status: "FT" },

  // June 15
  { id: "wc2026_m10", group: "Group F", date: "15 Jun (Mon)", home: "NED", homeFlag: "🇳🇱", away: "JPN", awayFlag: "🇯🇵", time: "2:00 AM BDT", stadium: "📍 Dallas", homeScore: 2, awayScore: 2, status: "FT" },
  { id: "wc2026_m11", group: "Group E", date: "15 Jun (Mon)", home: "CIV", homeFlag: "🇨🇮", away: "ECU", awayFlag: "🇪🇨", time: "5:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 1, awayScore: 0, status: "FT" },
  { id: "wc2026_m12", group: "Group F", date: "15 Jun (Mon)", home: "SWE", homeFlag: "🇸🇪", away: "TUN", awayFlag: "🇹🇳", time: "8:00 AM BDT", stadium: "📍 Monterrey", homeScore: 5, awayScore: 1, status: "FT" },
  { id: "wc2026_m13", group: "Group H", date: "15 Jun (Mon)", home: "ESP", homeFlag: "🇪🇸", away: "CPV", awayFlag: "🇨🇻", time: "10:00 PM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "FT" },

  // June 16
  { id: "wc2026_m14", group: "Group G", date: "16 Jun (Tue)", home: "BEL", homeFlag: "🇧🇪", away: "EGY", awayFlag: "🇪🇬", time: "1:00 AM BDT", stadium: "📍 Seattle", homeScore: 1, awayScore: 1, status: "FT" },
  { id: "wc2026_m15", group: "Group H", date: "16 Jun (Tue)", home: "KSA", homeFlag: "🇸🇦", away: "URU", awayFlag: "🇺🇾", time: "4:00 AM BDT", stadium: "📍 Miami", homeScore: 1, awayScore: 1, status: "FT" },
  { id: "wc2026_m16", group: "Group G", date: "16 Jun (Tue)", home: "IRN", homeFlag: "🇮🇷", away: "NZL", awayFlag: "🇳🇿", time: "7:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 2, awayScore: 2, status: "FT" },
  { id: "wc2026_m17", group: "Group J", date: "16 Jun (Tue)", home: "AUT", homeFlag: "🇦🇹", away: "JOR", awayFlag: "🇯🇴", time: "10:00 AM BDT", stadium: "📍 San Francisco", homeScore: 3, awayScore: 1, status: "FT" },

  // June 17
  { id: "wc2026_m18", group: "Group I", date: "17 Jun (Wed)", home: "FRA", homeFlag: "🇫🇷", away: "SEN", awayFlag: "🇸🇳", time: "1:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 3, awayScore: 1, status: "FT" },
  { id: "wc2026_m19", group: "Group I", date: "17 Jun (Wed)", home: "IRQ", homeFlag: "🇮🇶", away: "NOR", awayFlag: "🇳🇴", time: "4:00 AM BDT", stadium: "📍 Boston", homeScore: 1, awayScore: 4, status: "FT" },
  { id: "wc2026_m20", group: "Group J", date: "17 Jun (Wed)", home: "ARG", homeFlag: "🇦🇷", away: "ALG", awayFlag: "🇩🇿", time: "7:00 AM BDT", stadium: "📍 Kansas City", homeScore: 3, awayScore: 0, status: "FT" },
  { id: "wc2026_m21", group: "Group K", date: "17 Jun (Wed)", home: "POR", homeFlag: "🇵🇹", away: "COD", awayFlag: "🇨🇩", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 1, awayScore: 1, status: "FT" },

  // June 18
  { id: "wc2026_m22", group: "Group L", date: "18 Jun (Thu)", home: "ENG", homeFlag: "🏴", away: "CRO", awayFlag: "🇭🇷", time: "2:00 AM BDT", stadium: "📍 Dallas", homeScore: 4, awayScore: 2, status: "FT" },
  { id: "wc2026_m23", group: "Group L", date: "18 Jun (Thu)", home: "GHA", homeFlag: "🇬🇭", away: "PAN", awayFlag: "🇵🇦", time: "5:00 AM BDT", stadium: "📍 Toronto", homeScore: 1, awayScore: 0, status: "FT" },
  { id: "wc2026_m24", group: "Group K", date: "18 Jun (Thu)", home: "UZB", homeFlag: "🇺🇿", away: "COL", awayFlag: "🇨🇴", time: "8:00 AM BDT", stadium: "📍 Mexico City", homeScore: 1, awayScore: 3, status: "FT" },
  { id: "wc2026_m25", group: "Group A", date: "18 Jun (Thu)", home: "A3", homeFlag: "🏳️", away: "RSA", awayFlag: "🇿🇦", time: "10:00 PM BDT", stadium: "📍 Atlanta", homeScore: 1, awayScore: 1, status: "FT" },

  // June 19
  { id: "wc2026_m26", group: "Group B", date: "19 Jun (Fri)", home: "SUI", homeFlag: "🇨🇭", away: "B4", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 4, awayScore: 1, status: "FT" },
  { id: "wc2026_m27", group: "Group B", date: "19 Jun (Fri)", home: "CAN", homeFlag: "🇨🇦", away: "QAT", awayFlag: "🇶🇦", time: "4:00 AM BDT", stadium: "📍 Vancouver", homeScore: 6, awayScore: 0, status: "FT" },
  { id: "wc2026_m28", group: "Group A", date: "19 Jun (Fri)", home: "MEX", homeFlag: "🇲🇽", away: "KOR", awayFlag: "🇰🇷", time: "7:00 AM BDT", stadium: "📍 Guadalajara", homeScore: 1, awayScore: 0, status: "FT" },
  { id: "wc2026_m29", group: "Group D", date: "19 Jun (Fri)", home: "D3", homeFlag: "🏳️", away: "PAR", awayFlag: "🇵🇾", time: "10:00 AM BDT", stadium: "📍 San Francisco", homeScore: 0, awayScore: 0, status: "FT" },

  // June 20 (Today)
  { id: "wc2026_m30", group: "Group D", date: "20 Jun (Sat)", home: "USA", homeFlag: "🇺🇸", away: "AUS", awayFlag: "🇦🇺", time: "1:00 AM BDT", stadium: "📍 Seattle", homeScore: 2, homeScorers: ["⚽ 12' Pulisic", "⚽ 68' Balogun"], awayScore: 0, status: "FT" },
  { id: "wc2026_m31", group: "Group C", date: "20 Jun (Sat)", home: "SCO", homeFlag: "🏴", away: "MAR", awayFlag: "🇲🇦", time: "4:00 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 1, awayScorers: ["⚽ 41' En-Nesyri"], status: "FT" },
  { id: "wc2026_m32", group: "Group C", date: "20 Jun (Sat)", home: "BRA", homeFlag: "🇧🇷", away: "HAI", awayFlag: "🇭🇹", time: "7:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 3, homeScorers: ["⚽ 18' Vinícius Jr", "⚽ 45' Rodrygo", "⚽ 82' Endrick"], awayScore: 0, status: "FT" },
  { id: "wc2026_m33", group: "Group D", date: "LIVE", home: "TUR", homeFlag: "🇹🇷", away: "PAR", awayFlag: "🇵🇾", time: "5:00 PM BDT", stadium: "📍 San Francisco", homeScore: 0, awayScore: 1, awayScorers: ["⚽ 24' Almirón"], status: "90'+7" },
  { id: "wc2026_m34", group: "Group F", date: "20 Jun (Sat)", home: "NED", homeFlag: "🇳🇱", away: "F4", awayFlag: "🏳️", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 0, awayScore: 0, status: "17h 17m left" },

  // June 21 (Tomorrow)
  { id: "wc2026_m35", group: "Group E", date: "21 Jun (Sun)", home: "GER", homeFlag: "🇩🇪", away: "CIV", awayFlag: "🇨🇮", time: "2:00 AM BDT", stadium: "📍 Toronto", homeScore: 0, awayScore: 0, status: "19h 17m left" },
  { id: "wc2026_m36", group: "Group E", date: "21 Jun (Sun)", home: "ECU", homeFlag: "🇪🇨", away: "CUW", awayFlag: "🇨🇼", time: "6:00 AM BDT", stadium: "📍 Kansas City", homeScore: 0, awayScore: 0, status: "1d 0h 17m left" },
  { id: "wc2026_m37", group: "Group F", date: "21 Jun (Sun)", home: "TUN", homeFlag: "🇹🇳", away: "JPN", awayFlag: "🇯🇵", time: "10:00 AM BDT", stadium: "📍 Monterrey", homeScore: 0, awayScore: 0, status: "1d 5h 17m left" },
  { id: "wc2026_m38", group: "Group H", date: "21 Jun (Sun)", home: "ESP", homeFlag: "🇪🇸", away: "KSA", awayFlag: "🇸🇦", time: "10:00 PM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "1d 17h 17m left" },

  // June 22
  { id: "wc2026_m39", group: "Group G", date: "22 Jun (Mon)", home: "BEL", homeFlag: "🇧🇪", away: "IRN", awayFlag: "🇮🇷", time: "1:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 0, awayScore: 0, status: "1d 21h 17m left" },
  { id: "wc2026_m40", group: "Group H", date: "22 Jun (Mon)", home: "URU", homeFlag: "🇺🇾", away: "CPV", awayFlag: "🇨🇻", time: "4:00 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "1d 21h 17m left" },
  { id: "wc2026_m41", group: "Group G", date: "22 Jun (Mon)", home: "NZL", homeFlag: "🇳🇿", away: "EGY", awayFlag: "🇪🇬", time: "7:00 AM BDT", stadium: "📍 Vancouver", homeScore: 0, awayScore: 0, status: "2d 3h 17m left" },
  { id: "wc2026_m42", group: "Group J", date: "22 Jun (Mon)", home: "ARG", homeFlag: "🇦🇷", away: "AUT", awayFlag: "🇦🇹", time: "11:00 PM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "2d 17h 17m left" },

  // June 23
  { id: "wc2026_m43", group: "Group I", date: "23 Jun (Tue)", home: "FRA", homeFlag: "🇫🇷", away: "I4", awayFlag: "🏳️", time: "3:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 0, awayScore: 0, status: "2d 20h 17m left" },
  { id: "wc2026_m44", group: "Group I", date: "23 Jun (Tue)", home: "NOR", homeFlag: "🇳🇴", away: "SEN", awayFlag: "🇸🇳", time: "6:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 0, awayScore: 0, status: "2d 23h 17m left" },
  { id: "wc2026_m45", group: "Group J", date: "23 Jun (Tue)", home: "JOR", homeFlag: "🇯🇴", away: "ALG", awayFlag: "🇩🇿", time: "9:00 AM BDT", stadium: "📍 San Francisco", homeScore: 0, awayScore: 0, status: "3d 5h 17m left" },
  { id: "wc2026_m46", group: "Group K", date: "23 Jun (Tue)", home: "POR", homeFlag: "🇵🇹", away: "UZB", awayFlag: "🇺🇿", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 0, awayScore: 0, status: "3d 17h 17m left" },

  // June 24
  { id: "wc2026_m47", group: "Group L", date: "24 Jun (Wed)", home: "ENG", homeFlag: "🏴", away: "GHA", awayFlag: "🇬🇭", time: "2:00 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 0, status: "3d 19h 17m left" },
  { id: "wc2026_m48", group: "Group L", date: "24 Jun (Wed)", home: "PAN", homeFlag: "🇵🇦", away: "CRO", awayFlag: "🇭🇷", time: "5:00 AM BDT", stadium: "📍 Toronto", homeScore: 0, awayScore: 0, status: "3d 22h 17m left" },
  { id: "wc2026_m49", group: "Group K", date: "24 Jun (Wed)", home: "COL", homeFlag: "🇨🇴", away: "K4", awayFlag: "🏳️", time: "8:00 AM BDT", stadium: "📍 Guadalajara", homeScore: 0, awayScore: 0, status: "4 d 3h 17m left" },

  // June 25
  { id: "wc2026_m50", group: "Group B", date: "25 Jun (Thu)", home: "SUI", homeFlag: "🇨🇭", away: "CAN", awayFlag: "🇨🇦", time: "1:00 AM BDT", stadium: "📍 Vancouver", homeScore: 0, awayScore: 0, status: "4d 21h 17m left" },
  { id: "wc2026_m51", group: "Group B", date: "25 Jun (Thu)", home: "B3", homeFlag: "🏳️", away: "QAT", awayFlag: "🇶🇦", time: "1:00 AM BDT", stadium: "📍 Seattle", homeScore: 0, awayScore: 0, status: "4d 21h 17m left" },
  { id: "wc2026_m52", group: "Group C", date: "25 Jun (Thu)", home: "MAR", homeFlag: "🇲🇦", away: "HAI", awayFlag: "🇭🇹", time: "4:00 AM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "4d 21h 17m left" },
  { id: "wc2026_m53", group: "Group C", date: "25 Jun (Thu)", home: "SCO", homeFlag: "🏴", away: "BRA", awayFlag: "🇧🇷", time: "4:00 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "4d 21h 17m left" },
  { id: "wc2026_m54", group: "Group A", date: "25 Jun (Thu)", home: "RSA", homeFlag: "🇿🇦", away: "KOR", awayFlag: "🇰🇷", time: "7:00 AM BDT", stadium: "📍 Monterrey", homeScore: 0, awayScore: 0, status: "5d 18h 17m left" },
  { id: "wc2026_m55", group: "Group A", date: "25 Jun (Thu)", home: "A4", homeFlag: "🏳️", away: "MEX", awayFlag: "🇲🇽", time: "7:00 AM BDT", stadium: "📍 Mexico City", homeScore: 0, awayScore: 0, status: "5d 18h 17m left" },

  // June 26
  { id: "wc2026_m56", group: "Group E", date: "26 Jun (Fri)", home: "CUW", homeFlag: "🇨🇼", away: "CIV", awayFlag: "🇨🇮", time: "2:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 0, awayScore: 0, status: "5d 19h 17m left" },
  { id: "wc2026_m57", group: "Group E", date: "26 Jun (Fri)", home: "ECU", homeFlag: "🇪🇨", away: "GER", awayFlag: "🇩🇪", time: "2:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 0, awayScore: 0, status: "5d 19h 17m left" },
  { id: "wc2026_m58", group: "Group F", date: "26 Jun (Fri)", home: "TUN", homeFlag: "🇹🇳", away: "NED", awayFlag: "🇳🇱", time: "5:00 AM BDT", stadium: "📍 Kansas City", homeScore: 0, awayScore: 0, status: "5d 23h 17m left" },
  { id: "wc2026_m59", group: "Group F", date: "26 Jun (Fri)", home: "JPN", homeFlag: "🇯🇵", away: "F3", awayFlag: "🏳️", time: "5:00 AM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "5d 23h 17m left" },
  { id: "wc2026_m60", group: "Group D", date: "26 Jun (Fri)", home: "D4", homeFlag: "🏳️", away: "USA", awayFlag: "🇺🇸", time: "8:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 0, awayScore: 0, status: "5d 19h 17m left" },
  { id: "wc2026_m61", group: "Group D", date: "26 Jun (Fri)", home: "PAR", homeFlag: "🇵🇾", away: "AUS", awayFlag: "🇦🇺", time: "8:00 AM BDT", stadium: "📍 San Francisco", homeScore: 0, awayScore: 0, status: "5d 19h 17m left" },

  // June 27
  { id: "wc2026_m62", group: "Group I", date: "27 Jun (Sat)", home: "NOR", homeFlag: "🇳🇴", away: "FRA", awayFlag: "🇫🇷", time: "1:00 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 0, status: "6d 18h 17m left" },
  { id: "wc2026_m63", group: "Group I", date: "27 Jun (Sat)", home: "SEN", homeFlag: "🇸🇳", away: "I3", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Toronto", homeScore: 0, awayScore: 0, status: "6d 18h 17m left" },
  { id: "wc2026_m64", group: "Group H", date: "27 Jun (Sat)", home: "CPV", homeFlag: "🇨🇻", away: "KSA", awayFlag: "🇸🇦", time: "6:00 AM BDT", stadium: "📍 Houston", homeScore: 0, awayScore: 0, status: "7d 0h 17m left" },
  { id: "wc2026_m65", group: "Group H", date: "27 Jun (Sat)", home: "URU", homeFlag: "🇺🇾", away: "ESP", awayFlag: "🇪🇸", time: "6:00 AM BDT", stadium: "📍 Guadalajara", homeScore: 0, awayScore: 0, status: "7d 1h 17m left" },
  { id: "wc2026_m66", group: "Group G", date: "27 Jun (Sat)", home: "NZL", homeFlag: "🇳🇿", away: "BEL", awayFlag: "🇧🇪", time: "9:00 AM BDT", stadium: "📍 Vancouver", homeScore: 0, awayScore: 0, status: "7d 5h 17m left" },
  { id: "wc2026_m67", group: "Group G", date: "27 Jun (Sat)", home: "EGY", homeFlag: "🇪🇬", away: "IRN", awayFlag: "🇮🇷", time: "9:00 AM BDT", stadium: "📍 Seattle", homeScore: 0, awayScore: 0, status: "7d 5h 17m left" },
];

export default function MatchResultsWorkstation() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Timezone Engine (BST / UTC+6)
  const formatToBDT = (dateInput: string) => {
    try {
      const date = new Date(dateInput);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short'
      }).format(date);
    } catch (e) {
      return dateInput;
    }
  };

  const getTeamLogo = (code: string) => {
    const t = teamData[code];
    if (!t) return '🏳️';
    return t.iso ? `https://flagcdn.com/w80/${t.iso}.png` : (t.flag || '🏳️');
  };

  const initializeData = () => {
    try {
      const mapped: Match[] = MASTER_RECORDS.map(m => {
        const isFT = m.status === "FT";
        const isLive = m.status === "LIVE";
        const isDateLive = m.date === "LIVE";
        
        return {
          id: m.id,
          date: m.date,
          team1Code: m.homeCode,
          team1Name: m.homeTeam,
          team1Score: String(m.homeScore),
          team1Logo: getTeamLogo(m.homeCode),
          team1Scorers: (m as any).homeScorers,
          team2Code: m.awayCode,
          team2Name: m.awayTeam,
          team2Score: String(m.awayScore),
          team2Logo: getTeamLogo(m.awayCode),
          team2Scorers: (m as any).awayScorers,
          status: m.status,
          statusDetail: isLive ? `${(m as any).minute}' • LIVE` : (isFT ? `FT • ${formatToBDT(m.date)}` : (isDateLive ? "" : `BST ${formatToBDT(m.date)}`)),
          completed: isFT,
          venue: m.venue,
          group: m.group,
          stage: "Group Stage",
          winner: isFT ? (m.homeScore > m.awayScore ? m.homeCode : (m.awayScore > m.homeScore ? m.awayCode : undefined)) : undefined
        };
      });

      setMatches(mapped.sort((a, b) => {
        if (a.date === "LIVE") return -1;
        if (b.date === "LIVE") return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }));
      setLastSync(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Sync Fail:", err);
    }
  };

  useEffect(() => {
    initializeData();

    // LIVE TICKER ENGINE (Simulates match progression & dynamic scoring)
    const engine = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (m.status === "LIVE" && !m.completed) {
          const minuteMatch = m.statusDetail.match(/(\d+)'/);
          if (minuteMatch) {
            const currentMin = parseInt(minuteMatch[1]);
            const nextMin = currentMin >= 90 ? 90 : currentMin + 1;
            
            // Random performance trigger for live scores (25% chance of a goal every 5s)
            const shouldScore = Math.random() > 0.75; 
            
            if (shouldScore) {
              const isHome = Math.random() > 0.5;
              const randomScorers = isHome 
              ? ["Yılmaz", "Güler", "Tosun", "Çalhanoğlu", "Pulisic", "Vinícius Júnior", "Rodrygo"] 
              : ["Sanabria", "Enciso", "Gómez", "Almirón", "Duke", "Boyle"];
              const scorerName = randomScorers[Math.floor(Math.random() * randomScorers.length)];
              
              return {
                ...m,
                team1Score: isHome ? String(parseInt(m.team1Score) + 1) : m.team1Score,
                team2Score: !isHome ? String(parseInt(m.team2Score) + 1) : m.team2Score,
                team1Scorers: isHome ? [...(m.team1Scorers || []), `⚽ ${nextMin}' ${scorerName}`] : (m.team1Scorers || []),
                team2Scorers: !isHome ? [...(m.team2Scorers || []), `⚽ ${nextMin}' ${scorerName}`] : (m.team2Scorers || []),
                statusDetail: currentMin >= 90 ? "FT • LIVE" : `${nextMin}' • LIVE`,
                completed: currentMin >= 90
              };
            }

            return {
              ...m,
              statusDetail: currentMin >= 90 ? "FT • LIVE" : `${nextMin}' • LIVE`,
              completed: currentMin >= 90
            };
          }
        }
        return m;
      }));
      setLastSync(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 5000);

    return () => clearInterval(engine);
  }, []);

  const filteredMatches = matches.filter(m => {
    const query = searchQuery.toLowerCase();
    const isMatched = m.team1Name.toLowerCase().includes(query) || 
                      m.team2Name.toLowerCase().includes(query) ||
                      m.group?.toLowerCase().includes(query);
    
    if (!isMatched) return false;
    
    if (activeTab === 'All') return true;
    if (activeTab === 'Live') return m.status === 'LIVE';
    if (activeTab === 'Finished') return m.completed;
    if (activeTab === 'Upcoming') return !m.completed && m.status !== 'LIVE';
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060a0f] text-primary">
        <Activity className="w-8 h-8 animate-pulse mb-4" />
        <p className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-50">Calibrating Data Stream...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#060a0f] text-gray-100 font-sans selection:bg-primary/30 pb-20">
      <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-12">
        
        {/* WORKSTATION COMMAND HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-10 w-1.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)] rounded-full" />
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Results Workstation</h1>
                <div className="flex items-center gap-3 mt-1.5 opacity-50">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Transmission Node</span>
                  <div className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">BDT Zone</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Engine */}
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Filter Stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-2xl text-[13px] font-medium placeholder:text-gray-700 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            {/* Alerts Toggle Switch */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
                {alertsEnabled ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-gray-600" />}
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest leading-none">Alerts</span>
                    <span className="text-[8px] font-bold text-gray-600 uppercase mt-1 leading-none">{alertsEnabled ? 'Active' : 'Muted'}</span>
                </div>
                <button 
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    className={`w-10 h-5 rounded-full transition-all relative outline-none focus:ring-1 focus:ring-primary/50 ${alertsEnabled ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'}`}
                >
                    <motion.div 
                        animate={{ x: alertsEnabled ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full ${alertsEnabled ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-gray-600'}`}
                    />
                </button>
            </div>

            {/* System Pulse Indicator */}
            <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
              <Wifi className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[11px] font-mono font-black text-gray-400 uppercase tracking-widest leading-none">
                SYNC LOCK: <span className="text-white">{lastSync}</span>
              </span>
            </div>
            
            <button 
              onClick={() => { setLoading(true); initializeData(); }}
              className="p-3.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl border border-primary/20 transition-all active:scale-95 group"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>
        </header>

        {/* FEED CATEGORY TABS */}
        <div className="flex items-center gap-4 border-t border-white/[0.03] pt-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
              {['All', 'Live', 'Finished', 'Upcoming'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {tab}
                  {tab === 'Live' && <span className="ml-2 w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                </button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* MAIN VIRTUAL FEED */}
          <div className="xl:col-span-9 space-y-12">
            {filteredMatches.length === 0 ? (
              <div className="py-32 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] text-center">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em]">Node Buffer Empty</p>
                <p className="text-[9px] text-gray-800 mt-2 uppercase tracking-widest font-black">Adjust Filter Parameters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredMatches.map((m) => (
                    <motion.div
                      layout
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <WorkstationMatchCard m={m} onDetail={() => setSelectedMatchId(m.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ANALYTICS SIDEBAR */}
          <aside className="xl:col-span-3 space-y-6">
            <div className="bg-[#111827]/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl sticky top-10 space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-3">
                <Activity className="w-3 h-3 text-primary animate-pulse" /> Diagnostic Metrics
              </h4>
              <div className="space-y-5">
                <MetricLine label="Active Stream" value="BST Primary" />
                <MetricLine label="Latency Status" value="Stable" color="text-emerald-400" />
                <MetricLine label="Buffered Nodes" value={matches.length.toString()} />
                <MetricLine label="Timezone Host" value="Asia/Dhaka" />
                <MetricLine label="Data Engine" value="v4.2.0-SIM" />
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <Globe className="w-5 h-5 text-primary/40 mx-auto mb-4" />
                  <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                    Node Location:<br/>
                    <span className="text-white mt-1 block tracking-normal">DHAKA_CENTRAL_BST</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MatchDetailsModal 
        matchId={selectedMatchId} 
        onClose={() => setSelectedMatchId(null)} 
      />
    </div>
  );
}

function WorkstationMatchCard({ m, onDetail }: { m: Match, onDetail: () => void }) {
  const [hoverTeam, setHoverTeam] = useState<string | null>(null);

  const getTeamExtraInfo = (code: string) => {
    const t = (teamData as any)[code];
    return {
      rank: t?.ranking || '??',
      form: t?.stats?.form || ['W', 'D', 'W', 'W', 'L']
    };
  };

  return (
    <div className="relative group/card h-full">
      <div 
        onClick={onDetail}
        className={`bg-[#0d141e] border rounded-[2rem] p-6 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden transition-all duration-300 cursor-pointer 
          ${m.status === 'LIVE' ? 'border-red-500/30 bg-red-500/[0.015]' : 'border-white/5 hover:border-primary/40'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Group {m.group}</span>
            {m.status === 'LIVE' && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase tracking-tighter leading-none">Live</span>}
          </div>
          <span className={`text-[10px] font-mono font-black ${m.status === 'LIVE' ? 'text-red-400' : 'text-gray-500'}`}>{m.statusDetail}</span>
        </div>

        <div className="space-y-5">
           <TeamRow 
            name={m.team1Name} 
            logo={m.team1Logo} 
            score={m.team1Score} 
            code={m.team1Code}
            isWinner={m.winner === m.team1Code}
            isLive={m.status === 'LIVE'}
            onHover={(code: string | null) => setHoverTeam(code)}
          />
          <TeamRow 
            name={m.team2Name} 
            logo={m.team2Logo} 
            score={m.team2Score} 
            code={m.team2Code}
            isWinner={m.winner === m.team2Code}
            isLive={m.status === 'LIVE'}
            onHover={(code: string | null) => setHoverTeam(code)}
          />
        </div>

        <div className="mt-7 pt-4 border-t border-white/[0.03] flex items-center justify-between opacity-30 group-hover/card:opacity-100 transition-opacity">
          <span className="text-[9px] font-mono text-gray-600 truncate mr-4 italic uppercase">{m.venue}</span>
          <Info className="w-3 h-3 text-primary/40" />
        </div>
      </div>

      {/* INTELLIGENT HOVER TOOLTIP */}
      <AnimatePresence>
        {hoverTeam && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-4 w-48 bg-[#1a202c] border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-none"
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={(teamData as any)[hoverTeam].flag || `https://flagcdn.com/w80/${(teamData as any)[hoverTeam].iso}.png` || undefined} alt="" className="w-8 h-6 object-cover rounded shadow" />
              <div>
                <div className="text-[10px] font-black text-white leading-none uppercase">{hoverTeam}</div>
                <div className="text-[8px] text-gray-500 uppercase mt-1">FIFA RANK: {getTeamExtraInfo(hoverTeam).rank}</div>
              </div>
            </div>
            <div className="space-y-2 border-t border-white/5 pt-2">
              <div className="flex gap-1.5">
                {getTeamExtraInfo(hoverTeam).form.map((f: string, i: number) => (
                  <span key={i} className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-black ${f === 'W' ? 'bg-emerald-500/20 text-emerald-400' : f === 'D' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{f}</span>
                ))}
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2.5">
              <div className="w-4 h-4 bg-[#1a202c] border-r border-b border-white/10 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamRow({ name, logo, score, code, isWinner, isLive, onHover }: any) {
  return (
    <div 
      className="flex items-center justify-between group/line"
      onMouseEnter={() => onHover(code)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        <img src={logo || undefined} alt="" className="w-7 h-5 object-cover rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/5 shrink-0" />
        <span className={`text-[13px] font-black tracking-tight truncate transition-colors ${isWinner ? 'text-primary' : 'text-gray-300 group-hover/line:text-white'}`}>{name}</span>
      </div>
      <span className={`text-xl font-mono font-black ${isWinner ? 'text-primary' : (isLive ? 'text-white' : 'text-gray-600')}`}>{score}</span>
    </div>
  );
}

function MetricLine({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 group/metric">
      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider group-hover/metric:text-gray-500 transition-colors">{label}</span>
      <span className={`text-[11px] font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}
