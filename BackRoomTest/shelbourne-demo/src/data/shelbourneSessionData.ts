// Shelbourne FC Academy — Session Planning & Periodisation Data
// Demo prototype — illustrative content only.

import { methodologyTags } from '@pages/demo/shelbourne/shared/MethodologyHub';

// ── Types ────────────────────────────────────────────────

export type PlanType = 'single' | 'weekly' | 'block' | 'season';
export type CompetitionPhase = 'pre-season' | 'early-season' | 'mid-season' | 'run-in';
export type Intensity = 'low' | 'medium' | 'high';
export type MatchDay = 'MD-4' | 'MD-3' | 'MD-2' | 'MD-1' | 'MD' | 'MD+1' | 'MD+2';
export type PlanStatus = 'draft' | 'active' | 'archived';
export type DayType = 'football' | 'gym' | 'recovery' | 'match' | 'rest';

export interface SessionPhaseDetail {
  name: string;
  duration: string;
  description: string;
  coachingPoints: string[];
  equipment: string[];
}

export interface SingleSessionData {
  objective: string;
  duration: string;
  tacticalTheme: string;
  methodologyPrinciple: string; // tag id from methodology hub
  subPrinciples: string[];
  intensity: Intensity;
  physicalObjective: string;
  matchProximity: MatchDay;
  technicalFocus: string[];
  psychFocus: string[]; // decision-making, communication, leadership, resilience
  linkedIDPObjectives: string[]; // IDP goal ids
  phases: {
    activation: SessionPhaseDetail;
    technical: SessionPhaseDetail;
    tactical: SessionPhaseDetail;
    conditionedGame: SessionPhaseDetail;
    reflection: SessionPhaseDetail;
  };
  notes: string;
}

export interface WeeklyDayEntry {
  day: string;
  type: DayType;
  title: string;
  focus: string;
  intensity: Intensity;
  tacticalTheme: string;
  methodologyPrinciple: string;
  linkedIDPObjectives: string[];
  matchProximity: MatchDay | '';
}

export interface WeeklyPlanData {
  theme: string;
  objectives: string[];
  days: WeeklyDayEntry[];
}

export interface BlockWeek {
  weekNumber: number;
  theme: string;
  objectives: string[];
  days: WeeklyDayEntry[];
}

export interface BlockPlanData {
  blockTitle: string;
  weeks: BlockWeek[];
}

export interface SeasonPhaseData {
  name: string;
  weeks: number;
  focus: string[];
  objectives: string[];
  competitionPhase: CompetitionPhase;
}

export interface SeasonPlanData {
  phases: SeasonPhaseData[];
}

export interface ShelPlan {
  id: string;
  type: PlanType;
  title: string;
  ageGroup: string;
  coach: string;
  competitionPhase: CompetitionPhase;
  dateStart: string;
  dateEnd: string;
  status: PlanStatus;
  createdDate: string;
  // Data based on type
  session?: SingleSessionData;
  weeklyPlan?: WeeklyPlanData;
  blockPlan?: BlockPlanData;
  seasonPlan?: SeasonPlanData;
}

// ── Helper blank day row ───────────────────────────────
export const blankDay = (day: string): WeeklyDayEntry => ({
  day, type: 'rest', title: '', focus: '', intensity: 'low',
  tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '',
});

export const defaultWeekDays = (): WeeklyDayEntry[] => [
  { ...blankDay('Monday'), type: 'recovery', title: 'Recovery', matchProximity: 'MD+1' },
  { ...blankDay('Tuesday'), type: 'football', title: 'Training', matchProximity: 'MD-4' },
  { ...blankDay('Wednesday'), type: 'gym', title: 'Gym & S&C', matchProximity: 'MD-3' },
  { ...blankDay('Thursday'), type: 'football', title: 'Training', matchProximity: 'MD-2' },
  { ...blankDay('Friday'), type: 'football', title: 'Match Prep', matchProximity: 'MD-1' },
  { ...blankDay('Saturday'), type: 'match', title: 'Match Day', matchProximity: 'MD' },
  { ...blankDay('Sunday'), type: 'rest', title: 'Rest Day', matchProximity: '' },
];

export const blankSessionPhase = (name: string): SessionPhaseDetail => ({
  name, duration: '', description: '', coachingPoints: [''], equipment: [''],
});

// Keep methodologyTags re-exported for convenience (used by other modules)
export { methodologyTags };

