// ── Enums ─────────────────────────────────────────────────────────────────────

export type PlanType = 'single-session' | 'weekly-plan' | 'multi-week-block' | 'season-plan';
export type PlanStatus = 'active' | 'draft' | 'archived';
export type CompetitionPhase = 'pre-season' | 'in-season' | 'post-season' | 'off-season';
export type PlanVisibility = 'private' | 'squad' | 'club';

// ── Single Session ─────────────────────────────────────────────────────────────

export interface SessionPhase {
  name: string;
  duration: number;
  description: string;
  coachingPoints: string[];
  equipment: string[];
}

export interface SingleSessionData {
  date: string;
  theme: string;
  idpLinks: string[];
  phases: SessionPhase[];
}

// ── Weekly / Day ───────────────────────────────────────────────────────────────

export interface PlanDay {
  day: string;
  type: 'training' | 'rest' | 'match' | 'recovery' | string;
  title: string;
  theme: string;
  intensity: 'low' | 'medium' | 'high' | string;
  matchProximity: string;
  idpObjectives: string[];
}

export interface WeeklyPlanData {
  days: PlanDay[];
}

// ── Multi-Week Block ───────────────────────────────────────────────────────────

export interface PlanWeek {
  label: string;
  days: PlanDay[];
}

export interface MultiWeekBlockData {
  weeks: PlanWeek[];
}

// ── Season Plan ────────────────────────────────────────────────────────────────

export interface SeasonPhase {
  name: string;
  startDate: string;
  endDate: string;
  focus: string;
  weeklyStructure: string;
}

export interface SeasonPlanData {
  phases: SeasonPhase[];
}

// ── Session Plan ───────────────────────────────────────────────────────────────

export interface SessionPlan {
  id: string;
  title: string;
  type: PlanType;
  status: PlanStatus;
  competitionPhase: CompetitionPhase | null;
  squadId: string;
  coachId: string | null;
  clubId: string;
  tags: string[] | null;
  visibility: PlanVisibility;
  createdByRole: 'admin' | 'coach';
  data: SingleSessionData | WeeklyPlanData | MultiWeekBlockData | SeasonPlanData | null;
  createdAt: string;
  updatedAt: string;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

export const DEFAULT_PHASES: SessionPhase[] = [
  { name: 'Activation',      duration: 10, description: '', coachingPoints: [], equipment: [] },
  { name: 'Technical',       duration: 20, description: '', coachingPoints: [], equipment: [] },
  { name: 'Tactical',        duration: 20, description: '', coachingPoints: [], equipment: [] },
  { name: 'Conditioned Game',duration: 15, description: '', coachingPoints: [], equipment: [] },
  { name: 'Reflection',      duration: 5,  description: '', coachingPoints: [], equipment: [] },
];

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_DAY = (day: string): PlanDay => ({
  day,
  type: 'training',
  title: '',
  theme: '',
  intensity: 'medium',
  matchProximity: '',
  idpObjectives: [],
});

export const DEFAULT_WEEK = (label = ''): PlanWeek => ({
  label,
  days: WEEK_DAYS.map(DEFAULT_DAY),
});

export const DEFAULT_SEASON_PHASE = (): SeasonPhase => ({
  name: '',
  startDate: '',
  endDate: '',
  focus: '',
  weeklyStructure: '',
});
