export type IdpStatus = 'active' | 'review-due' | 'completed';
export type IdpMode = 'standard' | 'elite';
export type GoalStatus = 'not-started' | 'in-progress' | 'on-track' | 'at-risk' | 'completed';
export type NoteStatus = 'on-track' | 'needs-attention' | 'exceeding';

export interface IdpGoal {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  targetDate: string | null;
  kpi: string | null;
  progress: number;
  status: GoalStatus;
  coachRating: number | null;
}

export interface ProgressNote {
  id: string;
  content: string;
  status: NoteStatus;
  createdAt: string;
}

export interface Idp {
  id: string;
  mode: IdpMode;
  status: IdpStatus;
  ageGroup: string | null;
  reviewDate: string | null;
  coachComments: string | null;
  clubId: string;
  squadId: string;
  playerId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  // Elite fields
  holisticEvaluation: Record<string, number> | null;
  primaryPosition: string | null;
  secondaryPosition: string | null;
  positionalDemands: string[] | null;
  performanceSupport: string | null;
  offFieldDevelopment: string | null;
  methodologyTags: string[] | null;
  // Relations
  player: { id: string; firstName: string; lastName: string; position: string | null } | null;
  squad: { id: string; name: string; ageGroup: string } | null;
  goals: IdpGoal[];
  notes: ProgressNote[];
}
