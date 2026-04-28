import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckinPayload {
  sleepQuality: number;
  nutrition: number;
  hydration: number;
  recovery: number;
  mood: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  waterIntake: number;
  hoursSlept: number;
  bedtime?: string;
  wakeTime?: string;
  notesToCoach?: string;
}

export interface CheckinResult {
  id: string;
  overallLevel: 'green' | 'amber' | 'red';
  date: string;
}

@Injectable({ providedIn: 'root' })
export class WellnessService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/wellness`;

  submitCheckin(payload: CheckinPayload): Observable<CheckinResult> {
    return this.http.post<CheckinResult>(`${this.base}/checkin`, payload);
  }

  getStreak(): Observable<number> {
    return this.http.get<number>(`${this.base}/streak`);
  }
}
