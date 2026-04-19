import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionPlan } from '../models/session.model';

export interface CreatePlanPayload {
  title: string;
  type: string;
  status?: string;
  competitionPhase?: string;
  squadId: string;
  tags?: string[];
  visibility?: 'private' | 'squad' | 'club';
  data?: any;
}

export interface UpdatePlanPayload {
  title?: string;
  status?: string;
  competitionPhase?: string;
  tags?: string[];
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/sessions`;

  getAll(): Observable<SessionPlan[]> {
    return this.http.get<SessionPlan[]>(this.base);
  }

  getOne(id: string): Observable<SessionPlan> {
    return this.http.get<SessionPlan>(`${this.base}/${id}`);
  }

  create(payload: CreatePlanPayload): Observable<SessionPlan> {
    return this.http.post<SessionPlan>(this.base, payload);
  }

  update(id: string, payload: UpdatePlanPayload): Observable<SessionPlan> {
    return this.http.patch<SessionPlan>(`${this.base}/${id}`, payload);
  }

  archive(id: string): Observable<SessionPlan> {
    return this.http.patch<SessionPlan>(`${this.base}/${id}/archive`, {});
  }

  duplicate(id: string): Observable<SessionPlan> {
    return this.http.post<SessionPlan>(`${this.base}/${id}/duplicate`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
