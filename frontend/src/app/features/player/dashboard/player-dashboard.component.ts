import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { IdpService } from '../../../core/services/idp.service';
import { Idp } from '../../../core/models/idp.model';

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="mb-4">
      <h5 class="fw-bold mb-0">Hey, {{ user()?.firstName }}!</h5>
      <p class="text-muted small">Stay on top of your development today.</p>
    </div>

    @if (loading()) {
      <div class="text-center py-5 text-muted">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Loading your data…
      </div>
    } @else {
      <div class="row g-3 mb-4">
        <div class="col-6 col-xl-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-1">🎯</div>
            <div class="fs-4 fw-bold">{{ activeGoals() }}</div>
            <div class="text-muted small">Active Goals</div>
          </div>
        </div>
        <div class="col-6 col-xl-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-1">📈</div>
            <div class="fs-4 fw-bold">{{ idp() ? idp()!.progress + '%' : '—' }}</div>
            <div class="text-muted small">IDP Progress</div>
          </div>
        </div>
        <div class="col-6 col-xl-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-1">💬</div>
            <div class="fs-4 fw-bold">{{ coachNotesCount() }}</div>
            <div class="text-muted small">Coach Notes</div>
          </div>
        </div>
        <div class="col-6 col-xl-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-1">📋</div>
            <div class="fs-4 fw-bold">
              @if (idp()) {
                <span class="badge fs-6 fw-semibold px-2 py-1" [class]="statusClass()">
                  {{ idpStatusLabel() }}
                </span>
              } @else {
                <span class="text-muted">—</span>
              }
            </div>
            <div class="text-muted small">IDP Status</div>
          </div>
        </div>
      </div>

      @if (idp()) {
        <div class="row g-3 mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="fw-semibold mb-0">Overall IDP Progress</h6>
                  <span class="fw-bold">{{ idp()!.progress }}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div
                    class="progress-bar"
                    [class]="progressBarClass()"
                    [style.width.%]="idp()!.progress"
                  ></div>
                </div>
                @if (idp()!.reviewDate) {
                  <p class="text-muted small mt-2 mb-0">
                    Next review: {{ idp()!.reviewDate | date: 'd MMM yyyy' }}
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h6 class="fw-semibold mb-3">My Goals</h6>
                @for (goal of idp()!.goals.slice(0, 3); track goal.id) {
                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-start mb-1 gap-2">
                      <div class="min-w-0">
                        <span class="fw-medium small d-block text-truncate">{{ goal.title }}</span>
                        <span class="badge mt-1 small" [class]="goalStatusBadge(goal.status)">
                          {{ goal.status }}
                        </span>
                      </div>
                      <span class="text-muted small flex-shrink-0">{{ goal.progress }}%</span>
                    </div>
                    <div class="progress" style="height: 6px;">
                      <div
                        class="progress-bar"
                        [class]="goalProgressBar(goal.progress)"
                        [style.width.%]="goal.progress"
                      ></div>
                    </div>
                  </div>
                }
                @if (idp()!.goals.length > 3) {
                  <a routerLink="/player/goals" class="btn btn-link btn-sm px-0 text-decoration-none">
                    View all {{ idp()!.goals.length }} goals →
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body text-center py-4">
            <p class="text-muted mb-2">No IDP assigned yet.</p>
            <p class="text-muted small mb-0">Your coach will create your Individual Development Plan.</p>
          </div>
        </div>
      }

      <div class="card border-0 shadow-sm">
        <div class="card-body py-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h6 class="fw-semibold mb-0">Quick Actions</h6>
              <p class="text-muted small mb-0">Check in or review your development plan</p>
            </div>
            <div class="d-flex gap-2 w-100 w-sm-auto">
              <a routerLink="/player/checkin" class="btn btn-primary btn-sm flex-grow-1 flex-sm-grow-0">Daily Check-in</a>
              @if (idp()) {
                <a routerLink="/player/idp" class="btn btn-outline-secondary btn-sm flex-grow-1 flex-sm-grow-0">View IDP</a>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PlayerDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private idpService = inject(IdpService);

  user = this.auth.currentUser;
  idp = signal<Idp | null>(null);
  loading = signal(true);

  activeGoals = computed(() => {
    const goals = this.idp()?.goals ?? [];
    return goals.filter((g) => g.status !== 'completed').length;
  });

  coachNotesCount = computed(() => {
    const i = this.idp();
    if (!i) return 0;
    const comments = i.coachComments ? 1 : 0;
    return comments + (i.notes?.length ?? 0);
  });

  idpStatusLabel = computed(() => {
    const s = this.idp()?.status;
    if (s === 'active') return 'Active';
    if (s === 'review-due') return 'Review Due';
    if (s === 'completed') return 'Completed';
    return s ?? '';
  });

  statusClass = computed(() => {
    const s = this.idp()?.status;
    if (s === 'active') return 'bg-success-subtle text-success';
    if (s === 'review-due') return 'bg-warning-subtle text-warning';
    if (s === 'completed') return 'bg-secondary-subtle text-secondary';
    return 'bg-secondary-subtle text-secondary';
  });

  progressBarClass = computed(() => {
    const p = this.idp()?.progress ?? 0;
    if (p >= 70) return 'bg-success';
    if (p >= 40) return 'bg-warning';
    return 'bg-danger';
  });

  goalStatusBadge(status: string): string {
    if (status === 'on-track') return 'bg-success-subtle text-success';
    if (status === 'in-progress') return 'bg-primary-subtle text-primary';
    if (status === 'at-risk') return 'bg-danger-subtle text-danger';
    if (status === 'completed') return 'bg-secondary-subtle text-secondary';
    return 'bg-secondary-subtle text-secondary';
  }

  goalProgressBar(progress: number): string {
    if (progress >= 70) return 'bg-success';
    if (progress >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  ngOnInit() {
    this.idpService.getMine().subscribe({
      next: (idp) => {
        this.idp.set(idp);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
