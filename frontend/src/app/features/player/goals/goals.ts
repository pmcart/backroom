import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { IdpService } from '../../../core/services/idp.service';
import { Idp, IdpGoal } from '../../../core/models/idp.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="mb-4">
      <h5 class="fw-bold mb-0">My Goals</h5>
      <p class="text-muted small mb-0">Track your individual development targets</p>
    </div>

    @if (loading()) {
      <div class="text-center py-5 text-muted">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Loading your goals…
      </div>
    } @else if (!idp()) {
      <div class="card border-0 shadow-sm">
        <div class="card-body text-center py-5 text-muted">
          No IDP assigned yet. Your coach will set up your goals.
        </div>
      </div>
    } @else if (idp()!.goals.length === 0) {
      <div class="card border-0 shadow-sm">
        <div class="card-body text-center py-5 text-muted">
          No goals added yet.
        </div>
      </div>
    } @else {
      <!-- Summary bar -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-4 fw-bold">{{ idp()!.goals.length }}</div>
            <div class="text-muted small">Total Goals</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-4 fw-bold text-success">{{ onTrack() }}</div>
            <div class="text-muted small">On Track</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-4 fw-bold text-warning">{{ inProgress() }}</div>
            <div class="text-muted small">In Progress</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="fs-4 fw-bold text-danger">{{ atRisk() }}</div>
            <div class="text-muted small">At Risk</div>
          </div>
        </div>
      </div>

      <!-- Category filter -->
      <div class="d-flex gap-2 mb-3 overflow-auto pb-1" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
        <button
          class="btn btn-sm flex-shrink-0"
          [class]="activeCategory() === null ? 'btn-dark' : 'btn-outline-secondary'"
          (click)="activeCategory.set(null)"
        >All</button>
        @for (cat of categories(); track cat) {
          <button
            class="btn btn-sm flex-shrink-0"
            [class]="activeCategory() === cat ? 'btn-dark' : 'btn-outline-secondary'"
            (click)="activeCategory.set(cat)"
          >{{ cat }}</button>
        }
      </div>

      <!-- Goals list -->
      <div class="d-flex flex-column gap-3">
        @for (goal of filteredGoals(); track goal.id) {
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="flex-grow-1 me-3">
                  <h6 class="fw-semibold mb-1">{{ goal.title }}</h6>
                  <div class="d-flex flex-wrap gap-2">
                    @if (goal.category) {
                      <span class="badge bg-light text-dark border small">{{ goal.category }}</span>
                    }
                    <span class="badge small" [ngClass]="statusBadge(goal.status)">
                      {{ statusLabel(goal.status) }}
                    </span>
                  </div>
                </div>
                @if (goal.coachRating) {
                  <div class="text-warning small flex-shrink-0">
                    @for (s of starsArray(goal.coachRating); track $index) { ★ }
                    @for (e of emptyStars(goal.coachRating); track $index) {
                      <span class="text-muted">★</span>
                    }
                  </div>
                }
              </div>

              @if (goal.description) {
                <p class="text-muted small mb-3">{{ goal.description }}</p>
              }

              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-muted small">Progress</span>
                <span class="fw-semibold small">{{ goal.progress }}%</span>
              </div>
              <div class="progress mb-3" style="height: 8px;">
                <div
                  class="progress-bar"
                  [ngClass]="progressBarClass(goal.progress)"
                  [style.width.%]="goal.progress"
                ></div>
              </div>

              @if (goal.kpi || goal.targetDate) {
                <div class="row g-2 text-muted small border-top pt-2 mt-1">
                  @if (goal.kpi) {
                    <div class="col-12 col-md-8">
                      <span class="fw-medium text-dark">KPI:</span> {{ goal.kpi }}
                    </div>
                  }
                  @if (goal.targetDate) {
                    <div class="col-12 col-md-4 text-md-end">
                      <span class="fw-medium text-dark">Target:</span>
                      {{ goal.targetDate | date: 'd MMM yyyy' }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class Goals implements OnInit {
  private idpService = inject(IdpService);

  idp = signal<Idp | null>(null);
  loading = signal(true);
  activeCategory = signal<string | null>(null);

  onTrack = computed(() => this.idp()?.goals.filter((g) => g.status === 'on-track').length ?? 0);
  inProgress = computed(() => this.idp()?.goals.filter((g) => g.status === 'in-progress').length ?? 0);
  atRisk = computed(() => this.idp()?.goals.filter((g) => g.status === 'at-risk').length ?? 0);

  categories = computed(() => {
    const cats = (this.idp()?.goals ?? []).map((g) => g.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  });

  filteredGoals = computed(() => {
    const goals = this.idp()?.goals ?? [];
    const cat = this.activeCategory();
    return cat ? goals.filter((g) => g.category === cat) : goals;
  });

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'completed': 'Completed',
    };
    return map[status] ?? status;
  }

  statusBadge(status: string): string {
    if (status === 'on-track') return 'bg-success-subtle text-success';
    if (status === 'in-progress') return 'bg-primary-subtle text-primary';
    if (status === 'at-risk') return 'bg-danger-subtle text-danger';
    if (status === 'completed') return 'bg-secondary-subtle text-secondary';
    return 'bg-secondary-subtle text-secondary';
  }

  progressBarClass(progress: number): string {
    if (progress >= 70) return 'bg-success';
    if (progress >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  emptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
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
