import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { IdpService } from '../../../core/services/idp.service';
import { SessionsService } from '../../../core/services/sessions.service';
import { SquadsService } from '../../../core/services/squads.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="row g-3 mb-4">
      <div class="col-12">
        <h5 class="fw-bold mb-0">Welcome back, {{ user()?.firstName }}</h5>
        <p class="text-muted small">Here's what's happening across the academy today.</p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      @for (card of statCards(); track card.label) {
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 p-3 text-white" [style.background-color]="card.color">
                <i [class]="'bi fs-4 ' + card.icon"></i>
              </div>
              <div>
                @if (loading()) {
                  <div class="placeholder-glow"><span class="placeholder col-4"></span></div>
                } @else {
                  <div class="fs-4 fw-bold">{{ card.value }}</div>
                }
                <div class="text-muted small">{{ card.label }}</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header fw-semibold border-bottom-0 pt-3">Recent Activity</div>
          <div class="card-body text-muted small">Activity feed will appear here.</div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header fw-semibold border-bottom-0 pt-3">Alerts</div>
          <div class="card-body text-muted small">No active alerts.</div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private auth          = inject(AuthService);
  private squadsService = inject(SquadsService);
  private idpService    = inject(IdpService);
  private sessionsService = inject(SessionsService);

  user    = this.auth.currentUser;
  loading = signal(true);

  private counts = signal({ squads: 0, players: 0, idps: 0, sessions: 0 });

  statCards = () => [
    { label: 'Total Squads',      value: this.counts().squads,   icon: 'bi-people-fill',        color: '#0d6efd' },
    { label: 'Active Players',    value: this.counts().players,  icon: 'bi-person-fill-check',  color: '#198754' },
    { label: 'IDPs Active',       value: this.counts().idps,     icon: 'bi-person-lines-fill',  color: '#fd7e14' },
    { label: 'Active Sessions',   value: this.counts().sessions, icon: 'bi-clipboard2-fill',    color: '#6f42c1' },
  ];

  ngOnInit() {
    forkJoin({
      squads:   this.squadsService.getSquads(),
      idps:     this.idpService.getAll(),
      sessions: this.sessionsService.getAll(),
    }).subscribe({
      next: ({ squads, idps, sessions }) => {
        this.counts.set({
          squads:   squads.length,
          players:  squads.reduce((n, s) => n + s.players.filter(p => p.status === 'active').length, 0),
          idps:     idps.filter(i => i.status === 'active' || i.status === 'review-due').length,
          sessions: sessions.filter(s => s.status !== 'archived').length,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