// ── Pre-filled Example U14 Weekly Plan ─────────────────
export const exampleU14Weekly: ShelPlan = {
  id: 'sp-u14-w1',
  type: 'weekly',
  title: 'U14 Week 6 — Technical Foundation',
  ageGroup: 'U14',
  coach: 'Johnny McDonnell',
  competitionPhase: 'mid-season',
  dateStart: '2025-02-10',
  dateEnd: '2025-02-16',
  status: 'active',
  createdDate: '2025-02-05',
  weeklyPlan: {
    theme: 'Receiving & Playing Forward',
    objectives: [
      'Improve receiving on the half-turn under pressure',
      'Develop passing accuracy over 10-20 yard range',
      'Maintain high energy and enjoyment throughout',
    ],
    days: [
      { day: 'Monday', type: 'recovery', title: 'Active Recovery', focus: 'Light movement and stretching', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: ['u14-g1'], matchProximity: 'MD+1' },
      { day: 'Tuesday', type: 'football', title: 'Receiving on the Half-Turn', focus: 'Technical — receiving and turning with both feet', intensity: 'medium', tacticalTheme: 'Play Out From the Back', methodologyPrinciple: 'mp-1', linkedIDPObjectives: ['u14-g1'], matchProximity: 'MD-4' },
      { day: 'Wednesday', type: 'gym', title: 'Coordination & Agility', focus: 'Movement literacy and balance drills', intensity: 'medium', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: ['u14-g2'], matchProximity: 'MD-3' },
      { day: 'Thursday', type: 'football', title: 'Passing & Possession', focus: 'Passing accuracy in rondos and positional games', intensity: 'high', tacticalTheme: 'Positional Superiority', methodologyPrinciple: 'mp-2', linkedIDPObjectives: ['u14-g1'], matchProximity: 'MD-2' },
      { day: 'Friday', type: 'football', title: 'Match Preparation', focus: 'Small-sided game applying weekly theme', intensity: 'medium', tacticalTheme: 'Play Out From the Back', methodologyPrinciple: 'mp-1', linkedIDPObjectives: [], matchProximity: 'MD-1' },
      { day: 'Saturday', type: 'match', title: 'League Match vs Bohemians', focus: '', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD' },
      { day: 'Sunday', type: 'rest', title: 'Rest Day', focus: '', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '' },
    ],
  },
};

// ── Pre-filled Example U17 Multi-Week Block ────────────
const u17BlockWeeks: BlockWeek[] = [
  {
    weekNumber: 1, theme: 'Pressing Triggers & Recovery Runs',
    objectives: ['Identify pressing triggers from match analysis', 'Coordinate front-line pressing as a unit'],
    days: [
      { day: 'Monday', type: 'recovery', title: 'Recovery', focus: 'Pool & foam rolling', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD+1' },
      { day: 'Tuesday', type: 'football', title: 'Pressing Triggers', focus: 'Shadow pressing and trigger recognition', intensity: 'high', tacticalTheme: 'Press from the Front', methodologyPrinciple: 'mp-6', linkedIDPObjectives: [], matchProximity: 'MD-4' },
      { day: 'Wednesday', type: 'gym', title: 'Lower Body Power', focus: 'Plyometrics and squats', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-3' },
      { day: 'Thursday', type: 'football', title: '6v4 Pressing Game', focus: 'Pressing in game context with transition', intensity: 'high', tacticalTheme: 'Immediate Counter-Press', methodologyPrinciple: 'mp-9', linkedIDPObjectives: [], matchProximity: 'MD-2' },
      { day: 'Friday', type: 'football', title: 'Match Prep', focus: 'Set pieces and tactical review', intensity: 'medium', tacticalTheme: 'Set Piece Organisation', methodologyPrinciple: 'mp-13', linkedIDPObjectives: [], matchProximity: 'MD-1' },
      { day: 'Saturday', type: 'match', title: 'League Match', focus: '', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD' },
      { day: 'Sunday', type: 'rest', title: 'Rest', focus: '', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '' },
    ],
  },
  {
    weekNumber: 2, theme: 'Compact Shape & Defensive Organisation',
    objectives: ['Maintain compact shape (35m between lines)', 'Coordinate back-line shifting as a unit'],
    days: [
      { day: 'Monday', type: 'recovery', title: 'Recovery', focus: 'Active recovery', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD+1' },
      { day: 'Tuesday', type: 'football', title: 'Defensive Shape', focus: 'Back four shifting and covering', intensity: 'medium', tacticalTheme: 'Compact Defensive Shape', methodologyPrinciple: 'mp-7', linkedIDPObjectives: [], matchProximity: 'MD-4' },
      { day: 'Wednesday', type: 'gym', title: 'Upper Body & Core', focus: 'Strength maintenance', intensity: 'medium', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-3' },
      { day: 'Thursday', type: 'football', title: 'Defending as a Team', focus: '11v11 defensive organisation', intensity: 'high', tacticalTheme: 'Cut Passing Lanes', methodologyPrinciple: 'mp-8', linkedIDPObjectives: [], matchProximity: 'MD-2' },
      { day: 'Friday', type: 'football', title: 'Match Prep', focus: 'Opposition preview and set pieces', intensity: 'medium', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-1' },
      { day: 'Saturday', type: 'match', title: 'League Match', focus: '', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD' },
      { day: 'Sunday', type: 'rest', title: 'Rest', focus: '', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '' },
    ],
  },
  {
    weekNumber: 3, theme: 'Transition Speed — Attack to Defence',
    objectives: ['React within 5 seconds of losing possession', 'Coordinate counter-press from nearest 3 players'],
    days: [
      { day: 'Monday', type: 'recovery', title: 'Recovery', focus: 'Pool session', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD+1' },
      { day: 'Tuesday', type: 'football', title: 'Counter-Press Drills', focus: 'Immediate reaction on ball loss', intensity: 'high', tacticalTheme: 'Immediate Counter-Press', methodologyPrinciple: 'mp-9', linkedIDPObjectives: [], matchProximity: 'MD-4' },
      { day: 'Wednesday', type: 'gym', title: 'Speed & Power', focus: 'Sprint intervals and plyometrics', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-3' },
      { day: 'Thursday', type: 'football', title: 'Recovery Runs & Shape', focus: 'Getting behind the ball quickly', intensity: 'medium', tacticalTheme: 'Recover Behind the Ball', methodologyPrinciple: 'mp-10', linkedIDPObjectives: [], matchProximity: 'MD-2' },
      { day: 'Friday', type: 'football', title: 'Match Prep', focus: 'Tactical review and set pieces', intensity: 'medium', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-1' },
      { day: 'Saturday', type: 'match', title: 'League Match', focus: '', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD' },
      { day: 'Sunday', type: 'rest', title: 'Rest', focus: '', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '' },
    ],
  },
  {
    weekNumber: 4, theme: 'Building from the Back',
    objectives: ['GK and CB build-up patterns', 'Midfield receiving positions under pressure'],
    days: [
      { day: 'Monday', type: 'recovery', title: 'Recovery', focus: 'Stretching and mobility', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD+1' },
      { day: 'Tuesday', type: 'football', title: 'Build-Up Patterns', focus: 'Playing out from the back 6v4', intensity: 'medium', tacticalTheme: 'Play Out From the Back', methodologyPrinciple: 'mp-1', linkedIDPObjectives: [], matchProximity: 'MD-4' },
      { day: 'Wednesday', type: 'gym', title: 'Full Body Strength', focus: 'Compound lifts', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-3' },
      { day: 'Thursday', type: 'football', title: 'Positional Game', focus: 'Positional superiority in midfield', intensity: 'high', tacticalTheme: 'Positional Superiority', methodologyPrinciple: 'mp-2', linkedIDPObjectives: [], matchProximity: 'MD-2' },
      { day: 'Friday', type: 'football', title: 'Match Prep', focus: 'Patterns and set pieces', intensity: 'medium', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD-1' },
      { day: 'Saturday', type: 'match', title: 'League Match', focus: '', intensity: 'high', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: 'MD' },
      { day: 'Sunday', type: 'rest', title: 'Rest', focus: '', intensity: 'low', tacticalTheme: '', methodologyPrinciple: '', linkedIDPObjectives: [], matchProximity: '' },
    ],
  },
];

export const exampleU17Block: ShelPlan = {
  id: 'sp-u17-b1',
  type: 'block',
  title: 'U17 Block 2 — Out of Possession & Transition',
  ageGroup: 'U17',
  coach: 'Paul Doolin',
  competitionPhase: 'mid-season',
  dateStart: '2025-02-03',
  dateEnd: '2025-03-02',
  status: 'active',
  createdDate: '2025-01-28',
  blockPlan: {
    blockTitle: 'Out of Possession & Transition Focus',
    weeks: u17BlockWeeks,
  },
};

// ── Pre-filled Example U17 Single Session ──────────────
export const exampleU17Session: ShelPlan = {
  id: 'sp-u17-s1',
  type: 'single',
  title: 'U17 — Pressing from Midfield',
  ageGroup: 'U17',
  coach: 'Paul Doolin',
  competitionPhase: 'mid-season',
  dateStart: '2025-02-11',
  dateEnd: '2025-02-11',
  status: 'active',
  createdDate: '2025-02-08',
  session: {
    objective: 'Develop coordinated midfield pressing with clear triggers and transition to attack on turnover',
    duration: '90 min',
    tacticalTheme: 'Press from the Front',
    methodologyPrinciple: 'mp-6',
    subPrinciples: ['Cover shadows', 'Pressing triggers on poor touch or backwards pass', 'Sprint to press, jog to recover'],
    intensity: 'high',
    physicalObjective: 'High-intensity repeated sprints — pressing and recovery',
    matchProximity: 'MD-2',
    technicalFocus: ['Interceptions', 'First touch after winning ball', 'Forward passing under pressure'],
    psychFocus: ['decision-making', 'communication'],
    linkedIDPObjectives: [],
    phases: {
      activation: {
        name: 'Dynamic Warm-Up & Pressing Movement',
        duration: '12 min',
        description: 'Progressive running patterns with ball work. Hip mobility, hamstring activation, short accelerations. Introduce pressing angles without opposition.',
        coachingPoints: ['Quality of movement first', 'Body shape — show them one way', 'Activate glutes before pressing work'],
        equipment: ['Cones', 'Footballs', 'Mini hurdles'],
      },
      technical: {
        name: 'Pressing Angles & First Touch',
        duration: '15 min',
        description: 'In groups of 4, practice pressing angle approach — curve run to show inside. On winning the ball, first touch must be forward. Rotate roles every 90 seconds.',
        coachingPoints: ['Curve your run — don\'t go straight', 'First touch forward after interception', 'Communicate Go! and Cover!'],
        equipment: ['Cones', 'Footballs'],
      },
      tactical: {
        name: '6v4 Pressing Game',
        duration: '25 min',
        description: 'Blues (6) build from back. Reds (4) press as a coordinated unit. If Reds win ball, they attack two mini goals. Score double within 5 seconds of turnover.',
        coachingPoints: ['Recognise pressing triggers bad touch, backwards pass, head down', 'Sprint to press, jog to recover', 'Win the ball HIGH on the pitch'],
        equipment: ['Cones', 'Footballs', 'Mini goals', 'Bibs'],
      },
      conditionedGame: {
        name: '8v8 Directional Game',
        duration: '25 min',
        description: 'Three zones. Team scores by winning ball in attacking third and scoring within 8 seconds. Full pressing principles applied in game context.',
        coachingPoints: ['Apply triggers from practice', 'Immediate transition mindset', 'Quality of final action after winning the ball'],
        equipment: ['Cones', 'Footballs', 'Goals', 'Bibs'],
      },
      reflection: {
        name: 'Cool Down & Review',
        duration: '13 min',
        description: 'Light jogging and static stretching. Group discussion: What pressing triggers worked? How can we improve coordination? Individual feedback from position coaches.',
        coachingPoints: ['Reflect on key moments', 'Set individual targets for match day'],
        equipment: ['Yoga mats'],
      },
    },
    notes: 'Session designed from match analysis vs Drogheda — opponent struggled when pressed in their own half. Focus on front 3 coordination.',
  },
};

// ── Pre-filled Example U19 Season Plan ─────────────────
export const exampleU19Season: ShelPlan = {
  id: 'sp-u19-season',
  type: 'season',
  title: 'U19 — 2025 Season Plan',
  ageGroup: 'U19',
  coach: 'Joey O\'Brien',
  competitionPhase: 'pre-season',
  dateStart: '2025-01-15',
  dateEnd: '2025-11-30',
  status: 'active',
  createdDate: '2025-01-10',
  seasonPlan: {
    phases: [
      { name: 'Pre-Season', weeks: 5, competitionPhase: 'pre-season', focus: ['Fitness base', 'Team cohesion', 'Game model introduction'], objectives: ['Establish physical foundation', 'Build team understanding of playing philosophy', 'Individual baseline assessments and IDP setting'] },
      { name: 'Early Season — League Phase 1', weeks: 10, competitionPhase: 'early-season', focus: ['In-possession principles', 'Building from the back', 'Pressing fundamentals'], objectives: ['Implement game model in competitive matches', 'Develop positional play understanding', 'Progress individual IDP objectives'] },
      { name: 'Mid-Season — League Phase 2', weeks: 12, competitionPhase: 'mid-season', focus: ['Tactical refinement', 'Out of possession', 'Transition speed'], objectives: ['Refine pressing and transition principles', 'Prepare players for first-team exposure', 'Mid-season IDP reviews and adjustments'] },
      { name: 'Run-In Phase', weeks: 8, competitionPhase: 'run-in', focus: ['Peak performance', 'Game management', 'Cup preparation'], objectives: ['Compete for league and cup titles', 'Game management under pressure', 'Final IDP reviews and season evaluation'] },
      { name: 'End of Season', weeks: 3, competitionPhase: 'run-in', focus: ['Season review', 'Transition planning', 'Rest'], objectives: ['Comprehensive season reviews for all players', 'Set summer development programmes', 'Plan for next season transitions'] },
    ],
  },
};

// ── Initial plans list ──────────────────────────────────
export const initialShelPlans: ShelPlan[] = [
  exampleU14Weekly,
  exampleU17Block,
  exampleU17Session,
  exampleU19Season,
];
