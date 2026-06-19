export interface Team {
  code: string;
  name: string;
  flag: string;
  group: string;
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
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', group: 'A' },
  RSA: { code: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'A' },
  KOR: { code: 'KOR', name: 'South Korea', flag: '🇰🇷', group: 'A' },
  CZE: { code: 'CZE', name: 'Czechia', flag: '🇨🇿', group: 'A' },
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪', group: 'G' },
  EGY: { code: 'EGY', name: 'Egypt', flag: '🇪🇬', group: 'G' },
  IRN: { code: 'IRN', name: 'Iran', flag: '🇮🇷', group: 'G' },
  NZL: { code: 'NZL', name: 'New Zealand', flag: '🇳🇿', group: 'G' },
  BRA: { code: 'BRA', name: 'Brazil', flag: '🇧🇷', group: 'C' },
  MAR: { code: 'MAR', name: 'Morocco', flag: '🇲🇦', group: 'C' },
  HAI: { code: 'HAI', name: 'Haiti', flag: '🇭🇹', group: 'C' },
  SCO: { code: 'SCO', name: 'Scotland', flag: '🏴', group: 'C' },
  FRA: { code: 'FRA', name: 'France', flag: '🇫🇷', group: 'I' },
  SEN: { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  IRQ: { code: 'IRQ', name: 'Iraq', flag: '🇮🇶', group: 'I' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴', group: 'I' },
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪', group: 'E' },
  CUW: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼', group: 'E' },
  CIV: { code: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', group: 'E' },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  COD: { code: 'COD', name: 'DR Congo', flag: '🇨🇩', group: 'K' },
  UZB: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', group: 'K' },
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'K' },
  NED: { code: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'F' },
  JPN: { code: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'F' },
  SWE: { code: 'SWE', name: 'Sweden', flag: '🇸🇪', group: 'F' },
  TUN: { code: 'TUN', name: 'Tunisia', flag: '🇹🇳', group: 'F' },
  ENG: { code: 'ENG', name: 'England', flag: '🏴', group: 'L' },
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷', group: 'L' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'L' },
  PAN: { code: 'PAN', name: 'Panama', flag: '🇵🇦', group: 'L' },
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦', group: 'B' },
  BIH: { code: 'BIH', name: 'Bosnia', flag: '🇧🇦', group: 'B' },
  QAT: { code: 'QAT', name: 'Qatar', flag: '🇶🇦', group: 'B' },
  SUI: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭', group: 'B' },
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸', group: 'H' },
  CPV: { code: 'CPV', name: 'Cape Verde', flag: '🇨🇻', group: 'H' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', group: 'H' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
  USA: { code: 'USA', name: 'USA', flag: '🇺🇸', group: 'D' },
  PAR: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'D' },
  TUR: { code: 'TUR', name: 'Türkiye', flag: '🇹🇷', group: 'D' },
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'J' },
  ALG: { code: 'ALG', name: 'Algeria', flag: '🇩🇿', group: 'J' },
  AUT: { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'J' },
  JOR: { code: 'JOR', name: 'Jordan', flag: '🇯🇴', group: 'J' },
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
  // Group A
  { id: 'A1', team1: 'MEX', team2: 'RSA', date: 'June 11', time: '8PM', venue: 'Mexico City, Mexico', stage: 'Group', group: 'A' },
  { id: 'A2', team1: 'KOR', team2: 'CZE', date: 'June 12', time: '3AM', venue: 'Guadalajara, Mexico', stage: 'Group', group: 'A' },
  { id: 'A3', team1: 'CZE', team2: 'RSA', date: 'June 18', time: '5PM', venue: 'Atlanta, USA', stage: 'Group', group: 'A' },
  { id: 'A4', team1: 'MEX', team2: 'KOR', date: 'June 19', time: '2AM', venue: 'Guadalajara, Mexico', stage: 'Group', group: 'A' },
  { id: 'A5', team1: 'RSA', team2: 'KOR', date: 'June 25', time: '2AM', venue: 'Monterrey, Mexico', stage: 'Group', group: 'A' },
  { id: 'A6', team1: 'CZE', team2: 'MEX', date: 'June 25', time: '2AM', venue: 'Mexico City, Mexico', stage: 'Group', group: 'A' },
  // Group B
  { id: 'B1', team1: 'CAN', team2: 'BIH', date: 'June 12', time: '8PM', venue: 'Toronto, Canada', stage: 'Group', group: 'B' },
  { id: 'B2', team1: 'QAT', team2: 'SUI', date: 'June 13', time: '8PM', venue: 'San Francisco Bay Area, USA', stage: 'Group', group: 'B' },
  { id: 'B3', team1: 'SUI', team2: 'BIH', date: 'June 18', time: '8PM', venue: 'Los Angeles, USA', stage: 'Group', group: 'B' },
  { id: 'B4', team1: 'CAN', team2: 'QAT', date: 'June 18', time: '11PM', venue: 'Vancouver, Canada', stage: 'Group', group: 'B' },
  { id: 'B5', team1: 'BIH', team2: 'QAT', date: 'June 24', time: '8PM', venue: 'Seattle, USA', stage: 'Group', group: 'B' },
  { id: 'B6', team1: 'SUI', team2: 'CAN', date: 'June 24', time: '8PM', venue: 'Vancouver, Canada', stage: 'Group', group: 'B' },
  // Group C
  { id: 'C1', team1: 'BRA', team2: 'MAR', date: 'June 13', time: '11PM', venue: 'New York/New Jersey, USA', stage: 'Group', group: 'C' },
  { id: 'C2', team1: 'HAI', team2: 'SCO', date: 'June 14', time: '2AM', venue: 'Boston, USA', stage: 'Group', group: 'C' },
  { id: 'C3', team1: 'SCO', team2: 'MAR', date: 'June 19', time: '11PM', venue: 'Boston, USA', stage: 'Group', group: 'C' },
  { id: 'C4', team1: 'BRA', team2: 'HAI', date: 'June 20', time: '1:30AM', venue: 'Philadelphia, USA', stage: 'Group', group: 'C' },
  { id: 'C5', team1: 'SCO', team2: 'BRA', date: 'June 24', time: '11PM', venue: 'Atlanta, USA', stage: 'Group', group: 'C' },
  { id: 'C6', team1: 'MAR', team2: 'HAI', date: 'June 24', time: '11PM', venue: 'Miami, USA', stage: 'Group', group: 'C' },
  // Group D
  { id: 'D1', team1: 'USA', team2: 'PAR', date: 'June 13', time: '2AM', venue: 'Los Angeles, USA', stage: 'Group', group: 'D' },
  { id: 'D2', team1: 'AUS', team2: 'TUR', date: 'June 14', time: '5AM', venue: 'Vancouver, Canada', stage: 'Group', group: 'D' },
  { id: 'D3', team1: 'TUR', team2: 'PAR', date: 'June 20', time: '4AM', venue: 'San Francisco Bay Area, USA', stage: 'Group', group: 'D' },
  { id: 'D4', team1: 'USA', team2: 'AUS', date: 'June 19', time: '8PM', venue: 'Seattle, USA', stage: 'Group', group: 'D' },
  { id: 'D5', team1: 'TUR', team2: 'USA', date: 'June 26', time: '3AM', venue: 'Los Angeles, USA', stage: 'Group', group: 'D' },
  { id: 'D6', team1: 'PAR', team2: 'AUS', date: 'June 26', time: '3AM', venue: 'San Francisco Bay Area, USA', stage: 'Group', group: 'D' },
  // Group E
  { id: 'E1', team1: 'GER', team2: 'CUW', date: 'June 14', time: '6PM', venue: 'Houston, USA', stage: 'Group', group: 'E' },
  { id: 'E2', team1: 'CIV', team2: 'ECU', date: 'June 15', time: '12AM', venue: 'Philadelphia, USA', stage: 'Group', group: 'E' },
  { id: 'E3', team1: 'GER', team2: 'CIV', date: 'June 20', time: '9PM', venue: 'Toronto, Canada', stage: 'Group', group: 'E' },
  { id: 'E4', team1: 'ECU', team2: 'CUW', date: 'June 21', time: '1AM', venue: 'Kansas City, USA', stage: 'Group', group: 'E' },
  { id: 'E5', team1: 'CUW', team2: 'CIV', date: 'June 25', time: '9PM', venue: 'Philadelphia, USA', stage: 'Group', group: 'E' },
  { id: 'E6', team1: 'ECU', team2: 'GER', date: 'June 25', time: '9PM', venue: 'New York/New Jersey, USA', stage: 'Group', group: 'E' },
  // Group F
  { id: 'F1', team1: 'NED', team2: 'JPN', date: 'June 14', time: '9PM', venue: 'Dallas, USA', stage: 'Group', group: 'F' },
  { id: 'F2', team1: 'SWE', team2: 'TUN', date: 'June 15', time: '3AM', venue: 'Monterrey, Mexico', stage: 'Group', group: 'F' },
  { id: 'F3', team1: 'NED', team2: 'SWE', date: 'June 20', time: '6PM', venue: 'Houston, USA', stage: 'Group', group: 'F' },
  { id: 'F4', team1: 'TUN', team2: 'JPN', date: 'June 21', time: '5AM', venue: 'Monterrey, Mexico', stage: 'Group', group: 'F' },
  { id: 'F5', team1: 'JPN', team2: 'SWE', date: 'June 26', time: '12AM', venue: 'Dallas, USA', stage: 'Group', group: 'F' },
  { id: 'F6', team1: 'TUN', team2: 'NED', date: 'June 26', time: '12AM', venue: 'Kansas City, USA', stage: 'Group', group: 'F' },
  // Group G
  { id: 'G1', team1: 'BEL', team2: 'EGY', date: 'June 15', time: '8PM', venue: 'Seattle, USA', stage: 'Group', group: 'G' },
  { id: 'G2', team1: 'IRN', team2: 'NZL', date: 'June 16', time: '2AM', venue: 'Los Angeles, USA', stage: 'Group', group: 'G' },
  { id: 'G3', team1: 'BEL', team2: 'IRN', date: 'June 21', time: '8PM', venue: 'Los Angeles, USA', stage: 'Group', group: 'G' },
  { id: 'G4', team1: 'NZL', team2: 'EGY', date: 'June 22', time: '2AM', venue: 'Vancouver, Canada', stage: 'Group', group: 'G' },
  { id: 'G5', team1: 'EGY', team2: 'IRN', date: 'June 27', time: '4AM', venue: 'Vancouver, Canada', stage: 'Group', group: 'G' },
  { id: 'G6', team1: 'NZL', team2: 'BEL', date: 'June 27', time: '4AM', venue: 'Seattle, USA', stage: 'Group', group: 'G' },
  // Group H
  { id: 'H1', team1: 'ESP', team2: 'CPV', date: 'June 15', time: '5PM', venue: 'Atlanta, USA', stage: 'Group', group: 'H' },
  { id: 'H2', team1: 'KSA', team2: 'URU', date: 'June 15', time: '11PM', venue: 'Miami, USA', stage: 'Group', group: 'H' },
  { id: 'H3', team1: 'ESP', team2: 'KSA', date: 'June 21', time: '5PM', venue: 'Atlanta, USA', stage: 'Group', group: 'H' },
  { id: 'H4', team1: 'URU', team2: 'CPV', date: 'June 21', time: '11PM', venue: 'Miami, USA', stage: 'Group', group: 'H' },
  { id: 'H5', team1: 'CPV', team2: 'KSA', date: 'June 27', time: '1AM', venue: 'Houston, USA', stage: 'Group', group: 'H' },
  { id: 'H6', team1: 'URU', team2: 'ESP', date: 'June 27', time: '1AM', venue: 'Guadalajara, Mexico', stage: 'Group', group: 'H' },
  // Group I
  { id: 'I1', team1: 'FRA', team2: 'SEN', date: 'June 16', time: '8PM', venue: 'New York/New Jersey, USA', stage: 'Group', group: 'I' },
  { id: 'I2', team1: 'IRQ', team2: 'NOR', date: 'June 16', time: '11PM', venue: 'Boston, USA', stage: 'Group', group: 'I' },
  { id: 'I3', team1: 'FRA', team2: 'IRQ', date: 'June 22', time: '10PM', venue: 'Philadelphia, USA', stage: 'Group', group: 'I' },
  { id: 'I4', team1: 'NOR', team2: 'SEN', date: 'June 23', time: '1AM', venue: 'New York/New Jersey, USA', stage: 'Group', group: 'I' },
  { id: 'I5', team1: 'SEN', team2: 'IRQ', date: 'June 26', time: '8PM', venue: 'Toronto, Canada', stage: 'Group', group: 'I' },
  { id: 'I6', team1: 'NOR', team2: 'FRA', date: 'June 26', time: '8PM', venue: 'Boston, USA', stage: 'Group', group: 'I' },
  // Group J
  { id: 'J1', team1: 'ARG', team2: 'ALG', date: 'June 17', time: '2AM', venue: 'Kansas City, USA', stage: 'Group', group: 'J' },
  { id: 'J2', team1: 'AUT', team2: 'JOR', date: 'June 17', time: '5AM', venue: 'San Francisco Bay Area, USA', stage: 'Group', group: 'J' },
  { id: 'J3', team1: 'ARG', team2: 'AUT', date: 'June 22', time: '6PM', venue: 'Dallas, USA', stage: 'Group', group: 'J' },
  { id: 'J4', team1: 'JOR', team2: 'ALG', date: 'June 23', time: '4AM', venue: 'San Francisco Bay Area, USA', stage: 'Group', group: 'J' },
  { id: 'J5', team1: 'ALG', team2: 'AUT', date: 'June 28', time: '3AM', venue: 'Kansas City, USA', stage: 'Group', group: 'J' },
  { id: 'J6', team1: 'JOR', team2: 'ARG', date: 'June 28', time: '3AM', venue: 'Dallas, USA', stage: 'Group', group: 'J' },
  // Group K
  { id: 'K1', team1: 'POR', team2: 'COD', date: 'June 17', time: '6PM', venue: 'Houston, USA', stage: 'Group', group: 'K' },
  { id: 'K2', team1: 'UZB', team2: 'COL', date: 'June 18', time: '3AM', venue: 'Mexico City, Mexico', stage: 'Group', group: 'K' },
  { id: 'K3', team1: 'COL', team2: 'COD', date: 'June 24', time: '3AM', venue: 'Guadalajara, Mexico', stage: 'Group', group: 'K' },
  { id: 'K4', team1: 'POR', team2: 'UZB', date: 'June 23', time: '6PM', venue: 'Houston, USA', stage: 'Group', group: 'K' },
  { id: 'K5', team1: 'COD', team2: 'UZB', date: 'June 28', time: '12:30AM', venue: 'Atlanta, USA', stage: 'Group', group: 'K' },
  { id: 'K6', team1: 'COL', team2: 'POR', date: 'June 28', time: '12:30AM', venue: 'Miami, USA', stage: 'Group', group: 'K' },
  // Group L
  { id: 'L1', team1: 'ENG', team2: 'CRO', date: 'June 17', time: '9PM', venue: 'Dallas, USA', stage: 'Group', group: 'L' },
  { id: 'L2', team1: 'GHA', team2: 'PAN', date: 'June 18', time: '12AM', venue: 'Toronto, Canada', stage: 'Group', group: 'L' },
  { id: 'L3', team1: 'ENG', team2: 'GHA', date: 'June 23', time: '9PM', venue: 'Boston, USA', stage: 'Group', group: 'L' },
  { id: 'L4', team1: 'PAN', team2: 'CRO', date: 'June 24', time: '12AM', venue: 'Toronto, Canada', stage: 'Group', group: 'L' },
  { id: 'L5', team1: 'CRO', team2: 'GHA', date: 'June 27', time: '10PM', venue: 'Philadelphia, USA', stage: 'Group', group: 'L' },
  { id: 'L6', team1: 'PAN', team2: 'ENG', date: 'June 27', time: '10PM', venue: 'New York/New Jersey, USA', stage: 'Group', group: 'L' },
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
