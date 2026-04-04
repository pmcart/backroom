import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

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

    <!-- Stat cards -->
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

    <!-- Placeholder panels -->
    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold border-bottom-0 pt-3">Recent Activity</div>
          <div class="card-body text-muted small">Activity feed will appear here.</div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold border-bottom-0 pt-3">Alerts</div>
          <div class="card-body text-muted small">No active alerts.</div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {
  private auth = inject(AuthService);
  user = this.auth.currentUser;

  statCards = [
    { label: 'Total Squads', value: '6', icon: 'bi-people-fill', color: '#0d6efd' },
    { label: 'Active Players', value: '94', icon: 'bi-person-fill-check', color: '#198754' },
    { label: 'IDPs Active', value: '87', icon: 'bi-person-lines-fill', color: '#fd7e14' },
    { label: 'Sessions This Week', value: '18', icon: 'bi-clipboard2-fill', color: '#6f42c1' },
  ];
}
