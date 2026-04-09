import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AvailableCoach, CoachAssignment, CreatePlayerPayload, Player, Squad } from '../models/squad.model';

@Injectable({ providedIn: 'root' })
export class SquadsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/squads`;

  getSquads(): Observable<Squad[]> {
    return this.http.get<Squad[]>(this.base);
  }

  getSquad(id: string): Observable<Squad> {
    return this.http.get<Squad>(`${this.base}/${id}`);
  }

  createSquad(payload: { name: string; ageGroup: string }): Observable<Squad> {
    return this.http.post<Squad>(this.base, payload);
  }

  deleteSquad(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ── Players ────────────────────────────────────────────────────────────────

  getAvailablePlayers(squadId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.base}/${squadId}/available-players`);
  }

  addPlayer(squadId: string, payload: CreatePlayerPayload): Observable<Player> {
    return this.http.post<Player>(`${this.base}/${squadId}/players`, payload);
  }

  assignPlayer(squadId: string, playerId: string): Observable<Player> {
    return this.http.post<Player>(`${this.base}/${squadId}/assign-player`, { playerId });
  }

  updatePlayer(squadId: string, playerId: string, payload: Partial<CreatePlayerPayload>): Observable<Player> {
    return this.http.patch<Player>(`${this.base}/${squadId}/players/${playerId}`, payload);
  }

  removePlayer(squadId: string, playerId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${squadId}/players/${playerId}`);
  }

  importPlayers(squadId: string, players: CreatePlayerPayload[]): Observable<{ imported: number }> {
    return this.http.post<{ imported: number }>(`${this.base}/${squadId}/import`, { players });
  }

  // ── Coaches ────────────────────────────────────────────────────────────────

  getAvailableCoaches(squadId: string): Observable<AvailableCoach[]> {
    return this.http.get<AvailableCoach[]>(`${this.base}/${squadId}/available-coaches`);
  }

  addCoach(squadId: string, userId: string): Observable<CoachAssignment> {
    return this.http.post<CoachAssignment>(`${this.base}/${squadId}/coaches`, { userId });
  }

  createCoach(
    squadId: string,
    payload: { firstName: string; lastName: string; email: string },
  ): Observable<CoachAssignment> {
    return this.http.post<CoachAssignment>(`${this.base}/${squadId}/coaches/new`, payload);
  }

  removeCoach(squadId: string, assignmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${squadId}/coaches/${assignmentId}`);
  }
}
