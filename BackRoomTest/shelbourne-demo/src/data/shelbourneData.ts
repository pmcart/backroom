// Shelbourne FC Academy Demo Data — League of Ireland
// Demo environment — illustrative content only. No real personal data.

import type { Player, Coach, Session, IDPGoal, WellnessEntry, EducationModule, VideoClip } from './demoData';
import type { IDPFull, IDPSummary } from './idpData';

// ── Players ──────────────────────────────────────────────
export const shelPlayers: Player[] = [
  // U14 Boys (17 players)
  { id: 'sb1', name: 'Cian Murphy', position: 'Striker', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb2', name: 'Seán Byrne', position: 'Midfielder', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb3', name: 'Darragh Kelly', position: 'Centre-Back', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb4', name: 'Luke Nolan', position: 'Goalkeeper', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb5', name: 'Oisín Doyle', position: 'Winger', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6', name: 'Fionn O\'Brien', position: 'Midfielder', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6a', name: 'Cillian Roche', position: 'Full-Back', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6b', name: 'Eoghan Lennon', position: 'Centre-Back', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6c', name: 'Ruairí Flynn', position: 'Winger', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6d', name: 'Tadhg Cassidy', position: 'Midfielder', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6e', name: 'Dáire Hennessy', position: 'Striker', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6f', name: 'Lorcan Mooney', position: 'Full-Back', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6g', name: 'Pádraig Walsh', position: 'Midfielder', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6h', name: 'Colm Deegan', position: 'Defender', ageGroup: 'U14 Boys', status: 'recovery' },
  { id: 'sb6i', name: 'Rory Keegan', position: 'Goalkeeper', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6j', name: 'Niall Sheridan', position: 'Winger', ageGroup: 'U14 Boys', status: 'active' },
  { id: 'sb6k', name: 'Conall Brady', position: 'Full-Back', ageGroup: 'U14 Boys', status: 'active' },

  // U15 Boys (18 players)
  { id: 'sb7', name: 'Conor Daly', position: 'Striker', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb8', name: 'Ryan Kavanagh', position: 'Midfielder', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb9', name: 'Jack Whelan', position: 'Defender', ageGroup: 'U15 Boys', status: 'injured' },
  { id: 'sb10', name: 'Patrick Farrell', position: 'Winger', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb11', name: 'Cathal Dunne', position: 'Centre-Back', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12', name: 'Eoin Maguire', position: 'Goalkeeper', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12a', name: 'Diarmuid Kinsella', position: 'Full-Back', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12b', name: 'Séamus Nolan', position: 'Midfielder', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12c', name: 'Kevin Lynch', position: 'Winger', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12d', name: 'Barry Redmond', position: 'Centre-Back', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12e', name: 'Tomás Cullen', position: 'Striker', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12f', name: 'Darren Maher', position: 'Full-Back', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12g', name: 'Shane Brennan', position: 'Midfielder', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12h', name: 'Cormac Foley', position: 'Defender', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12i', name: 'Alan Phelan', position: 'Goalkeeper', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12j', name: 'Michael O\'Shea', position: 'Winger', ageGroup: 'U15 Boys', status: 'recovery' },
  { id: 'sb12k', name: 'Evan Tierney', position: 'Midfielder', ageGroup: 'U15 Boys', status: 'active' },
  { id: 'sb12l', name: 'Donal Fitzgerald', position: 'Full-Back', ageGroup: 'U15 Boys', status: 'active' },

  // U17 Boys (19 players)
  { id: 'sb13', name: 'Aaron Connolly', position: 'Striker', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb14', name: 'Dylan Watts', position: 'Midfielder', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb15', name: 'Jamie McGrath', position: 'Midfielder', ageGroup: 'U17 Boys', status: 'recovery' },
  { id: 'sb16', name: 'Shane Farrell', position: 'Winger', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb17', name: 'Kevin O\'Connor', position: 'Defender', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18', name: 'Daniel Grant', position: 'Goalkeeper', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18a', name: 'Ronan Hale', position: 'Striker', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18b', name: 'Karl Moore', position: 'Centre-Back', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18c', name: 'Brian Gannon', position: 'Full-Back', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18d', name: 'Darragh Markey', position: 'Winger', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18e', name: 'Cian Coleman', position: 'Midfielder', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18f', name: 'Luke Byrne', position: 'Centre-Back', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18g', name: 'Dean Williams', position: 'Striker', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18h', name: 'JJ Lunney', position: 'Midfielder', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18i', name: 'Alex Murphy', position: 'Full-Back', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18j', name: 'Killian Phillips', position: 'Midfielder', ageGroup: 'U17 Boys', status: 'injured' },
  { id: 'sb18k', name: 'James Clarke', position: 'Goalkeeper', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18l', name: 'Tommy Lonergan', position: 'Winger', ageGroup: 'U17 Boys', status: 'active' },
  { id: 'sb18m', name: 'Cian Kavanagh', position: 'Defender', ageGroup: 'U17 Boys', status: 'active' },

  // U19 Boys (18 players)
  { id: 'sb19', name: 'Liam Burt', position: 'Winger', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb20', name: 'Mark Coyle', position: 'Midfielder', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb21', name: 'Brian McManus', position: 'Striker', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb22', name: 'Ciarán Kilduff', position: 'Centre-Back', ageGroup: 'U19 Boys', status: 'injured' },
  { id: 'sb23', name: 'Gavin Molloy', position: 'Defender', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24', name: 'Brendan Clarke', position: 'Goalkeeper', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24a', name: 'Sean Boyd', position: 'Striker', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24b', name: 'Georgie Kelly', position: 'Striker', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24c', name: 'John Ross Wilson', position: 'Full-Back', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24d', name: 'Dan Carr', position: 'Winger', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24e', name: 'Conor Kane', position: 'Centre-Back', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24f', name: 'Oscar Brennan', position: 'Midfielder', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24g', name: 'Derek Pender', position: 'Full-Back', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24h', name: 'Ryan Brennan', position: 'Midfielder', ageGroup: 'U19 Boys', status: 'recovery' },
  { id: 'sb24i', name: 'Paddy Barrett', position: 'Defender', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24j', name: 'Aiden Friel', position: 'Winger', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24k', name: 'Maxim Kouogun', position: 'Centre-Back', ageGroup: 'U19 Boys', status: 'active' },
  { id: 'sb24l', name: 'Lewis Macari', position: 'Goalkeeper', ageGroup: 'U19 Boys', status: 'active' },

  // U17 Girls (17 players)
  { id: 'sg1', name: 'Aoife Kelly', position: 'Striker', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg2', name: 'Niamh Farrelly', position: 'Midfielder', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg3', name: 'Saoirse Noonan', position: 'Winger', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg4', name: 'Ciara Grant', position: 'Defender', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg5', name: 'Ellen Molloy', position: 'Midfielder', ageGroup: 'U17 Girls', status: 'recovery' },
  { id: 'sg6', name: 'Emma Byrne', position: 'Goalkeeper', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6a', name: 'Abbie Larkin', position: 'Winger', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6b', name: 'Pearl Slattery', position: 'Centre-Back', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6c', name: 'Rachel Graham', position: 'Midfielder', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6d', name: 'Siobhán Killeen', position: 'Striker', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6e', name: 'Jess Gargan', position: 'Full-Back', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6f', name: 'Noelle Murray', position: 'Midfielder', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6g', name: 'Keeva Keenan', position: 'Full-Back', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6h', name: 'Alex Kavanagh', position: 'Winger', ageGroup: 'U17 Girls', status: 'injured' },
  { id: 'sg6i', name: 'Chloe Mustaki', position: 'Defender', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6j', name: 'Shauna Fox', position: 'Centre-Back', ageGroup: 'U17 Girls', status: 'active' },
  { id: 'sg6k', name: 'Alannah McEvoy', position: 'Goalkeeper', ageGroup: 'U17 Girls', status: 'active' },

  // U19 Girls (16 players)
  { id: 'sg7', name: 'Jessica Ziu', position: 'Full-Back', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg8', name: 'Leanne Kiernan', position: 'Striker', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg9', name: 'Megan Campbell', position: 'Defender', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg10', name: 'Ruesha Littlejohn', position: 'Midfielder', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg11', name: 'Katie McCabe', position: 'Winger', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12', name: 'Grace Moloney', position: 'Goalkeeper', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12a', name: 'Louise Quinn', position: 'Centre-Back', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12b', name: 'Denise O\'Sullivan', position: 'Midfielder', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12c', name: 'Áine O\'Gorman', position: 'Defender', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12d', name: 'Heather Payne', position: 'Winger', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12e', name: 'Courtney Brosnan', position: 'Goalkeeper', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12f', name: 'Lucy Quinn', position: 'Striker', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12g', name: 'Izzy Atkinson', position: 'Winger', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12h', name: 'Diane Caldwell', position: 'Centre-Back', ageGroup: 'U19 Girls', status: 'recovery' },
  { id: 'sg12i', name: 'Jamie Finn', position: 'Midfielder', ageGroup: 'U19 Girls', status: 'active' },
  { id: 'sg12j', name: 'Claire Walsh', position: 'Full-Back', ageGroup: 'U19 Girls', status: 'active' },
];

// ── Coaches ──────────────────────────────────────────────
export const shelCoaches: Coach[] = [
  { id: 'sc1', name: 'Damien Duff', role: 'Academy Director', ageGroups: ['U19 Boys', 'U17 Boys'] },
  { id: 'sc2', name: 'Joey O\'Brien', role: 'Lead Coach', ageGroups: ['U19 Boys'] },
  { id: 'sc3', name: 'Alan Quinn', role: 'Lead Coach', ageGroups: ['U17 Boys'] },
  { id: 'sc4', name: 'Paul Doolin', role: 'Lead Coach', ageGroups: ['U15 Boys'] },
  { id: 'sc5', name: 'Johnny McDonnell', role: 'Lead Coach', ageGroups: ['U14 Boys'] },
  { id: 'sc6', name: 'Noel King', role: 'Lead Coach', ageGroups: ['U19 Girls'] },
  { id: 'sc7', name: 'Lisa Fallon', role: 'Lead Coach', ageGroups: ['U17 Girls'] },
  { id: 'sc8', name: 'Dean Delany', role: 'GK Coach', ageGroups: ['U19 Boys', 'U17 Boys', 'U15 Boys', 'U14 Boys'] },
  { id: 'sc9', name: 'Amanda Budden', role: 'GK Coach', ageGroups: ['U19 Girls', 'U17 Girls'] },
  { id: 'sc10', name: 'Collie O\'Neill', role: 'S&C Coach', ageGroups: ['U19 Boys', 'U17 Boys', 'U19 Girls', 'U17 Girls'] },
];

// ── Sessions ─────────────────────────────────────────────
export const shelSessions: Session[] = [
  { id: 'ss1', title: 'Pressing from Midfield', date: '2025-03-10', time: '17:00', ageGroup: 'U17 Boys', focus: 'Tactical', status: 'completed', coach: 'Alan Quinn' },
  { id: 'ss2', title: 'Finishing in Wide Areas', date: '2025-03-11', time: '18:00', ageGroup: 'U19 Boys', focus: 'Technical', status: 'completed', coach: 'Joey O\'Brien' },
  { id: 'ss3', title: 'Build-Up from the Back', date: '2025-03-12', time: '17:30', ageGroup: 'U15 Boys', focus: 'Tactical', status: 'scheduled', coach: 'Paul Doolin' },
  { id: 'ss4', title: 'Speed & Agility', date: '2025-03-13', time: '16:00', ageGroup: 'U17 Girls', focus: 'Physical', status: 'scheduled', coach: 'Lisa Fallon' },
  { id: 'ss5', title: 'Transition to Attack', date: '2025-03-14', time: '17:30', ageGroup: 'U19 Girls', focus: 'Tactical', status: 'scheduled', coach: 'Noel King' },
  { id: 'ss6', title: '1v1 Defending', date: '2025-03-14', time: '16:00', ageGroup: 'U14 Boys', focus: 'Technical', status: 'scheduled', coach: 'Johnny McDonnell' },
];

// ── IDP Goals ────────────────────────────────────────────
export const shelIDPGoals: IDPGoal[] = [
  { id: 'sig1', playerId: 'sb13', category: 'technical', goal: 'Improve first touch under pressure', progress: 60, targetDate: '2025-05-01', status: 'on-track' },
  { id: 'sig2', playerId: 'sb13', category: 'tactical', goal: 'Better movement to receive between lines', progress: 35, targetDate: '2025-04-15', status: 'at-risk' },
  { id: 'sig3', playerId: 'sb14', category: 'physical', goal: 'Increase sprint endurance over 90 minutes', progress: 75, targetDate: '2025-04-30', status: 'on-track' },
  { id: 'sig4', playerId: 'sg2', category: 'psychological', goal: 'Confidence in high-pressure match situations', progress: 50, targetDate: '2025-05-15', status: 'on-track' },
  { id: 'sig5', playerId: 'sg1', category: 'technical', goal: 'Crossing accuracy from wide positions', progress: 100, targetDate: '2025-03-01', status: 'completed' },
  { id: 'sig6', playerId: 'sb7', category: 'technical', goal: 'Improve weak foot passing accuracy', progress: 45, targetDate: '2025-06-01', status: 'on-track' },
  { id: 'sig7', playerId: 'sb19', category: 'tactical', goal: 'Decision-making in the final third', progress: 55, targetDate: '2025-05-01', status: 'on-track' },
  { id: 'sig8', playerId: 'sg8', category: 'physical', goal: 'Increase top speed and acceleration', progress: 70, targetDate: '2025-04-15', status: 'on-track' },
  { id: 'sig9', playerId: 'sb1', category: 'technical', goal: 'Receiving on the half-turn', progress: 30, targetDate: '2025-06-01', status: 'at-risk' },
  { id: 'sig10', playerId: 'sg11', category: 'psychological', goal: 'Communication and on-pitch leadership', progress: 65, targetDate: '2025-04-01', status: 'on-track' },
];

// ── Player Monitoring Data ───────────────────────────────
export interface PlayerMonitoringEntry {
  playerId: string;
  playerName: string;
  ageGroup: string;
  minutesPlayed: number;
  sessionsAttended: number;
  totalSessions: number;
  matchesPlayed: number;
  totalMatches: number;
  trainingLoad: 'low' | 'moderate' | 'high' | 'very-high';
  coachFeedback: string;
  lastCheckin: string;
}

export const shelPlayerMonitoring: PlayerMonitoringEntry[] = [
  { playerId: 'sb13', playerName: 'Aaron Connolly', ageGroup: 'U17 Boys', minutesPlayed: 810, sessionsAttended: 22, totalSessions: 24, matchesPlayed: 10, totalMatches: 12, trainingLoad: 'high', coachFeedback: 'Excellent commitment. First touch improving noticeably.', lastCheckin: '2025-03-10' },
  { playerId: 'sb14', playerName: 'Dylan Watts', ageGroup: 'U17 Boys', minutesPlayed: 720, sessionsAttended: 24, totalSessions: 24, matchesPlayed: 11, totalMatches: 12, trainingLoad: 'high', coachFeedback: 'Consistently available. Engine of the midfield.', lastCheckin: '2025-03-10' },
  { playerId: 'sb15', playerName: 'Jamie McGrath', ageGroup: 'U17 Boys', minutesPlayed: 340, sessionsAttended: 14, totalSessions: 24, matchesPlayed: 5, totalMatches: 12, trainingLoad: 'low', coachFeedback: 'Returning from knee injury. Managing load carefully.', lastCheckin: '2025-03-09' },
  { playerId: 'sb16', playerName: 'Shane Farrell', ageGroup: 'U17 Boys', minutesPlayed: 650, sessionsAttended: 20, totalSessions: 24, matchesPlayed: 9, totalMatches: 12, trainingLoad: 'moderate', coachFeedback: 'Good progress. Needs more game time in central positions.', lastCheckin: '2025-03-10' },
  { playerId: 'sb18', playerName: 'Daniel Grant', ageGroup: 'U17 Boys', minutesPlayed: 1080, sessionsAttended: 23, totalSessions: 24, matchesPlayed: 12, totalMatches: 12, trainingLoad: 'moderate', coachFeedback: 'Reliable. Distribution improving with extra work.', lastCheckin: '2025-03-10' },
  { playerId: 'sg2', playerName: 'Niamh Farrelly', ageGroup: 'U17 Girls', minutesPlayed: 780, sessionsAttended: 21, totalSessions: 22, matchesPlayed: 10, totalMatches: 11, trainingLoad: 'high', coachFeedback: 'Strong leader. Tactical awareness beyond her age.', lastCheckin: '2025-03-10' },
  { playerId: 'sg1', playerName: 'Aoife Kelly', ageGroup: 'U17 Girls', minutesPlayed: 620, sessionsAttended: 19, totalSessions: 22, matchesPlayed: 8, totalMatches: 11, trainingLoad: 'moderate', coachFeedback: 'Pace is a real weapon. Working on composure.', lastCheckin: '2025-03-09' },
  { playerId: 'sb19', playerName: 'Liam Burt', ageGroup: 'U19 Boys', minutesPlayed: 890, sessionsAttended: 23, totalSessions: 24, matchesPlayed: 11, totalMatches: 12, trainingLoad: 'high', coachFeedback: 'Excellent technical level. Ready for first-team consideration.', lastCheckin: '2025-03-10' },
  { playerId: 'sg8', playerName: 'Leanne Kiernan', ageGroup: 'U19 Girls', minutesPlayed: 760, sessionsAttended: 20, totalSessions: 22, matchesPlayed: 10, totalMatches: 11, trainingLoad: 'moderate', coachFeedback: 'Clinical finisher. Working on link-up play.', lastCheckin: '2025-03-10' },
  { playerId: 'sb7', playerName: 'Conor Daly', ageGroup: 'U15 Boys', minutesPlayed: 540, sessionsAttended: 18, totalSessions: 20, matchesPlayed: 8, totalMatches: 10, trainingLoad: 'moderate', coachFeedback: 'Natural finisher. Developing well in structured environment.', lastCheckin: '2025-03-09' },
  { playerId: 'sb1', playerName: 'Cian Murphy', ageGroup: 'U14 Boys', minutesPlayed: 450, sessionsAttended: 16, totalSessions: 18, matchesPlayed: 7, totalMatches: 9, trainingLoad: 'low', coachFeedback: 'Exciting talent. Learning the demands of academy football.', lastCheckin: '2025-03-10' },
  { playerId: 'sg11', playerName: 'Katie McCabe', ageGroup: 'U19 Girls', minutesPlayed: 920, sessionsAttended: 22, totalSessions: 22, matchesPlayed: 11, totalMatches: 11, trainingLoad: 'high', coachFeedback: 'Outstanding. Leads by example in every session.', lastCheckin: '2025-03-10' },
];

// ── Wellness ─────────────────────────────────────────────
export const shelWellnessData: WellnessEntry[] = [
  { date: '2025-03-10', sleep: 8, nutrition: 4, hydration: 5, recovery: 4, mood: 5 },
  { date: '2025-03-09', sleep: 7, nutrition: 3, hydration: 4, recovery: 3, mood: 4 },
  { date: '2025-03-08', sleep: 6, nutrition: 4, hydration: 4, recovery: 3, mood: 3 },
  { date: '2025-03-07', sleep: 8, nutrition: 5, hydration: 5, recovery: 5, mood: 5 },
  { date: '2025-03-06', sleep: 7, nutrition: 4, hydration: 3, recovery: 4, mood: 4 },
  { date: '2025-03-05', sleep: 5, nutrition: 3, hydration: 4, recovery: 2, mood: 3 },
  { date: '2025-03-04', sleep: 8, nutrition: 4, hydration: 5, recovery: 4, mood: 5 },
];

// ── Education Modules ────────────────────────────────────
export const shelEducationModules: EducationModule[] = [
  { id: 'se1', title: 'Anti-Doping Awareness', category: 'Safeguarding', duration: '45 min', completedBy: 89, totalPlayers: 105, mandatory: true },
  { id: 'se2', title: 'Social Media Responsibility', category: 'Professional Standards', duration: '30 min', completedBy: 78, totalPlayers: 105, mandatory: true },
  { id: 'se3', title: 'Match Day Nutrition', category: 'Performance Lifestyle', duration: '25 min', completedBy: 85, totalPlayers: 105, mandatory: false },
  { id: 'se4', title: 'Mental Health & Wellbeing', category: 'Welfare', duration: '40 min', completedBy: 72, totalPlayers: 105, mandatory: true },
  { id: 'se5', title: 'Financial Literacy Basics', category: 'Life Skills', duration: '35 min', completedBy: 55, totalPlayers: 105, mandatory: false },
  { id: 'se6', title: 'Sleep & Recovery', category: 'Performance Lifestyle', duration: '20 min', completedBy: 90, totalPlayers: 105, mandatory: false },
  { id: 'se7', title: 'Player Welfare & Safeguarding', category: 'Safeguarding', duration: '50 min', completedBy: 95, totalPlayers: 105, mandatory: true },
  { id: 'se8', title: 'Transition & Aftercare Awareness', category: 'Life Skills', duration: '30 min', completedBy: 38, totalPlayers: 105, mandatory: false },
];

// ── Video Clips ──────────────────────────────────────────
export const shelVideoClips: VideoClip[] = [
  { id: 'sv1', title: 'Counter-Attack Opportunity', match: 'vs Bohemian FC U17', date: '2025-03-08', duration: '0:52', type: 'match', feedback: 'Excellent pace on the break — final ball needed more weight' },
  { id: 'sv2', title: 'Defensive Shape Analysis', match: 'vs Shamrock Rovers U17', date: '2025-03-05', duration: '2:15', type: 'match' },
  { id: 'sv3', title: 'Pressing Drill Execution', match: 'Training', date: '2025-03-10', duration: '1:30', type: 'training' },
  { id: 'sv4', title: 'Individual Finishing Session', match: 'Individual', date: '2025-03-09', duration: '3:10', type: 'individual', feedback: 'Staying composed — keep your head over the ball on contact' },
];

// ── Upskilling & Aftercare Data ──────────────────────────
export interface UpskillingPartner {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface UpskillingCourse {
  id: string;
  title: string;
  category: string;
  provider: string;
  level: string;
  duration: string;
  description: string;
  available: boolean;
}

export const shelUpskillingPartners: UpskillingPartner[] = [
  { id: 'up1', name: 'Barça Innovation Hub', type: 'Performance & Innovation', description: 'Access to world-leading research and methodology in player development, sports science, and performance analysis.' },
  { id: 'up2', name: 'Football Association of Ireland (FAI)', type: 'Coaching & Education', description: 'Nationally recognised coaching qualifications and player development frameworks aligned with Irish football.' },
  { id: 'up3', name: 'Technological University Dublin (TU Dublin)', type: 'Academic & Research', description: 'Pathways into sports science, strength & conditioning, and sports management degree programmes.' },
  { id: 'up4', name: 'Sport Ireland', type: 'National Sport Development', description: 'Resources for athlete welfare, anti-doping education, and governance standards in Irish sport.' },
];

export const shelUpskillingCourses: UpskillingCourse[] = [
  { id: 'uc1', title: 'FAI Kick Start 1 — Introduction to Coaching', category: 'Coaching', provider: 'FAI', level: 'Beginner', duration: '16 hours', description: 'Foundation coaching certificate for aspiring coaches. Covers session planning, communication, and child-centred coaching.', available: true },
  { id: 'uc2', title: 'FAI Kick Start 2 — Youth Coaching', category: 'Coaching', provider: 'FAI', level: 'Intermediate', duration: '24 hours', description: 'Builds on Kick Start 1 with age-appropriate methodology, small-sided games, and player development principles.', available: true },
  { id: 'uc3', title: 'UEFA B Licence — Youth Development Pathway', category: 'Coaching', provider: 'FAI / UEFA', level: 'Advanced', duration: '120 hours', description: 'Professional coaching qualification focused on youth development. Covers tactical periodisation, session design, and game model development.', available: false },
  { id: 'uc4', title: 'Introduction to Sports Science', category: 'Sports Science', provider: 'TU Dublin', level: 'Beginner', duration: '8 weeks', description: 'Fundamentals of physiology, biomechanics, and sports psychology. Ideal for players considering a career in sports science.', available: true },
  { id: 'uc5', title: 'Performance Analysis Fundamentals', category: 'Analysis & Data', provider: 'Barça Innovation Hub', level: 'Beginner', duration: '6 weeks', description: 'Introduction to match analysis, video tagging, and data interpretation in football.', available: true },
  { id: 'uc6', title: 'Advanced Performance Analysis', category: 'Analysis & Data', provider: 'Barça Innovation Hub', level: 'Intermediate', duration: '10 weeks', description: 'In-depth analysis methodology including event data, tracking data, and tactical analysis models.', available: true },
  { id: 'uc7', title: 'Strength & Conditioning for Football', category: 'Sports Science', provider: 'TU Dublin', level: 'Intermediate', duration: '12 weeks', description: 'Applied S&C principles for football including periodisation, injury prevention, and return-to-play protocols.', available: true },
  { id: 'uc8', title: 'Sports Psychology — Building Mental Resilience', category: 'Education & Development', provider: 'Sport Ireland', level: 'Beginner', duration: '4 weeks', description: 'Understanding mental health, resilience, and performance mindset. Practical tools for young athletes and coaches.', available: true },
  { id: 'uc9', title: 'Financial Planning for Young Athletes', category: 'Education & Development', provider: 'Sport Ireland', level: 'Beginner', duration: '3 hours', description: 'Practical guidance on budgeting, financial planning, and understanding contracts in professional sport.', available: true },
  { id: 'uc10', title: 'Media & Communication Skills', category: 'Education & Development', provider: 'FAI', level: 'Beginner', duration: '4 hours', description: 'How to conduct interviews, manage social media, and represent yourself and your club professionally.', available: true },
  { id: 'uc11', title: 'Nutrition for Performance', category: 'Sports Science', provider: 'TU Dublin', level: 'Beginner', duration: '6 weeks', description: 'Evidence-based nutrition guidance for training, match day, and recovery. Tailored for underage athletes.', available: true },
  { id: 'uc12', title: 'Career Planning & Transition Support', category: 'Education & Development', provider: 'Sport Ireland', level: 'All Levels', duration: '2 hours', description: 'Supporting players through career transitions — whether moving into professional football, education, or alternative pathways.', available: true },
];

// ── Org Stats ────────────────────────────────────────────
export const shelOrgStats = {
  totalPlayers: shelPlayers.length,
  activeCoaches: 10,
  sessionsThisWeek: 18,
  avgWellnessScore: 4.0,
  educationCompletion: 74,
  idpCompletionRate: 81,
  upcomingFixtures: 6,
};

export const shelCoachStats = {
  squadSize: 19,
  sessionsThisWeek: 4,
  idpsToReview: 3,
  playersAtRisk: 2,
  avgSquadWellness: 4.0,
};

export const shelPlayerStats = {
  nextSession: 'Speed & Agility',
  nextSessionDate: '2025-03-13',
  goalsInProgress: 4,
  goalsCompleted: 1,
  educationModules: 3,
  wellnessStreak: 5,
};

// ── Shelbourne IDP data (for detail views) ───────────────
export const shelMarcusIDP: IDPFull = {
  id: 'sidp1',
  playerId: 'sb13',
  playerName: 'Aaron Connolly',
  position: 'Striker',
  ageGroup: 'U17 Boys',
  mode: 'elite',
  createdDate: '2025-01-15',
  lastReviewDate: '2025-03-01',
  nextReviewDate: '2025-04-01',
  status: 'active',
  overallProgress: 58,
  goals: [
    {
      id: 'sg1',
      category: 'technical',
      title: 'Improve First Touch Under Pressure',
      description: 'Develop a reliable first touch when receiving with back to goal or under close marking. Aim for consistent quality across training and match scenarios.',
      targetDate: '2025-05-01',
      progress: 60,
      status: 'on-track',
      actions: [
        'Focused receiving drills — 15 mins after training (3x week)',
        'Video analysis of first touch in recent matches',
        'Practice receiving on back foot with both feet',
      ],
      evidence: [
        'Coach noted improved composure vs Bohemian FC U17',
        'Retained possession in final third more consistently',
      ],
      coachRating: 3,
      playerRating: 3,
    },
    {
      id: 'sg2',
      category: 'tactical',
      title: 'Movement Between Lines',
      description: 'Improve timing and angles of movement to receive between the opposition midfield and defensive lines.',
      targetDate: '2025-04-15',
      progress: 35,
      status: 'at-risk',
      actions: [
        'Study video of movement patterns from LOI first-team strikers',
        'Work with lead coach on positional triggers',
        'Practice checking runs in positional games',
      ],
      evidence: [
        'Identified two key movement patterns from video session',
      ],
      coachRating: 2,
      playerRating: 3,
    },
    {
      id: 'sg3',
      category: 'physical',
      title: 'Upper Body Strength',
      description: 'Develop the strength to hold off defenders and compete in aerial duels at a higher intensity.',
      targetDate: '2025-05-15',
      progress: 65,
      status: 'on-track',
      actions: [
        'Additional gym sessions focused on upper body',
        'Bench press, rows, and shoulder press programme',
        'Nutrition plan to support muscle development',
      ],
      evidence: [
        'Bench press increased from 50kg to 60kg',
        'Won more aerial duels in last 3 matches',
      ],
      coachRating: 4,
      playerRating: 4,
    },
    {
      id: 'sg4',
      category: 'psychological',
      title: 'Composure in Front of Goal',
      description: 'Maintain positive body language and clarity of thought after missed chances. Use mental reset techniques during matches.',
      targetDate: '2025-04-01',
      progress: 50,
      status: 'in-progress',
      actions: [
        'Work with player welfare officer on mental reset techniques',
        'Practice positive self-talk',
        'Review video of decision-making in front of goal',
      ],
      evidence: [
        'Scored after earlier missed chance vs Shamrock Rovers',
      ],
      coachRating: 3,
      playerRating: 3,
    },
    {
      id: 'sg5',
      category: 'lifestyle',
      title: 'Sleep Routine Consistency',
      description: 'Establish a consistent sleep pattern to support recovery. Aim for 8+ hours on training and match nights.',
      targetDate: '2025-03-15',
      progress: 80,
      status: 'on-track',
      actions: [
        'No screens 1 hour before bed',
        'Same bedtime routine each night',
        'Track sleep in monitoring app',
      ],
      evidence: [
        'Average sleep increased from 6.5 to 7.5 hours',
        'Reported better energy levels at training',
      ],
      coachRating: 4,
      playerRating: 5,
    },
  ],
  coachComments: [
    {
      id: 'scc1',
      author: 'Alan Quinn',
      role: 'coach',
      date: '2025-03-01',
      content: "Good effort this block, Aaron. Your first touch is coming along — the Bohs game showed real improvement. Movement between lines needs more focus. I've arranged extra sessions with the technical coach to work on this.",
    },
    {
      id: 'scc2',
      author: 'Alan Quinn',
      role: 'coach',
      date: '2025-02-01',
      content: 'Solid start to the new year. Physical gains are clear. Tactical understanding needs more in-match application. Composure is improving — the Rovers goal showed real character.',
    },
    {
      id: 'scc3',
      author: 'Damien Duff',
      role: 'head-of-academy',
      date: '2025-01-20',
      content: 'Aaron is showing great commitment to his development plan. The balance across technical, physical, and lifestyle areas is exactly what we want. Keep pushing.',
    },
  ],
  playerReflections: [
    {
      id: 'spr1',
      date: '2025-03-07',
      weekNumber: 10,
      whatWentWell: 'First touch felt much better in training. Held the ball up well against Bohs and created a chance for Shane.',
      whatToImprove: 'Need to time my runs better between the lines — getting caught offside too often.',
      focusForNextWeek: 'Movement patterns — going to study clips from the first team.',
      mood: 4,
    },
    {
      id: 'spr2',
      date: '2025-02-28',
      weekNumber: 9,
      whatWentWell: 'Sleep routine is consistent now. Feeling sharper at training. Gym numbers improving.',
      whatToImprove: 'Missed two chances on Saturday — need to stay calm and pick my spot.',
      focusForNextWeek: 'Composure finishing — extra shooting after training.',
      mood: 3,
    },
  ],
  holisticEvaluation: {
    technical: 6, tactical: 5, physical: 7, psychological: 6, lifestyle: 8,
    notes: 'Aaron shows strong physical development and commitment to lifestyle habits. Tactical awareness — particularly between-the-lines movement — remains the key area for improvement.',
    date: '2025-03-01',
  },
  positionalProfile: {
    primaryPosition: 'Striker',
    secondaryPosition: 'Inside Forward',
    demands: [
      'Hold-up play and link with midfield runners',
      'Movement to lose centre-backs — check-in / spin-out patterns',
      'Finishing composure under pressure from both feet',
      'Aerial presence and competing for second balls',
    ],
  },
  performanceSupport: {
    physicalFocus: 'Upper body strength and explosive power for hold-up play. Plyometric work for movement sharpness.',
    nutritionHabits: 'Consistent meal timing. Needs to increase protein intake on training days. Post-training fuelling is improving.',
    recoveryHabits: 'Sleep routine now consistent (8+ hours). Uses foam rolling post-session. Could improve hydration on rest days.',
    psychologicalStrengthening: 'Working on composure after missed chances. Positive self-talk techniques. Building confidence in high-pressure situations.',
  },
  offFieldDevelopment: {
    leadership: 'Growing into a vocal leader in the dressing room. Captained U17s in two recent matches.',
    communication: 'Becoming more comfortable speaking in group settings. Positive influence on younger players.',
    education: 'On track with Leaving Certificate. Balancing school and academy demands well.',
    lifeSkills: 'Engaged with the financial literacy module. Showing maturity in time management.',
  },
  reviewHistory: [
    { id: 'rh1', date: '2025-03-01', type: 'monthly', summary: 'Strong month for physical development. Tactical movement still the primary focus going forward.', objectivesEdited: ['sg2'], archivedGoals: [] },
    { id: 'rh2', date: '2025-02-01', type: 'monthly', summary: 'Sleep routine established. Upper body strength progressing. Movement work starting to show in training.', objectivesEdited: [], archivedGoals: [] },
  ],
  methodologyTags: ['mp-1', 'mp-3', 'mp-11', 'dp-tech', 'dp-tact', 'val-1'],
};

export const shelIDPSummaries: IDPSummary[] = [
  { id: 'sidp1', playerName: 'Aaron Connolly', position: 'Striker', ageGroup: 'U17 Boys', overallProgress: 58, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 1, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp2', playerName: 'Dylan Watts', position: 'Midfielder', ageGroup: 'U17 Boys', overallProgress: 68, status: 'active', nextReviewDate: '2025-04-05', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp3', playerName: 'Jamie McGrath', position: 'Midfielder', ageGroup: 'U17 Boys', overallProgress: 42, status: 'review-due', nextReviewDate: '2025-03-10', goalsAtRisk: 2, goalsOnTrack: 1, mode: 'basic' },
  { id: 'sidp4', playerName: 'Daniel Grant', position: 'Goalkeeper', ageGroup: 'U17 Boys', overallProgress: 75, status: 'active', nextReviewDate: '2025-04-15', goalsAtRisk: 0, goalsOnTrack: 4, mode: 'elite' },
  { id: 'sidp5', playerName: 'Niamh Farrelly', position: 'Midfielder', ageGroup: 'U17 Girls', overallProgress: 52, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 1, goalsOnTrack: 2, mode: 'elite' },
  { id: 'sidp6', playerName: 'Liam Burt', position: 'Winger', ageGroup: 'U19 Boys', overallProgress: 70, status: 'active', nextReviewDate: '2025-04-10', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp7', playerName: 'Shane Farrell', position: 'Winger', ageGroup: 'U17 Boys', overallProgress: 61, status: 'active', nextReviewDate: '2025-04-05', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'basic' },
  { id: 'sidp8', playerName: 'Ronan Hale', position: 'Striker', ageGroup: 'U17 Boys', overallProgress: 45, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 1, goalsOnTrack: 2, mode: 'basic' },
  { id: 'sidp9', playerName: 'Brian Gannon', position: 'Full-Back', ageGroup: 'U17 Boys', overallProgress: 55, status: 'active', nextReviewDate: '2025-04-10', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'basic' },
  { id: 'sidp10', playerName: 'Conor Daly', position: 'Striker', ageGroup: 'U15 Boys', overallProgress: 48, status: 'active', nextReviewDate: '2025-04-15', goalsAtRisk: 1, goalsOnTrack: 2, mode: 'basic' },
  { id: 'sidp11', playerName: 'Aoife Kelly', position: 'Striker', ageGroup: 'U17 Girls', overallProgress: 63, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp12', playerName: 'Katie McCabe', position: 'Winger', ageGroup: 'U19 Girls', overallProgress: 72, status: 'active', nextReviewDate: '2025-04-05', goalsAtRisk: 0, goalsOnTrack: 4, mode: 'elite' },
  { id: 'sidp13', playerName: 'Leanne Kiernan', position: 'Striker', ageGroup: 'U19 Girls', overallProgress: 66, status: 'active', nextReviewDate: '2025-04-10', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp14', playerName: 'Cian Murphy', position: 'Striker', ageGroup: 'U14 Boys', overallProgress: 35, status: 'active', nextReviewDate: '2025-04-15', goalsAtRisk: 1, goalsOnTrack: 1, mode: 'basic' },
  { id: 'sidp15', playerName: 'Mark Coyle', position: 'Midfielder', ageGroup: 'U19 Boys', overallProgress: 60, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp16', playerName: 'Gavin Molloy', position: 'Defender', ageGroup: 'U19 Boys', overallProgress: 58, status: 'active', nextReviewDate: '2025-04-10', goalsAtRisk: 1, goalsOnTrack: 2, mode: 'basic' },
  { id: 'sidp17', playerName: 'Saoirse Noonan', position: 'Winger', ageGroup: 'U17 Girls', overallProgress: 55, status: 'active', nextReviewDate: '2025-04-05', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'basic' },
  { id: 'sidp18', playerName: 'Jessica Ziu', position: 'Full-Back', ageGroup: 'U19 Girls', overallProgress: 68, status: 'active', nextReviewDate: '2025-04-01', goalsAtRisk: 0, goalsOnTrack: 3, mode: 'elite' },
  { id: 'sidp19', playerName: 'Karl Moore', position: 'Centre-Back', ageGroup: 'U17 Boys', overallProgress: 50, status: 'review-due', nextReviewDate: '2025-03-12', goalsAtRisk: 1, goalsOnTrack: 2, mode: 'basic' },
];
