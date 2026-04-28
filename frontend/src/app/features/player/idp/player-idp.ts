import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { IdpService } from '../../../core/services/idp.service';
import { Idp, IdpGoal } from '../../../core/models/idp.model';

@Component({
  selector: 'app-player-idp',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h5 class="fw-bold mb-0">My Development Plan</h5>
        <p class="text-muted small mb-0">Your individual development goals and progress</p>
      </div>
    </div>

    @if (loading()) {
      <div class="text-center py-5 text-muted">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Loading your IDP…
      </div>
    } @else if (!idp()) {
      <div class="card border-0 shadow-sm">
        <div class="card-body text-center py-5">
          <p class="text-muted mb-1">No IDP assigned yet.</p>
          <p class="text-muted small">Your coach will create your Individual Development Plan.</p>
        </div>
      </div>
    } @else {
      <!-- IDP Header -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-sm-6 col-lg-3">
              <div class="text-muted small">Status</div>
              <span class="badge mt-1 fs-6 fw-semibold px-2 py-1" [ngClass]="statusClass(idp()!.status)">
                {{ statusLabel(idp()!.status) }}
              </span>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="text-muted small">Mode</div>
              <div class="fw-semibold mt-1 text-capitalize">{{ idp()!.mode }}</div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="text-muted small">Age Group</div>
              <div class="fw-semibold mt-1">{{ idp()!.ageGroup ?? '—' }}</div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="text-muted small">Review Date</div>
              <div class="fw-semibold mt-1">
                {{ idp()!.reviewDate ? (idp()!.reviewDate | date: 'd MMM yyyy') : '—' }}
              </div>
            </div>
          </div>

          <hr class="my-3">

          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold small">Overall Progress</span>
            <span class="fw-bold">{{ idp()!.progress }}%</span>
          </div>
          <div class="progress" style="height: 10px;">
            <div
              class="progress-bar"
              [ngClass]="progressBarClass(idp()!.progress)"
              [style.width.%]="idp()!.progress"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab() === 'goals'" (click)="activeTab.set('goals')">
            Goals
            <span class="badge bg-secondary ms-1">{{ idp()!.goals.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="activeTab() === 'feedback'" (click)="activeTab.set('feedback')">
            Coach Feedback
            @if (feedbackCount() > 0) {
              <span class="badge bg-primary ms-1">{{ feedbackCount() }}</span>
            }
          </button>
        </li>
        @if (idp()!.mode === 'elite') {
          <li class="nav-item">
            <button class="nav-link" [class.active]="activeTab() === 'profile'" (click)="activeTab.set('profile')">
              Profile
            </button>
          </li>
        }
      </ul>

      <!-- Goals Tab -->
      @if (activeTab() === 'goals') {
        @if (idp()!.goals.length === 0) {
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-4 text-muted">No goals added yet.</div>
          </div>
        } @else {
          <div class="row g-3">
            @for (goal of idp()!.goals; track goal.id) {
              <div class="col-12">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 class="fw-semibold mb-1">{{ goal.title }}</h6>
                        <div class="d-flex flex-wrap gap-2 mb-2">
                          @if (goal.category) {
                            <span class="badge bg-light text-dark border small">{{ goal.category }}</span>
                          }
                          <span class="badge small" [ngClass]="goalStatusBadge(goal.status)">
                            {{ goalStatusLabel(goal.status) }}
                          </span>
                        </div>
                      </div>
                      @if (goal.coachRating) {
                        <div class="text-warning small flex-shrink-0 ms-2">
                          @for (star of starsArray(goal.coachRating); track $index) {
                            ★
                          }
                          @for (empty of emptyStarsArray(goal.coachRating); track $index) {
                            <span class="text-muted">★</span>
                          }
                        </div>
                      }
                    </div>

                    @if (goal.description) {
                      <p class="text-muted small mb-2">{{ goal.description }}</p>
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

                    <div class="row g-2 text-muted small">
                      @if (goal.kpi) {
                        <div class="col-12 col-md-6">
                          <span class="fw-medium text-dark">KPI:</span> {{ goal.kpi }}
                        </div>
                      }
                      @if (goal.targetDate) {
                        <div class="col-12 col-md-6">
                          <span class="fw-medium text-dark">Target:</span> {{ goal.targetDate | date: 'd MMM yyyy' }}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }

      <!-- Coach Feedback Tab -->
      @if (activeTab() === 'feedback') {
        @if (idp()!.coachComments) {
          <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
              <h6 class="fw-semibold mb-2">Coach Comments</h6>
              <p class="mb-0 text-muted" style="white-space: pre-line;">{{ idp()!.coachComments }}</p>
            </div>
          </div>
        }

        @if (idp()!.notes.length > 0) {
          <h6 class="fw-semibold mb-2">Progress Notes</h6>
          <div class="d-flex flex-column gap-2">
            @for (note of idp()!.notes; track note.id) {
              <div class="card border-0 shadow-sm">
                <div class="card-body py-3">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <span class="badge small" [ngClass]="noteStatusBadge(note.status)">
                      {{ noteStatusLabel(note.status) }}
                    </span>
                    <span class="text-muted small">{{ note.createdAt | date: 'd MMM yyyy' }}</span>
                  </div>
                  <p class="mb-0 small">{{ note.content }}</p>
                </div>
              </div>
            }
          </div>
        }

        @if (!idp()!.coachComments && idp()!.notes.length === 0) {
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-4 text-muted">No coach feedback yet.</div>
          </div>
        }
      }

      <!-- Elite Profile Tab -->
      @if (activeTab() === 'profile' && idp()!.mode === 'elite') {
        <div class="row g-3">
          @if (idp()!.primaryPosition || idp()!.secondaryPosition) {
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h6 class="fw-semibold mb-3">Positional Profile</h6>
                  <div class="row g-2">
                    @if (idp()!.primaryPosition) {
                      <div class="col-sm-6">
                        <div class="text-muted small">Primary Position</div>
                        <div class="fw-semibold">{{ idp()!.primaryPosition }}</div>
                      </div>
                    }
                    @if (idp()!.secondaryPosition) {
                      <div class="col-sm-6">
                        <div class="text-muted small">Secondary Position</div>
                        <div class="fw-semibold">{{ idp()!.secondaryPosition }}</div>
                      </div>
                    }
                  </div>
                  @if (idp()!.positionalDemands?.length) {
                    <div class="mt-3">
                      <div class="text-muted small mb-2">Positional Demands</div>
                      <ul class="list-unstyled mb-0">
                        @for (demand of idp()!.positionalDemands!; track $index) {
                          <li class="small mb-1">• {{ demand }}</li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (idp()!.holisticEvaluation) {
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h6 class="fw-semibold mb-3">Holistic Evaluation</h6>
                  <div class="d-flex flex-column gap-2">
                    @for (entry of holisticEntries(); track entry.key) {
                      <div>
                        <div class="d-flex justify-content-between small mb-1">
                          <span>{{ entry.key }}</span>
                          <span class="fw-semibold">{{ entry.value }}/10</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-primary" [style.width.%]="entry.value * 10"></div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          @if (idp()!.methodologyTags?.length) {
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h6 class="fw-semibold mb-2">Club Methodology Tags</h6>
                  <div class="d-flex flex-wrap gap-2">
                    @for (tag of idp()!.methodologyTags!; track $index) {
                      <span class="badge bg-primary-subtle text-primary">{{ tag }}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    }
  `,
})
export class PlayerIdp implements OnInit {
  private idpService = inject(IdpService);

  idp = signal<Idp | null>(null);
  loading = signal(true);
  activeTab = signal<'goals' | 'feedback' | 'profile'>('goals');

  feedbackCount() {
    const i = this.idp();
    if (!i) return 0;
    return (i.coachComments ? 1 : 0) + i.notes.length;
  }

  holisticEntries() {
    const h = this.idp()?.holisticEvaluation;
    if (!h) return [];
    return Object.entries(h).map(([key, value]) => ({ key, value }));
  }

  statusLabel(status: string): string {
    if (status === 'active') return 'Active';
    if (status === 'review-due') return 'Review Due';
    if (status === 'completed') return 'Completed';
    return status;
  }

  statusClass(status: string): string {
    if (status === 'active') return 'bg-success-subtle text-success';
    if (status === 'review-due') return 'bg-warning-subtle text-warning';
    if (status === 'completed') return 'bg-secondary-subtle text-secondary';
    return 'bg-secondary-subtle text-secondary';
  }

  progressBarClass(progress: number): string {
    if (progress >= 70) return 'bg-success';
    if (progress >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  goalStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'completed': 'Completed',
    };
    return map[status] ?? status;
  }

  goalStatusBadge(status: string): string {
    if (status === 'on-track') return 'bg-success-subtle text-success';
    if (status === 'in-progress') return 'bg-primary-subtle text-primary';
    if (status === 'at-risk') return 'bg-danger-subtle text-danger';
    if (status === 'completed') return 'bg-secondary-subtle text-secondary';
    return 'bg-secondary-subtle text-secondary';
  }

  noteStatusLabel(status: string): string {
    if (status === 'on-track') return 'On Track';
    if (status === 'needs-attention') return 'Needs Attention';
    if (status === 'exceeding') return 'Exceeding';
    return status;
  }

  noteStatusBadge(status: string): string {
    if (status === 'on-track') return 'bg-success-subtle text-success';
    if (status === 'needs-attention') return 'bg-warning-subtle text-warning';
    if (status === 'exceeding') return 'bg-primary-subtle text-primary';
    return 'bg-secondary-subtle text-secondary';
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  emptyStarsArray(rating: number): number[] {
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
