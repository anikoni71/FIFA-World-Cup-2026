import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Clock, MapPin, Trophy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MatchData {
  id: string;
  group: string;
  date: string;
  home: string;
  homeFlag: string;
  homeScore: number | string;
  homeScorers?: string[];
  away: string;
  awayFlag: string;
  awayScore: number | string;
  awayScorers?: string[];
  time: string;
  stadium: string;
  status: string;
}

// Master Data Set
const ALL_MATCHES: MatchData[] = [
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

  // June 28
  { id: "wc2026_m68", group: "Group L", date: "28 Jun (Sun)", home: "PAN", homeFlag: "🇵🇦", away: "ENG", awayFlag: "🏴", time: "3:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 0, awayScore: 0, status: "7d 1h 17m left" },
  { id: "wc2026_m69", group: "Group L", date: "28 Jun (Sun)", home: "CRO", homeFlag: "🇭🇷", away: "GHA", awayFlag: "🇬🇭", time: "3:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 0, awayScore: 0, status: "7d 1h 17m left" },
  { id: "wc2026_m70", group: "Group K", date: "28 Jun (Sun)", home: "COL", homeFlag: "🇨🇴", away: "POR", awayFlag: "🇵🇹", time: "5:30 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "7d 22h 47m left" },
  { id: "wc2026_m71", group: "Group K", date: "28 Jun (Sun)", home: "K3", homeFlag: "🏳️", away: "UZB", awayFlag: "🇺🇿", time: "5:30 AM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "7d 22h 47m left" },
  { id: "wc2026_m72", group: "Group J", date: "28 Jun (Sun)", home: "ALG", homeFlag: "🇩🇿", away: "AUT", awayFlag: "🇦🇹", time: "8:00 AM BDT", stadium: "📍 Kansas City", homeScore: 0, awayScore: 0, status: "8d 2h 17m left" },
  { id: "wc2026_m73", group: "Group J", date: "28 Jun (Sun)", home: "JOR", homeFlag: "🇯🇴", away: "ARG", awayFlag: "🇦🇷", time: "8:00 AM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "8d 2h 17m left" },

  // --- KNOCKOUT STAGES ---
  // Round of 32
  { id: "wc2026_r32_1", group: "Round of 32", date: "29 Jun (Mon)", home: "1F", homeFlag: "🏳️", away: "2C", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 0, awayScore: 0, status: "LIVE / FT" },
  { id: "wc2026_r32_2", group: "Round of 32", date: "29 Jun (Mon)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 0, awayScore: 0, status: "15d 22h 17m left" },
  { id: "wc2026_r32_3", group: "Round of 32", date: "30 Jun (Tue)", home: "2E", homeFlag: "🏳️", away: "2I", awayFlag: "🏳️", time: "2:30 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 0, status: "LIVE / FT" },
  { id: "wc2026_r32_4", group: "Round of 32", date: "30 Jun (Tue)", home: "1E", homeFlag: "🏳️", away: "3A/B/C/D/F", awayFlag: "🏳️", time: "7:00 AM BDT", stadium: "📍 Monterrey", homeScore: 0, awayScore: 0, status: "16d 1h 47m left" },
  { id: "wc2026_r32_5", group: "Round of 32", date: "30 Jun (Tue)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "11:00 PM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "16d 2h 17m left" },
  { id: "wc2026_r32_6", group: "Round of 32", date: "01 Jul (Wed)", home: "1I", homeFlag: "🏳️", away: "3C/D/F/G/H", awayFlag: "🏳️", time: "3:00 AM BDT", stadium: "📍 NY-NJ", homeScore: 0, awayScore: 0, status: "16d 15h 17m left" },
  { id: "wc2026_r32_7", group: "Round of 32", date: "01 Jul (Wed)", home: "MEX", homeFlag: "🇲🇽", away: "TBD", awayFlag: "🏳️", time: "7:00 AM BDT", stadium: "📍 Mexico City", homeScore: 0, awayScore: 0, status: "16d 17h 17m left" },
  { id: "wc2026_r32_8", group: "Round of 32", date: "01 Jul (Wed)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "10:00 PM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "16d 18h 17m left" },
  { id: "wc2026_r32_9", group: "Round of 32", date: "02 Jul (Thu)", home: "2D", homeFlag: "🏳️", away: "2G", awayFlag: "🏳️", time: "2:00 AM BDT", stadium: "📍 Seattle", homeScore: 0, awayScore: 0, status: "16d 21h 17m left" },
  { id: "wc2026_r32_10", group: "Round of 32", date: "02 Jul (Thu)", home: "1H", homeFlag: "🏳️", away: "2J", awayFlag: "🏳️", time: "6:00 AM BDT", stadium: "📍 San Francisco", homeScore: 0, awayScore: 0, status: "16d 21h 17m left" },
  { id: "wc2026_r32_11", group: "Round of 32", date: "03 Jul (Fri)", home: "2L", homeFlag: "🏳️", away: "2K", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },
  { id: "wc2026_r32_12", group: "Round of 32", date: "03 Jul (Fri)", home: "1K", homeFlag: "🏳️", away: "3D/E/I/J/L", awayFlag: "🏳️", time: "5:00 AM BDT", stadium: "📍 Toronto", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },
  { id: "wc2026_r32_13", group: "Round of 32", date: "03 Jul (Fri)", home: "1A", homeFlag: "🏳️", away: "3C/E/F/H/I", awayFlag: "🏳️", time: "9:00 AM BDT", stadium: "📍 Vancouver", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },
  { id: "wc2026_r32_14", group: "Round of 32", date: "04 Jul (Sat)", home: "1D", homeFlag: "🏳️", away: "3B/E/F/I/J", awayFlag: "🏳️", time: "12:00 AM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },
  { id: "wc2026_r32_15", group: "Round of 32", date: "04 Jul (Sat)", home: "1J", homeFlag: "🏳️", away: "2H", awayFlag: "🏳️", time: "4:00 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },
  { id: "wc2026_r32_16", group: "Round of 32", date: "04 Jul (Sat)", home: "1G", homeFlag: "🏳️", away: "3A/E/H/I/J", awayFlag: "🏳️", time: "7:30 AM BDT", stadium: "📍 Kansas City", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },

  // Round of 16
  { id: "wc2026_r16_1", group: "Round of 16", date: "04 Jul (Sat)", home: "W(R32-7)", homeFlag: "🏳️", away: "W(R32-8)", awayFlag: "🏳️", time: "11:00 PM BDT", stadium: "📍 Houston", homeScore: 0, awayScore: 0, status: "16d 1h 17m left" },
  { id: "wc2026_r16_2", group: "Round of 16", date: "05 Jul (Sun)", home: "W(R32-11)", homeFlag: "🏳️", away: "W(R32-12)", awayFlag: "🏳️", time: "3:00 AM BDT", stadium: "📍 Philadelphia", homeScore: 0, awayScore: 0, status: "16d 2h 17m left" },
  { id: "wc2026_r16_3", group: "Round of 16", date: "06 Jul (Mon)", home: "W(R32-13)", homeFlag: "🏳️", away: "W(R32-14)", awayFlag: "🏳️", time: "2:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 0, awayScore: 0, status: "16d 15h 17m left" },
  { id: "wc2026_r16_4", group: "Round of 16", date: "06 Jul (Mon)", home: "W(R32-3)", homeFlag: "🏳️", away: "W(R32-4)", awayFlag: "🏳️", time: "6:00 AM BDT", stadium: "📍 Mexico City", homeScore: 0, awayScore: 0, status: "16d 17h 17m left" },
  { id: "wc2026_r16_5", group: "Round of 16", date: "07 Jul (Tue)", home: "W(R32-9)", homeFlag: "🏳️", away: "W(R32-10)", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "16d 19h 17m left" },
  { id: "wc2026_r16_6", group: "Round of 16", date: "07 Jul (Tue)", home: "W(R32-1)", homeFlag: "🏳️", away: "W(R32-2)", awayFlag: "🏳️", time: "6:00 AM BDT", stadium: "📍 Seattle", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_r16_7", group: "Round of 16", date: "07 Jul (Tue)", home: "W(R32-5)", homeFlag: "🏳️", away: "W(R32-6)", awayFlag: "🏳️", time: "10:00 PM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_r16_8", group: "Round of 16", date: "08 Jul (Wed)", home: "W(R32-15)", homeFlag: "🏳️", away: "W(R32-16)", awayFlag: "🏳️", time: "2:00 AM BDT", stadium: "📍 Vancouver", homeScore: 0, awayScore: 0, status: "16d 22h 17m left" },

  // Quarterfinals
  { id: "wc2026_qf1", group: "Quarter-finals", date: "10 Jul (Fri)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "2:00 AM BDT", stadium: "📍 Boston", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_qf2", group: "Quarter-finals", date: "11 Jul (Sat)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Los Angeles", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_qf3", group: "Quarter-finals", date: "12 Jul (Sun)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "3:00 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_qf4", group: "Quarter-finals", date: "12 Jul (Sun)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "7:00 AM BDT", stadium: "📍 Kansas City", homeScore: 0, awayScore: 0, status: "16d 18h 17m left" },

  // Semifinals
  { id: "wc2026_sf1", group: "Semi-finals", date: "15 Jul (Wed)", home: "L(SF-1)", homeFlag: "🏳️", away: "L(SF-2)", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Dallas", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_sf2", group: "Semi-finals", date: "16 Jul (Thu)", home: "W(SF-1)", homeFlag: "🏳️", away: "W(SF-2)", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 Atlanta", homeScore: 0, awayScore: 0, status: "16d 18h 17m left" },

  // Playoff & Final
  { id: "wc2026_3rd", group: "Third place play-off", date: "19 Jul (Sun)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "3:00 AM BDT", stadium: "📍 Miami", homeScore: 0, awayScore: 0, status: "16d 20h 17m left" },
  { id: "wc2026_final", group: "Final", date: "20 Jul (Mon)", home: "TBD", homeFlag: "🏳️", away: "TBD", awayFlag: "🏳️", time: "1:00 AM BDT", stadium: "📍 New York-NJ", homeScore: 0, awayScore: 0, status: "16d 18h 17m left" }
];

export default function ScheduleWorkstation() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [filter, setFilter] = useState<'all' | 'played' | 'upcoming'>('all');
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated live engine block
  useEffect(() => {
    let mounted = true;
    let localSimulatedMatches = [...ALL_MATCHES];

    async function fetchLiveMatches() {
      try {
        setNow(new Date());
        // 2. Fetch live data from your API/Backend
        // Replace this URL with the actual API endpoint Zite/ESPN uses
        const response = await fetch('https://api.yoursportsdata.com/v1/worldcup2026/matches');
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        // Parse the new live data
        const liveData = await response.json(); 
        
        // Update the array and re-render the screen
        if (mounted) {
          setMatches(liveData);
          setIsLoading(false);
        }
      } catch (error) {
        // Fallback to our simulated logic if the mock API endpoint fails to keep the UI running
        localSimulatedMatches = localSimulatedMatches.map((match) => {
          if (match.date === "LIVE" && match.status !== "FT") {
            const shouldScore = Math.random() > 0.8; 
            
            if (shouldScore) {
              const isHome = Math.random() > 0.5;
              const currentMin = parseInt(match.status) || 45;
              const nextMin = Math.min(90, currentMin + 1);
              
              const randomScorers = isHome 
                ? ["Yılmaz", "Güler", "Tosun"] 
                : ["Sanabria", "Enciso", "Gómez"];
              const scorerName = randomScorers[Math.floor(Math.random() * randomScorers.length)];

              return {
                ...match,
                homeScore: isHome ? (parseInt(match.homeScore as string) || 0) + 1 : match.homeScore,
                awayScore: !isHome ? (parseInt(match.awayScore as string) || 0) + 1 : match.awayScore,
                homeScorers: isHome ? [...(match.homeScorers || []), `⚽ ${nextMin}' ${scorerName}`] : (match.homeScorers || []),
                awayScorers: !isHome ? [...(match.awayScorers || []), `⚽ ${nextMin}' ${scorerName}`] : (match.awayScorers || []),
                status: `${nextMin}'`
              };
            }
            
            const currentMin = parseInt(match.status) || 45;
            return { ...match, status: currentMin < 90 ? `${currentMin + 1}'` : "FT" };
          }
          return match; 
        });
        
        if (mounted) {
          setMatches(localSimulatedMatches);
          setIsLoading(false);
        }
      }
    }

    // 4. Call it once immediately when the page loads
    fetchLiveMatches();

    // 3. Update your interval to fetch new data every 5 seconds
    const interval = setInterval(fetchLiveMatches, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setNow(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredMatches = matches.filter(match => {
    const searchMatch = match.home.toLowerCase().includes(search.toLowerCase()) || match.away.toLowerCase().includes(search.toLowerCase());
    if (!searchMatch) return false;

    const isPlayed = match.status === 'FT' || match.date === 'LIVE';
    if (filter === 'played') return isPlayed;
    if (filter === 'upcoming') return !isPlayed;
    return true;
  });

  const groupedByDate: Record<string, MatchData[]> = {};
  filteredMatches.forEach(m => {
    if (!groupedByDate[m.date]) groupedByDate[m.date] = [];
    groupedByDate[m.date].push(m);
  });

  const playedCount = matches.filter(m => m.status === 'FT' || m.date === 'LIVE').length;
  const upcomingCount = matches.filter(m => m.status !== 'FT' && m.date !== 'LIVE').length;

  return (
    <div className="bg-[#0b0f19] text-gray-200 font-sans min-h-screen p-4 md:p-8 rounded-2xl w-full mx-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-[#1e293b] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xl md:text-2xl font-black tracking-wider text-white">
              <Trophy className="w-6 h-6 text-yellow-400" /> WORLD CUP 2026
            </div>
            <div className="text-xs text-gray-400 mt-1 font-semibold tracking-widest flex items-center gap-2">
              USA • MEXICO • CANADA 
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">LIVE</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search team..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 bg-[#121824] border border-[#1e293b] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#38bdf8] transition"
              />
            </div>
            <button 
              onClick={handleRefresh}
              className="bg-[#121824] border border-[#1e293b] hover:bg-slate-800 text-gray-300 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </header>

        {/* Content Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-300">{filteredMatches.length} matches</span>
            <div className="flex bg-[#121824] p-0.5 rounded-md border border-[#1e293b]">
              <button 
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded transition font-medium ${filter === 'all' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                All ({matches.length})
              </button>
              <button 
                onClick={() => setFilter('played')}
                className={`px-2.5 py-1 rounded transition font-medium ${filter === 'played' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                Played ({playedCount})
              </button>
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-2.5 py-1 rounded transition font-medium ${filter === 'upcoming' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
              >
                Upcoming ({upcomingCount})
              </button>
            </div>
          </div>
          <div className="text-[11px] text-gray-500">
            Live — auto-refreshes every 5s • Last: {now.toLocaleTimeString()}
          </div>
        </div>

        {/* Match Grid */}
        <div className="space-y-8 pb-12">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-[#1e293b] rounded-xl bg-[#121824]/30 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#38bdf8]" />
              Fetching Live Matches...
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-[#1e293b] rounded-xl bg-[#121824]/30">
              <Trophy className="mx-auto mb-3 opacity-50 w-8 h-8" />
              No matches found for this filter.
            </div>
          ) : (
            Object.keys(groupedByDate).map(dateKey => (
              <div key={dateKey}>
                <h3 className="text-sm font-bold text-gray-400 tracking-wide mb-4 border-l-2 border-[#38bdf8] pl-2 uppercase">
                  {dateKey === 'LIVE' ? '🔴 LIVE MATCHES' : dateKey}
                </h3>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {groupedByDate[dateKey].map(match => {
                      const isUpcoming = match.status !== 'FT' && match.date !== 'LIVE';
                      const isLive = match.date === 'LIVE' || match.status.includes("'");
                      
                      const statusClass = isUpcoming 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : isLive 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                      const scoreTextClass = isUpcoming ? 'text-gray-500 text-xs font-semibold' : 'text-white font-black text-base';
                      
                      let team1Highlight = 'text-gray-200';
                      let team2Highlight = 'text-gray-200';
                      
                      if (!isUpcoming && !isLive) {
                        const s1 = parseInt(match.homeScore as string);
                        const s2 = parseInt(match.awayScore as string);
                        if (s1 > s2) { team1Highlight = 'text-emerald-400 font-bold'; team2Highlight = 'text-gray-500'; }
                        else if (s2 > s1) { team2Highlight = 'text-emerald-400 font-bold'; team1Highlight = 'text-gray-500'; }
                      }

                      return (
                        <motion.div 
                          layout
                          key={match.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <motion.div
                            key={`${match.homeScore}-${match.awayScore}-${isLive ? 'live' : 'not'}`}
                            initial={{ scale: 1.05, borderColor: '#38bdf8', backgroundColor: '#1e293b' }}
                            animate={{ scale: 1, borderColor: '#1e293b', backgroundColor: '#121824' }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="border-2 rounded-xl p-4 hover:border-slate-700 transition-[border-color] flex flex-col justify-between shadow-sm h-full"
                          >
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                              <span className="font-medium text-slate-400">{match.group}</span>
                              <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${statusClass}`}>
                                {match.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between my-2 px-2">
                              <div className="flex flex-col items-center gap-1 w-5/12 text-center">
                                <span className="text-2xl leading-none">{match.homeFlag}</span>
                                <span className={`text-sm tracking-wide ${team1Highlight}`}>{match.home}</span>
                              </div>
                              <div className="w-2/12 flex justify-center">
                                <motion.div 
                                  key={`${match.homeScore}-${match.awayScore}`}
                                  initial={{ scale: 1.5, opacity: 0, color: '#38bdf8' }}
                                  animate={{ scale: 1, opacity: 1, color: '#ffffff' }}
                                  className={`${scoreTextClass} w-full text-center bg-[#0b0f19] py-1 rounded border border-[#1e293b]/50`}
                                >
                                  {isUpcoming ? '- : -' : `${match.homeScore} : ${match.awayScore}`}
                                </motion.div>
                              </div>
                              <div className="flex flex-col items-center gap-1 w-5/12 text-center">
                                <span className="text-2xl leading-none">{match.awayFlag}</span>
                                <span className={`text-sm tracking-wide ${team2Highlight}`}>{match.away}</span>
                              </div>
                            </div>

                            {/* Scorers Section (if any) */}
                            {(!isUpcoming && ((match.homeScorers && match.homeScorers.length > 0) || (match.awayScorers && match.awayScorers.length > 0))) && (
                              <div className="mt-3 pt-2 border-t border-[#1e293b]/50 flex justify-between text-[10px] text-gray-500 min-h-[32px]">
                                <div className="w-5/12 flex items-start flex-col gap-0.5">
                                  {match.homeScorers?.map((s, i) => <span key={i} className="text-emerald-500/80">{s}</span>)}
                                </div>
                                <div className="w-5/12 flex items-end flex-col gap-0.5 text-right">
                                  {match.awayScorers?.map((s, i) => <span key={i} className="text-emerald-500/80">{s}</span>)}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-3 border-t border-[#1e293b]/50 flex flex-col gap-1 text-[11px] text-gray-500">
                              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-600" /> {isUpcoming ? match.status : match.time}</div>
                              <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-600" /> {match.stadium}</div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
