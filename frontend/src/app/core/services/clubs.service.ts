import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CoachPermissions {
  canCreateSingleSession:  boolean;
  canCreateWeeklyPlan:     boolean;
  canCreateMultiWeekBlock: boolean;
  canCreateSeasonPlan:     boolean;
  canEditAdminPlans:       boolean;
  canDeleteOwnPlans:       boolean;
}

export interface ClubSettings {
  coachPermissions: CoachPermissions;
}

export const DEFAULT_COACH_PERMISSIONS: CoachPermissions = {
  canCreateSingleSession:  true,
  canCreateWeeklyPlan:     true,
  canCreateMultiWeekBlock: true,
  canCreateSeasonPlan:     true,
  canEditAdminPlans:       false,
  canDeleteOwnPlans:       true,
};

@Injectable({ providedIn: 'root' })
export class ClubsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/clubs`;

  getSettings(): Observable<ClubSettings> {
    return this.http.get<ClubSettings>(`${this.base}/settings`);
  }

  updateSettings(payload: ClubSettings): Observable<ClubSettings> {
    return this.http.patch<ClubSettings>(`${this.base}/settings`, payload);
  }
}
