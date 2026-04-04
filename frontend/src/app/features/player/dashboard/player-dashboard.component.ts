import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mb-4">
      <h5 class="fw-bold mb-0">Hey, {{ user()?.firstName }}!</h5>
      <p class="text-muted small">Stay on top of your development today.</p>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-1">🔥</div>
          <div class="fs-4 fw-bold">5</div>
          <div class="text-muted small">Day Streak</div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-1">🎯</div>
          <div class="fs-4 fw-bold">3</div>
          <div class="text-muted small">Active Goals</div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-1">📈</div>
          <div class="fs-4 fw-bold">72%</div>
          <div class="text-muted small">IDP Progress</div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-1">💬</div>
          <div class="fs-4 fw-bold">2</div>
          <div class="text-muted small">Coach Notes</div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body text-center py-5">
        <p class="text-muted mb-3">Have you completed your check-in today?</p>
        <a routerLink="/player/checkin" class="btn btn-primary px-4">Start Daily Check-in</a>
      </div>
    </div>
  `,
})
export class PlayerDashboardComponent {
  private auth = inject(AuthService);
  user = this.auth.currentUser;
}
