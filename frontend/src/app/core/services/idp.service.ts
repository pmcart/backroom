import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Idp, IdpMode, IdpStatus, NoteStatus, SwotAnalysis } from '../models/idp.model';

export interface CreateIdpPayload {
  playerId: string;
  squadId: string;
  mode?: IdpMode;
  ageGroup?: string;
  reviewDate?: string;
  startDate?: string;
  targetCompletionDate?: string;
}

export interface TimelinePayload {
  startDate?: string | null;
  targetCompletionDate?: string | null;
  reviewDate?: string | null;
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
  subSkillEvaluations?: Record<string, Record<string, number>>;
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

  // ── SWOT ──────────────────────────────────────────────────────────────────

  updateSwot(idpId: string, payload: Partial<SwotAnalysis>): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/swot`, payload);
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  updateTimeline(idpId: string, payload: TimelinePayload): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/timeline`, payload);
  }

  // ── Elite fields ──────────────────────────────────────────────────────────

  updateElite(idpId: string, payload: ElitePayload): Observable<Idp> {
    return this.http.patch<Idp>(`${this.base}/${idpId}/elite`, payload);
  }

  // ── PDF download ──────────────────────────────────────────────────────────

  downloadPdf(idpId: string, filename: string): Observable<Blob> {
    return this.http.get(`${this.base}/${idpId}/pdf`, { responseType: 'blob' }).pipe(
      tap((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }),
    );
  }

  // ── Email ─────────────────────────────────────────────────────────────────

  sendEmail(idpId: string, email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/${idpId}/send-email`, { email });
  }
}
