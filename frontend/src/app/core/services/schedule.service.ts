import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ScheduleEntry, ScheduleEntryType } from '../models/schedule.model';

export interface CreateEntryPayload {
  squadId: string;
  date: string;
  title: string;
  type: ScheduleEntryType;
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/schedule`;

  getByWeek(weekStart: string): Observable<ScheduleEntry[]> {
    return this.http.get<ScheduleEntry[]>(this.base, { params: { weekStart } });
  }

  create(payload: CreateEntryPayload): Observable<ScheduleEntry> {
    return this.http.post<ScheduleEntry>(this.base, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
