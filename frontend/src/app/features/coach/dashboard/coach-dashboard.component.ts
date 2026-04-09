import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  template: `
    <div class="mb-4">
      <h5 class="fw-bold mb-0">Welcome back, {{ user()?.firstName }}</h5>
      <p class="text-muted small">Your squad overview for today.</p>
    </div>

    <div class="row g-3 mb-4">
      @for (card of statCards; track card.label) {
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 p-3 text-white" [style.background-color]="card.color">
                <i [class]="'bi fs-4 ' + card.icon"></i>
              </div>
              <div>
                <div class="fs-4 fw-bold">{{ card.value }}</div>
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
export class CoachDashboardComponent {
  private auth = inject(AuthService);
  user = this.auth.currentUser;

  statCards = [
    { label: 'Squad Players', value: '22', icon: 'bi-people-fill', color: '#0d6efd' },
    { label: 'Active IDPs', value: '20', icon: 'bi-person-lines-fill', color: '#198754' },
    { label: 'Sessions Planned', value: '4', icon: 'bi-clipboard2-fill', color: '#fd7e14' },
    { label: 'Check-ins Today', value: '15', icon: 'bi-check2-circle', color: '#6f42c1' },
  ];
}
