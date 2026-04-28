export class CreateCheckinDto {
  // Step 1 — Wellness metrics (1–5)
  sleepQuality: number;
  nutrition: number;
  hydration: number;
  recovery: number;
  mood: number;

  // Step 2 — Nutrition detail
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  waterIntake: number;

  // Step 3 — Sleep detail
  hoursSlept: number;
  bedtime?: string;
  wakeTime?: string;
  notesToCoach?: string;
}
