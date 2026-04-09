export type ScheduleEntryType = 'training' | 'match' | 'recovery' | 'rest';

export interface ScheduleEntry {
  id: string;
  clubId: string;
  squadId: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: ScheduleEntryType;
  createdAt: string;
}

export interface ScheduleDay {
  date: string;   // YYYY-MM-DD
  label: string;  // 'Mon', 'Tue', …
  full: string;   // 'Mon 6 Apr'
}
