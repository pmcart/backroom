import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

interface ClubSummary {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  squadCount: number;
  userCount: number;
  adminCount: number;
  coachCount: number;
}

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="sa-page">
      <div class="sa-header">
        <div>
          <h1 class="sa-title">Platform Overview</h1>
          <p class="sa-sub">All clubs on the Backroom platform</p>
        </div>
        <div class="sa-stats-row">
          <div class="sa-stat">
            <span class="sa-stat-val">{{ clubs().length }}</span>
            <span class="sa-stat-label">Clubs</span>
          </div>
          <div class="sa-stat">
            <span class="sa-stat-val">{{ totalSquads() }}</span>
            <span class="sa-stat-label">Squads</span>
          </div>
          <div class="sa-stat">
            <span class="sa-stat-val">{{ totalUsers() }}</span>
            <span class="sa-stat-label">Users</span>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="sa-loading">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-muted">Loading clubs…</p>
        </div>
      } @else if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      } @else if (clubs().length === 0) {
        <div class="sa-empty">
          <p class="text-muted">No clubs have been created yet.</p>
        </div>
      } @else {
        <div class="sa-grid">
          @for (club of clubs(); track club.id) {
            <div class="sa-card">
              <div class="sa-card-header">
                <div class="sa-club-badge" [style.background]="clubColor(club.name)">
                  {{ clubInitials(club.name) }}
                </div>
                <div>
                  <div class="sa-club-name">{{ club.name }}</div>
                  <div class="sa-club-since">Since {{ club.createdAt | date:'MMM yyyy' }}</div>
                </div>
                <span class="sa-active-badge">Active</span>
              </div>

              <div class="sa-card-stats">
                <div class="sa-card-stat">
                  <span class="sa-card-stat-val">{{ club.squadCount }}</span>
                  <span class="sa-card-stat-label">Squads</span>
                </div>
                <div class="sa-card-stat">
                  <span class="sa-card-stat-val">{{ club.adminCount }}</span>
                  <span class="sa-card-stat-label">Admins</span>
                </div>
                <div class="sa-card-stat">
                  <span class="sa-card-stat-val">{{ club.coachCount }}</span>
                  <span class="sa-card-stat-label">Coaches</span>
                </div>
                <div class="sa-card-stat">
                  <span class="sa-card-stat-val">{{ club.userCount }}</span>
                  <span class="sa-card-stat-label">Total Users</span>
                </div>
              </div>

              <div class="sa-card-footer">
                <button
                  class="btn btn-primary btn-sm"
                  [disabled]="viewingClubId() === club.id"
                  (click)="viewAsAdmin(club)"
                >
                  @if (viewingClubId() === club.id) {
                    <span class="spinner-border spinner-border-sm me-1"></span> Entering…
                  } @else {
                    View as Admin
                  }
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <style>
      .sa-page { padding: 28px 32px; }
      .sa-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .sa-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
      .sa-sub { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }
      .sa-stats-row { display: flex; gap: 20px; }
      .sa-stat {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 20px;
        text-align: center;
      }
      .sa-stat-val { display: block; font-size: 1.5rem; font-weight: 700; color: #1e293b; }
      .sa-stat-label { font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
      .sa-loading { display: flex; flex-direction: column; align-items: center; padding: 60px 0; }
      .sa-empty { text-align: center; padding: 60px 0; }
      .sa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
      .sa-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        transition: box-shadow 0.15s;
      }
      .sa-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }
      .sa-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 20px 14px;
        border-bottom: 1px solid #f1f5f9;
      }
      .sa-club-badge {
        width: 42px; height: 42px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
      }
      .sa-club-name { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
      .sa-club-since { font-size: 0.73rem; color: #94a3b8; margin-top: 2px; }
      .sa-active-badge {
        margin-left: auto;
        background: #dcfce7; color: #16a34a;
        font-size: 0.65rem; font-weight: 700;
        padding: 3px 8px; border-radius: 20px;
        text-transform: uppercase; letter-spacing: 0.06em;
        flex-shrink: 0;
      }
      .sa-card-stats {
        display: grid; grid-template-columns: repeat(4, 1fr);
        padding: 14px 20px;
        gap: 8px;
      }
      .sa-card-stat { text-align: center; }
      .sa-card-stat-val { display: block; font-size: 1.2rem; font-weight: 700; color: #1e293b; }
      .sa-card-stat-label { font-size: 0.67rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
      .sa-card-footer {
        padding: 12px 20px 16px;
        border-top: 1px solid #f1f5f9;
        display: flex;
        justify-content: flex-end;
      }
    </style>
  `,
})
export class SuperadminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);

  clubs = signal<ClubSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  viewingClubId = signal<string | null>(null);

  totalSquads = () => this.clubs().reduce((s, c) => s + c.squadCount, 0);
  totalUsers  = () => this.clubs().reduce((s, c) => s + c.userCount, 0);

  ngOnInit() {
    this.http.get<ClubSummary[]>(`${environment.apiUrl}/superadmin/clubs`).subscribe({
      next: (clubs) => {
        this.clubs.set(clubs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load clubs.');
        this.loading.set(false);
      },
    });
  }

  viewAsAdmin(club: ClubSummary) {
    this.viewingClubId.set(club.id);
    this.auth.impersonateClub(club.id).subscribe({
      next: () => {
        this.viewingClubId.set(null);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.viewingClubId.set(null);
        this.error.set(`Could not enter ${club.name} — no admin user found.`);
      },
    });
  }

  clubInitials(name: string): string {
    return name.split(' ').filter(w => w).map(w => w[0]).join('').slice(0, 3);
  }

  clubColor(name: string): string {
    const palette = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#16a085', '#2c3e50', '#1abc9c'];
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return palette[hash % palette.length];
  }
}
