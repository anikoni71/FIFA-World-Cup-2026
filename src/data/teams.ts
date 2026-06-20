export interface Team {
  code: string;
  name: string;
  flag: string;
  group: string;
  iso?: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  stage: string;
  group?: string;
}

export const teams: Record<string, Team> = {
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', group: 'A', iso: 'mx' },
  RSA: { code: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'A', iso: 'za' },
  KOR: { code: 'KOR', name: 'South Korea', flag: '🇰🇷', group: 'A', iso: 'kr' },
  CZE: { code: 'CZE', name: 'Czechia', flag: '🇨🇿', group: 'A', iso: 'cz' },
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪', group: 'G', iso: 'be' },
  EGY: { code: 'EGY', name: 'Egypt', flag: '🇪🇬', group: 'G', iso: 'eg' },
  IRN: { code: 'IRN', name: 'Iran', flag: '🇮🇷', group: 'G', iso: 'ir' },
  NZL: { code: 'NZL', name: 'New Zealand', flag: '🇳🇿', group: 'G', iso: 'nz' },
  BRA: { code: 'BRA', name: 'Brazil', flag: '🇧🇷', group: 'C', iso: 'br' },
  MAR: { code: 'MAR', name: 'Morocco', flag: '🇲🇦', group: 'C', iso: 'ma' },
  HAI: { code: 'HAI', name: 'Haiti', flag: '🇭🇹', group: 'C', iso: 'ht' },
  SCO: { code: 'SCO', name: 'Scotland', flag: '🏴', group: 'C', iso: 'gb-sct' },
  FRA: { code: 'FRA', name: 'France', flag: '🇫🇷', group: 'I', iso: 'fr' },
  SEN: { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'I', iso: 'sn' },
  IRQ: { code: 'IRQ', name: 'Iraq', flag: '🇮🇶', group: 'I', iso: 'iq' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴', group: 'I', iso: 'no' },
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪', group: 'E', iso: 'de' },
  CUW: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼', group: 'E', iso: 'cw' },
  CIV: { code: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', group: 'E', iso: 'ci' },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'E', iso: 'ec' },
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'K', iso: 'pt' },
  COD: { code: 'COD', name: 'DR Congo', flag: '🇨🇩', group: 'K', iso: 'cd' },
  UZB: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', group: 'K', iso: 'uz' },
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'K', iso: 'co' },
  NED: { code: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'F', iso: 'nl' },
  JPN: { code: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'F', iso: 'jp' },
  SWE: { code: 'SWE', name: 'Sweden', flag: '🇸🇪', group: 'F', iso: 'se' },
  TUN: { code: 'TUN', name: 'Tunisia', flag: '🇹🇳', group: 'F', iso: 'tn' },
  ENG: { code: 'ENG', name: 'England', flag: '🏴', group: 'L', iso: 'gb-eng' },
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷', group: 'L', iso: 'hr' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'L', iso: 'gh' },
  PAN: { code: 'PAN', name: 'Panama', flag: '🇵🇦', group: 'L', iso: 'pa' },
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦', group: 'B', iso: 'ca' },
  BIH: { code: 'BIH', name: 'Bosnia', flag: '🇧🇦', group: 'B', iso: 'ba' },
  QAT: { code: 'QAT', name: 'Qatar', flag: '🇶🇦', group: 'B', iso: 'qa' },
  SUI: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭', group: 'B', iso: 'ch' },
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸', group: 'H', iso: 'es' },
  CPV: { code: 'CPV', name: 'Cape Verde', flag: '🇨🇻', group: 'H', iso: 'cv' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', group: 'H', iso: 'sa' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'H', iso: 'uy' },
  USA: { code: 'USA', name: 'USA', flag: '🇺🇸', group: 'D', iso: 'us' },
  PAR: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'D', iso: 'py' },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'D', iso: 'au' },
  TUR: { code: 'TUR', name: 'Türkiye', flag: '🇹🇷', group: 'D', iso: 'tr' },
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'J', iso: 'ar' },
  ALG: { code: 'ALG', name: 'Algeria', flag: '🇩🇿', group: 'J', iso: 'dz' },
  AUT: { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'J', iso: 'at' },
  JOR: { code: 'JOR', name: 'Jordan', flag: '🇯🇴', group: 'J', iso: 'jo' },
};

