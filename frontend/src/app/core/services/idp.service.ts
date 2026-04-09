import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Idp, IdpMode, IdpStatus, NoteStatus } from '../models/idp.model';

export interface CreateIdpPayload {
  playerId: string;
  squadId: string;
  mode?: IdpMode;
  ageGroup?: string;
  reviewDate?: string;
}

export interface GoalPayload {
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  kpi?: string;
  progress?: number;
  status?: string;
  coachRating?: number | null;
}

export interface ElitePayload {
  holisticEvaluation?: Record<string, number>;
  primaryPosition?: string;
  secondaryPosition?: string;
  positionalDemands?: string[];
  performanceSupport?: string;
  offFieldDevelopment?: string;
  methodologyTags?: string[];
}

@Injectable({ providedIn: 'root' })
export class IdpService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/idps`;

  // ── IDP CRUD ──────────────────────────────────────────────────────────────

  getAll(): Observable<Idp[]> {
    return this.http.get<Idp[]>(this.base);
  }

  getOne(id: string): Observable<Idp> {
    return this.http.get<Idp>(`${this.base}/${id}`);
  }

  create(payload: CreateIdpPayload): Observable<Idp> {
    return this.http.post<Idp>(this.base, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ── Status ────────────────────────────────────────────────────────────────

  updateStatus(id: string, status: IdpStatus): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${id}/status`, { status });
  }

  // ── Goals ─────────────────────────────────────────────────────────────────

  addGoal(idpId: string, payload: GoalPayload): Observable<Idp> {
    return this.http.post<Idp>(`${this.base}/${idpId}/goals`, payload);
  }

  updateGoal(idpId: string, goalId: string, payload: GoalPayload): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/goals/${goalId}`, payload);
  }

  deleteGoal(idpId: string, goalId: string): Observable<Idp> {
    return this.http.delete<Idp>(`${this.base}/${idpId}/goals/${goalId}`);
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  updateComments(idpId: string, comments: string): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/comments`, { comments });
  }

  // ── Progress Notes ────────────────────────────────────────────────────────

  addProgressNote(idpId: string, payload: { content: string; status: NoteStatus }): Observable<Idp> {
    return this.http.post<Idp>(`${this.base}/${idpId}/notes`, payload);
  }

  // ── Elite fields ──────────────────────────────────────────────────────────

  updateElite(idpId: string, payload: ElitePayload): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/elite`, payload);
  }
}
