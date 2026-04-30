import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { IdpService } from '../../../core/services/idp.service';
import { SessionsService } from '../../../core/services/sessions.service';
import { SquadsService } from '../../../core/services/squads.service';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  template: `
    <div class="mb-4">
      <h5 class="fw-bold mb-0">Welcome back, {{ user()?.firstName }}</h5>
      <p class="text-muted small">Your squad overview for today.</p>
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
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-header fw-semibold border-bottom-0 pt-3">Upcoming Sessions</div>
          <div class="card-body text-muted small">Session schedule will appear here.</div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-header fw-semibold border-bottom-0 pt-3">Wellness Alerts</div>
          <div class="card-body text-muted small">No flagged players today.</div>
        </div>
      </div>
    </div>
  `,
})
export class CoachDashboardComponent implements OnInit {
  private auth            = inject(AuthService);
  private squadsService   = inject(SquadsService);
  private idpService      = inject(IdpService);
  private sessionsService = inject(SessionsService);

  user    = this.auth.currentUser;
  loading = signal(true);

  private counts = signal({ players: 0, idps: 0, sessions: 0 });

  statCards = () => [
    { label: 'Squad Players',    value: this.counts().players,  icon: 'bi-people-fill',       color: '#0d6efd' },
    { label: 'Active IDPs',      value: this.counts().idps,     icon: 'bi-person-lines-fill', color: '#198754' },
    { label: 'Sessions Planned', value: this.counts().sessions, icon: 'bi-clipboard2-fill',   color: '#fd7e14' },
  ];

  ngOnInit() {
    const userId = this.user()?.id;

    forkJoin({
      squads:   this.squadsService.getSquads(),
      idps:     this.idpService.getAll(),
      sessions: this.sessionsService.getAll(),
    }).subscribe({
      next: ({ squads, idps, sessions }) => {
        const mySquads    = squads.filter(s => s.coachAssignments.some(ca => ca.userId === userId));
        const mySquadIds  = new Set(mySquads.map(s => s.id));

        this.counts.set({
          players:  mySquads.reduce((n, s) => n + s.players.filter(p => p.status === 'active').length, 0),
          idps:     idps.filter(i => mySquadIds.has(i.squadId) && (i.status === 'active' || i.status === 'review-due')).length,
          sessions: sessions.filter(s => s.status !== 'archived').length,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