export const groups: Record<string, string[]> = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
};

export const groupMatches: Match[] = [
  // GROUP A
  { id: "m1", group: "A", stage: "Group", venue: "Mexico City", date: "12 Jun (Fri)", team1: "MEX", team2: "RSA", time: "8:00 AM BDT" },
  { id: "m2", group: "A", stage: "Group", venue: "Guadalajara", date: "13 Jun (Sat)", team1: "KOR", team2: "CZE", time: "6:00 AM BDT" },
  { id: "m3", group: "A", stage: "Group", venue: "Atlanta", date: "19 Jun (Fri)", team1: "CZE", team2: "RSA", time: "7:00 AM BDT" },
  { id: "m4", group: "A", stage: "Group", venue: "Guadalajara", date: "19 Jun (Fri)", team1: "MEX", team2: "KOR", time: "10:00 AM BDT" },
  { id: "m5", group: "A", stage: "Group", venue: "Monterrey", date: "26 Jun (Fri)", team1: "RSA", team2: "KOR", time: "6:00 AM BDT" },
  { id: "m6", group: "A", stage: "Group", venue: "Mexico City", date: "26 Jun (Fri)", team1: "CZE", team2: "MEX", time: "6:00 AM BDT" },

  // GROUP B
  { id: "m7", group: "B", stage: "Group", venue: "Toronto", date: "13 Jun (Sat)", team1: "CAN", team2: "BIH", time: "6:00 AM BDT" },
  { id: "m8", group: "B", stage: "Group", venue: "San Fran", date: "14 Jun (Sun)", team1: "QAT", team2: "SUI", time: "9:00 AM BDT" },
  { id: "m9", group: "B", stage: "Group", venue: "LA", date: "19 Jun (Fri)", team1: "SUI", team2: "BIH", time: "9:00 AM BDT" },
  { id: "m10", group: "B", stage: "Group", venue: "Vancouver", date: "19 Jun (Fri)", team1: "CAN", team2: "QAT", time: "12:00 PM BDT" },
  { id: "m11", group: "B", stage: "Group", venue: "Seattle", date: "25 Jun (Thu)", team1: "BIH", team2: "QAT", time: "9:00 AM BDT" },
  { id: "m12", group: "B", stage: "Group", venue: "Vancouver", date: "25 Jun (Thu)", team1: "SUI", team2: "CAN", time: "9:00 AM BDT" },

  // GROUP C
  { id: "m13", group: "C", stage: "Group", venue: "NY/NJ", date: "14 Jun (Sun)", team1: "BRA", team2: "MAR", time: "9:00 AM BDT" },
  { id: "m14", group: "C", stage: "Group", venue: "Boston", date: "14 Jun (Sun)", team1: "HAI", team2: "SCO", time: "12:00 PM BDT" },
  { id: "m15", group: "C", stage: "Group", venue: "Boston", date: "20 Jun (Sat)", team1: "SCO", team2: "MAR", time: "9:00 AM BDT" },
  { id: "m16", group: "C", stage: "Group", venue: "Philly", date: "20 Jun (Sat)", team1: "BRA", team2: "HAI", time: "11:30 AM BDT" },
  { id: "m17", group: "C", stage: "Group", venue: "Atlanta", date: "25 Jun (Thu)", team1: "SCO", team2: "BRA", time: "9:00 AM BDT" },
  { id: "m18", group: "C", stage: "Group", venue: "Miami", date: "25 Jun (Thu)", team1: "MAR", team2: "HAI", time: "9:00 AM BDT" },

  // GROUP D
  { id: "m19", group: "D", stage: "Group", venue: "LA", date: "13 Jun (Sat)", team1: "USA", team2: "PAR", time: "7:00 AM BDT" },
  { id: "m20", group: "D", stage: "Group", venue: "Vancouver", date: "14 Jun (Sun)", team1: "AUS", team2: "TUR", time: "10:00 AM BDT" },
  { id: "m21", group: "D", stage: "Group", venue: "Seattle", date: "21 Jun (Sun)", team1: "USA", team2: "AUS", time: "6:00 AM BDT" },
  { id: "m22", group: "D", stage: "Group", venue: "San Fran", date: "20 Jun (Sat)", team1: "TUR", team2: "PAR", time: "5:00 PM BDT" }, 
  { id: "m23", group: "D", stage: "Group", venue: "LA", date: "26 Jun (Fri)", team1: "TUR", team2: "USA", time: "7:00 AM BDT" },
  { id: "m24", group: "D", stage: "Group", venue: "San Fran", date: "26 Jun (Fri)", team1: "PAR", team2: "AUS", time: "7:00 AM BDT" },

  // GROUP E
  { id: "m25", group: "E", stage: "Group", venue: "Houston", date: "15 Jun (Mon)", team1: "GER", team2: "CUW", time: "5:00 AM BDT" },
  { id: "m26", group: "E", stage: "Group", venue: "Philly", date: "15 Jun (Mon)", team1: "CIV", team2: "ECU", time: "10:00 AM BDT" },
  { id: "m27", group: "E", stage: "Group", venue: "Toronto", date: "21 Jun (Sun)", team1: "GER", team2: "CIV", time: "7:00 AM BDT" },
  { id: "m28", group: "E", stage: "Group", venue: "Kansas City", date: "21 Jun (Sun)", team1: "ECU", team2: "CUW", time: "12:00 PM BDT" },
  { id: "m29", group: "E", stage: "Group", venue: "Philly", date: "26 Jun (Fri)", team1: "CUW", team2: "CIV", time: "7:00 AM BDT" },
  { id: "m30", group: "E", stage: "Group", venue: "NY/NJ", date: "26 Jun (Fri)", team1: "ECU", team2: "GER", time: "7:00 AM BDT" },

  // GROUP F
  { id: "m31", group: "F", stage: "Group", venue: "Dallas", date: "15 Jun (Mon)", team1: "NED", team2: "JPN", time: "8:00 AM BDT" },
  { id: "m32", group: "F", stage: "Group", venue: "Monterrey", date: "15 Jun (Mon)", team1: "SWE", team2: "TUN", time: "3:00 PM BDT" },
  { id: "m33", group: "F", stage: "Group", venue: "Houston", date: "21 Jun (Sun)", team1: "NED", team2: "SWE", time: "5:00 AM BDT" },
  { id: "m34", group: "F", stage: "Group", venue: "Monterrey", date: "21 Jun (Sun)", team1: "TUN", team2: "JPN", time: "5:00 PM BDT" },
  { id: "m35", group: "F", stage: "Group", venue: "Dallas", date: "26 Jun (Fri)", team1: "JPN", team2: "SWE", time: "11:00 AM BDT" },
  { id: "m36", group: "F", stage: "Group", venue: "Kansas City", date: "26 Jun (Fri)", team1: "TUN", team2: "NED", time: "11:00 AM BDT" },

  // GROUP G
  { id: "m37", group: "G", stage: "Group", venue: "Seattle", date: "16 Jun (Tue)", team1: "BEL", team2: "EGY", time: "9:00 AM BDT" },
  { id: "m38", group: "G", stage: "Group", venue: "LA", date: "16 Jun (Tue)", team1: "IRN", team2: "NZL", time: "3:00 PM BDT" },
  { id: "m39", group: "G", stage: "Group", venue: "LA", date: "22 Jun (Mon)", team1: "BEL", team2: "IRN", time: "9:00 AM BDT" },
  { id: "m40", group: "G", stage: "Group", venue: "Vancouver", date: "22 Jun (Mon)", team1: "NZL", team2: "EGY", time: "3:00 PM BDT" },
  { id: "m41", group: "G", stage: "Group", venue: "Vancouver", date: "27 Jun (Sat)", team1: "EGY", team2: "IRN", time: "5:00 PM BDT" },
  { id: "m42", group: "G", stage: "Group", venue: "Seattle", date: "27 Jun (Sat)", team1: "NZL", team2: "BEL", time: "5:00 PM BDT" },

  // GROUP H
  { id: "m43", group: "H", stage: "Group", venue: "Atlanta", date: "16 Jun (Tue)", team1: "ESP", team2: "CPV", time: "6:00 AM BDT" }, 
  { id: "m44", group: "H", stage: "Group", venue: "Miami", date: "16 Jun (Tue)", team1: "KSA", team2: "URU", time: "9:00 AM BDT" },
  { id: "m45", group: "H", stage: "Group", venue: "Atlanta", date: "22 Jun (Mon)", team1: "ESP", team2: "KSA", time: "5:00 AM BDT" }, 
  { id: "m46", group: "H", stage: "Group", venue: "Miami", date: "22 Jun (Mon)", team1: "URU", team2: "CPV", time: "9:00 AM BDT" },
  { id: "m47", group: "H", stage: "Group", venue: "Houston", date: "27 Jun (Sat)", team1: "CPV", team2: "KSA", time: "12:00 PM BDT" },
  { id: "m48", group: "H", stage: "Group", venue: "Guadalajara", date: "27 Jun (Sat)", team1: "URU", team2: "ESP", time: "1:00 PM BDT" },

  // GROUP I
  { id: "m49", group: "I", stage: "Group", venue: "NY/NJ", date: "17 Jun (Wed)", team1: "FRA", team2: "SEN", time: "6:00 AM BDT" },
  { id: "m50", group: "I", stage: "Group", venue: "Boston", date: "17 Jun (Wed)", team1: "IRQ", team2: "NOR", time: "9:00 AM BDT" },
  { id: "m51", group: "I", stage: "Group", venue: "Philly", date: "23 Jun (Tue)", team1: "FRA", team2: "IRQ", time: "8:00 AM BDT" },
  { id: "m52", group: "I", stage: "Group", venue: "NY/NJ", date: "23 Jun (Tue)", team1: "NOR", team2: "SEN", time: "11:00 AM BDT" },
  { id: "m53", group: "I", stage: "Group", venue: "Toronto", date: "27 Jun (Sat)", team1: "SEN", team2: "IRQ", time: "6:00 AM BDT" },
  { id: "m54", group: "I", stage: "Group", venue: "Boston", date: "27 Jun (Sat)", team1: "NOR", team2: "FRA", time: "6:00 AM BDT" },

  // GROUP J
  { id: "m55", group: "J", stage: "Group", venue: "Kansas City", date: "17 Jun (Wed)", team1: "ARG", team2: "ALG", time: "1:00 PM BDT" },
  { id: "m56", group: "J", stage: "Group", venue: "San Fran", date: "17 Jun (Wed)", team1: "AUT", team2: "JOR", time: "6:00 PM BDT" },
  { id: "m57", group: "J", stage: "Group", venue: "Dallas", date: "23 Jun (Tue)", team1: "ARG", team2: "AUT", time: "5:00 AM BDT" },
  { id: "m58", group: "J", stage: "Group", venue: "San Fran", date: "23 Jun (Tue)", team1: "JOR", team2: "ALG", time: "5:00 PM BDT" },
  { id: "m59", group: "J", stage: "Group", venue: "Kansas City", date: "28 Jun (Sun)", team1: "ALG", team2: "AUT", time: "2:00 PM BDT" },
  { id: "m60", group: "J", stage: "Group", venue: "Dallas", date: "28 Jun (Sun)", team1: "JOR", team2: "ARG", time: "2:00 PM BDT" },

  // GROUP K
  { id: "m61", group: "K", stage: "Group", venue: "Houston", date: "18 Jun (Thu)", team1: "POR", team2: "COD", time: "5:00 AM BDT" },
  { id: "m62", group: "K", stage: "Group", venue: "Mexico City", date: "18 Jun (Thu)", team1: "UZB", team2: "COL", time: "3:00 PM BDT" },
  { id: "m63", group: "K", stage: "Group", venue: "Houston", date: "24 Jun (Wed)", team1: "POR", team2: "UZB", time: "5:00 AM BDT" },
  { id: "m64", group: "K", stage: "Group", venue: "Guadalajara", date: "24 Jun (Wed)", team1: "COL", team2: "COD", time: "3:00 PM BDT" },
  { id: "m65", group: "K", stage: "Group", venue: "Atlanta", date: "28 Jun (Sun)", team1: "COD", team2: "UZB", time: "10:30 AM BDT" },
  { id: "m66", group: "K", stage: "Group", venue: "Miami", date: "28 Jun (Sun)", team1: "COL", team2: "POR", time: "10:30 AM BDT" },

  // GROUP L
  { id: "m67", group: "L", stage: "Group", venue: "Dallas", date: "18 Jun (Thu)", team1: "ENG", team2: "CRO", time: "8:00 AM BDT" },
  { id: "m68", group: "L", stage: "Group", venue: "Toronto", date: "18 Jun (Thu)", team1: "GHA", team2: "PAN", time: "10:00 AM BDT" },
  { id: "m69", group: "L", stage: "Group", venue: "Boston", date: "24 Jun (Wed)", team1: "ENG", team2: "GHA", time: "7:00 AM BDT" },
  { id: "m70", group: "L", stage: "Group", venue: "Toronto", date: "24 Jun (Wed)", team1: "PAN", team2: "CRO", time: "10:00 AM BDT" },
  { id: "m71", group: "L", stage: "Group", venue: "Philly", date: "27 Jun (Sat)", team1: "CRO", team2: "GHA", time: "1:00 PM BDT" },
  { id: "m72", group: "L", stage: "Group", venue: "NY/NJ", date: "27 Jun (Sat)", team1: "PAN", team2: "ENG", time: "1:00 PM BDT" },
];

