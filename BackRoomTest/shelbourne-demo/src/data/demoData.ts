// Shared demo data types

export interface Player {
  id: string;
  name: string;
  position: string;
  ageGroup: string;
  status: 'active' | 'injured' | 'recovery';
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  ageGroups: string[];
}

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  ageGroup: string;
  focus: string;
  status: 'completed' | 'scheduled';
  coach: string;
}

export interface IDPGoal {
  id: string;
  playerId: string;
  category: string;
  goal: string;
  progress: number;
  targetDate: string;
  status: string;
}

export interface WellnessEntry {
  date: string;
  sleep: number;
  nutrition: number;
  hydration: number;
  recovery: number;
  mood: number;
}

export interface EducationModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  completedBy: number;
  totalPlayers: number;
  mandatory: boolean;
}

export interface VideoClip {
  id: string;
  title: string;
  match: string;
  date: string;
  duration: string;
  type: 'match' | 'training' | 'individual';
  feedback?: string;
}