export const knockoutMatches: Match[] = [
  // Round of 32
  { id: 'R32-1', team1: '1E', team2: '3ABCDF', date: 'June 29', time: '9:30PM', venue: 'Boston, USA', stage: 'Round of 32' },
  { id: 'R32-2', team1: '2A', team2: '2B', date: 'June 28', time: '8PM', venue: 'Los Angeles, USA', stage: 'Round of 32' },
  { id: 'R32-3', team1: '1I', team2: '3CDFGH', date: 'June 30', time: '10PM', venue: 'New York/New Jersey, USA', stage: 'Round of 32' },
  { id: 'R32-4', team1: '1F', team2: '2C', date: 'June 30', time: '2AM', venue: 'Monterrey, Mexico', stage: 'Round of 32' },
  { id: 'R32-5', team1: '1C', team2: '2F', date: 'June 29', time: '6PM', venue: 'Houston, USA', stage: 'Round of 32' },
  { id: 'R32-6', team1: '1A', team2: '3CEFHI', date: 'July 1', time: '2AM', venue: 'Mexico City, Mexico', stage: 'Round of 32' },
  { id: 'R32-7', team1: '2E', team2: '2I', date: 'June 30', time: '6PM', venue: 'Dallas, USA', stage: 'Round of 32' },
  { id: 'R32-8', team1: '1L', team2: '3EHIJK', date: 'July 1', time: '5PM', venue: 'Atlanta, USA', stage: 'Round of 32' },
  { id: 'R32-9', team1: '2L', team2: '2K', date: 'July 3', time: '12AM', venue: 'Toronto, Canada', stage: 'Round of 32' },
  { id: 'R32-10', team1: '1D', team2: '3BEFIJ', date: 'July 2', time: '1AM', venue: 'San Francisco Bay Area, USA', stage: 'Round of 32' },
  { id: 'R32-11', team1: '1H', team2: '2J', date: 'July 2', time: '8PM', venue: 'Los Angeles, USA', stage: 'Round of 32' },
  { id: 'R32-12', team1: '1G', team2: '3AEHIJ', date: 'July 1', time: '9PM', venue: 'Seattle, USA', stage: 'Round of 32' },
  { id: 'R32-13', team1: '1J', team2: '2H', date: 'July 3', time: '11PM', venue: 'Miami, USA', stage: 'Round of 32' },
  { id: 'R32-14', team1: '1B', team2: '3EFGIJ', date: 'July 3', time: '4PM', venue: 'Vancouver, Canada', stage: 'Round of 32' },
  { id: 'R32-15', team1: '2D', team2: '2G', date: 'July 3', time: '7PM', venue: 'Dallas, USA', stage: 'Round of 32' },
  { id: 'R32-16', team1: '1K', team2: '3DEIJL', date: 'July 4', time: '2:30AM', venue: 'Kansas City, USA', stage: 'Round of 32' },
  // Round of 16
  { id: 'R16-1', team1: 'W(R32-1)', team2: 'W(R32-2)', date: 'July 4', time: '10PM', venue: 'Philadelphia, USA', stage: 'Round of 16' },
  { id: 'R16-2', team1: 'W(R32-3)', team2: 'W(R32-4)', date: 'July 4', time: '6PM', venue: 'Houston, USA', stage: 'Round of 16' },
  { id: 'R16-3', team1: 'W(R32-5)', team2: 'W(R32-6)', date: 'July 5', time: '10PM', venue: 'New York/New Jersey, USA', stage: 'Round of 16' },
  { id: 'R16-4', team1: 'W(R32-7)', team2: 'W(R32-8)', date: 'July 6', time: '1AM', venue: 'Mexico City, Mexico', stage: 'Round of 16' },
  { id: 'R16-5', team1: 'W(R32-9)', team2: 'W(R32-10)', date: 'July 6', time: '8PM', venue: 'Dallas, USA', stage: 'Round of 16' },
  { id: 'R16-6', team1: 'W(R32-11)', team2: 'W(R32-12)', date: 'July 7', time: '1AM', venue: 'Seattle, USA', stage: 'Round of 16' },
  { id: 'R16-7', team1: 'W(R32-13)', team2: 'W(R32-14)', date: 'July 7', time: '5PM', venue: 'Atlanta, USA', stage: 'Round of 16' },
  { id: 'R16-8', team1: 'W(R32-15)', team2: 'W(R32-16)', date: 'July 7', time: '9PM', venue: 'Vancouver, Canada', stage: 'Round of 16' },
  // Quarter-finals
  { id: 'QF-1', team1: 'W(R16-1)', team2: 'W(R16-2)', date: 'July 9', time: '9PM', venue: 'Boston, USA', stage: 'Quarter-Final' },
  { id: 'QF-2', team1: 'W(R16-3)', team2: 'W(R16-4)', date: 'July 11', time: '10PM', venue: 'Miami, USA', stage: 'Quarter-Final' },
  { id: 'QF-3', team1: 'W(R16-5)', team2: 'W(R16-6)', date: 'July 10', time: '8PM', venue: 'Los Angeles, USA', stage: 'Quarter-Final' },
  { id: 'QF-4', team1: 'W(R16-7)', team2: 'W(R16-8)', date: 'July 12', time: '2AM', venue: 'Kansas City, USA', stage: 'Quarter-Final' },
  // Semi-finals
  { id: 'SF-1', team1: 'W(QF-1)', team2: 'W(QF-3)', date: 'July 14', time: '8PM', venue: 'Dallas, USA', stage: 'Semi-Final' },
  { id: 'SF-2', team1: 'W(QF-2)', team2: 'W(QF-4)', date: 'July 15', time: '8PM', venue: 'Atlanta, USA', stage: 'Semi-Final' },
  // Third place
  { id: 'TP', team1: 'L(SF-1)', team2: 'L(SF-2)', date: 'July 18', time: '10PM', venue: 'Miami, USA', stage: 'Third Place' },
  // Final
  { id: 'F', team1: 'W(SF-1)', team2: 'W(SF-2)', date: 'July 19', time: '8PM', venue: 'New York/New Jersey, USA', stage: 'Final' },
];

export function getTeamMatches(teamCode: string): Match[] {
  return groupMatches.filter(m => m.team1 === teamCode || m.team2 === teamCode);
}
