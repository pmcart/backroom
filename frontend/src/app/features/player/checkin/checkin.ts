import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WellnessService } from '../../../core/services/wellness.service';

const WELLNESS_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  styleUrl: './checkin.scss',
  template: `
    @if (step() < 5) {
      <!-- Progress bar -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">Daily Check-in</h5>
          <span class="text-muted small">Step {{ step() }} of 4</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar bg-primary" [style.width.%]="step() * 25"></div>
        </div>
      </div>

      <!-- Step indicators -->
      <div class="d-flex gap-2 mb-4">
        @for (s of [1,2,3,4]; track s) {
          <div
            class="rounded-circle d-flex align-items-center justify-content-center fw-semibold small"
            style="width: 32px; height: 32px; flex-shrink: 0;"
            [class]="s < step() ? 'bg-primary text-white' : s === step() ? 'bg-primary text-white' : 'bg-light text-muted border'"
          >
            @if (s < step()) { ✓ } @else { {{ s }} }
          </div>
          @if (s < 4) {
            <div class="flex-grow-1 d-flex align-items-center">
              <div class="w-100 border-top" [class.border-primary]="s < step()"></div>
            </div>
          }
        }
      </div>
    }

    <!-- ── Step 1: Wellness ─────────────────────────────────────────── -->
    @if (step() === 1) {
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <h6 class="fw-semibold mb-1">Wellness</h6>
          <p class="text-muted small mb-4">Rate each area from 1 (poor) to 5 (excellent)</p>

          @for (metric of wellnessMetrics; track metric.key) {
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label class="fw-medium small">{{ metric.label }}</label>
                <span class="badge bg-primary-subtle text-primary small">
                  {{ LABELS[wellnessValues()[metric.key] ?? 3] }}
                </span>
              </div>
              <input
                type="range" class="form-range" min="1" max="5" step="1"
                [value]="wellnessValues()[metric.key]"
                (input)="setWellness(metric.key, +$any($event.target).value)"
              >
              <div class="d-flex justify-content-between text-muted" style="font-size: 0.7rem;">
                <span>Poor</span><span>Excellent</span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="d-grid d-sm-flex justify-content-sm-end">
        <button class="btn btn-primary" (click)="step.set(2)">Next</button>
      </div>
    }

    <!-- ── Step 2: Nutrition ────────────────────────────────────────── -->
    @if (step() === 2) {
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <h6 class="fw-semibold mb-1">Nutrition</h6>
          <p class="text-muted small mb-4">Log your meals and hydration for today</p>

          <!-- Meals -->
          <div class="mb-4">
            <p class="fw-medium small mb-2">Meals</p>
            <div class="d-flex flex-column gap-2">
              @for (meal of meals; track meal.key) {
                <div class="d-flex align-items-center justify-content-between">
                  <span class="small">{{ meal.label }}</span>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn"
                      [class]="mealValues()[meal.key] === 'yes' ? 'btn-success' : 'btn-outline-secondary'"
                      (click)="setMeal(meal.key, 'yes')"
                    >Had it</button>
                    <button
                      class="btn"
                      [class]="mealValues()[meal.key] === 'skipped' ? 'btn-danger' : 'btn-outline-secondary'"
                      (click)="setMeal(meal.key, 'skipped')"
                    >Skipped</button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Snacks -->
          <div class="mb-4">
            <p class="fw-medium small mb-2">Snacks</p>
            <div class="btn-group w-100">
              @for (opt of snackOptions; track opt.value) {
                <button
                  class="btn btn-sm"
                  [class]="snacks() === opt.value ? 'btn-primary' : 'btn-outline-secondary'"
                  (click)="snacks.set(opt.value)"
                >{{ opt.label }}</button>
              }
            </div>
          </div>

          <!-- Water -->
          <div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="fw-medium small">Water intake</label>
              <span class="badge bg-primary-subtle text-primary small">{{ waterIntake() }}L</span>
            </div>
            <input
              type="range" class="form-range" min="0" max="4" step="0.5"
              [value]="waterIntake()"
              (input)="waterIntake.set(+$any($event.target).value)"
            >
            <div class="d-flex justify-content-between text-muted" style="font-size: 0.7rem;">
              <span>0L</span><span>4L</span>
            </div>
          </div>
        </div>
      </div>

      <div class="d-grid d-sm-flex justify-content-sm-between gap-2">
        <button class="btn btn-outline-secondary" (click)="step.set(1)">Back</button>
        <button class="btn btn-primary" (click)="step.set(3)">Next</button>
      </div>
    }

    <!-- ── Step 3: Sleep ────────────────────────────────────────────── -->
    @if (step() === 3) {
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <h6 class="fw-semibold mb-1">Sleep</h6>
          <p class="text-muted small mb-4">Tell us about last night's sleep</p>

          <!-- Hours slept -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="fw-medium small">Hours slept</label>
              <span class="badge bg-primary-subtle text-primary small">{{ hoursSlept() }}h</span>
            </div>
            <input
              type="range" class="form-range" min="3" max="12" step="0.5"
              [value]="hoursSlept()"
              (input)="hoursSlept.set(+$any($event.target).value)"
            >
            <div class="d-flex justify-content-between text-muted" style="font-size: 0.7rem;">
              <span>3h</span><span>12h</span>
            </div>
          </div>

          <!-- Bedtime & Wake time -->
          <div class="row g-3 mb-4">
            <div class="col-6">
              <label class="form-label small fw-medium">Bedtime</label>
              <input
                type="time" class="form-control form-control-sm"
                [value]="bedtime()"
                (change)="bedtime.set($any($event.target).value)"
              >
            </div>
            <div class="col-6">
              <label class="form-label small fw-medium">Wake time</label>
              <input
                type="time" class="form-control form-control-sm"
                [value]="wakeTime()"
                (change)="wakeTime.set($any($event.target).value)"
              >
            </div>
          </div>

          <!-- Notes to coach -->
          <div>
            <label class="form-label small fw-medium">Notes to coach <span class="text-muted">(optional)</span></label>
            <textarea
              class="form-control form-control-sm" rows="3"
              placeholder="Anything you'd like your coach to know…"
              [value]="notesToCoach()"
              (input)="notesToCoach.set($any($event.target).value)"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="d-grid d-sm-flex justify-content-sm-between gap-2">
        <button class="btn btn-outline-secondary" (click)="step.set(2)">Back</button>
        <button class="btn btn-primary" (click)="step.set(4)">Review</button>
      </div>
    }

    <!-- ── Step 4: Review ───────────────────────────────────────────── -->
    @if (step() === 4) {
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <h6 class="fw-semibold mb-3">Review your check-in</h6>

          <div class="mb-3">
            <p class="text-muted small fw-semibold text-uppercase mb-2" style="letter-spacing: .05em;">Wellness</p>
            <div class="row g-2">
              @for (metric of wellnessMetrics; track metric.key) {
                <div class="col-6">
                  <div class="d-flex justify-content-between small">
                    <span class="text-muted">{{ metric.label }}</span>
                    <span class="fw-semibold">{{ wellnessValues()[metric.key] }}/5</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <hr class="my-3">

          <div class="mb-3">
            <p class="text-muted small fw-semibold text-uppercase mb-2" style="letter-spacing: .05em;">Nutrition</p>
            <div class="row g-2 small">
              @for (meal of meals; track meal.key) {
                <div class="col-4">
                  <span class="text-muted">{{ meal.label }}:</span>
                  <span class="fw-semibold ms-1" [class]="mealValues()[meal.key] === 'skipped' ? 'text-danger' : 'text-success'">
                    {{ mealValues()[meal.key] === 'yes' ? 'Had it' : 'Skipped' }}
                  </span>
                </div>
              }
              <div class="col-6">
                <span class="text-muted">Snacks:</span>
                <span class="fw-semibold ms-1 text-capitalize">{{ snacks() }}</span>
              </div>
              <div class="col-6">
                <span class="text-muted">Water:</span>
                <span class="fw-semibold ms-1">{{ waterIntake() }}L</span>
              </div>
            </div>
          </div>

          <hr class="my-3">

          <div>
            <p class="text-muted small fw-semibold text-uppercase mb-2" style="letter-spacing: .05em;">Sleep</p>
            <div class="row g-2 small">
              <div class="col-6">
                <span class="text-muted">Hours slept:</span>
                <span class="fw-semibold ms-1">{{ hoursSlept() }}h</span>
              </div>
              @if (bedtime()) {
                <div class="col-6">
                  <span class="text-muted">Bedtime:</span>
                  <span class="fw-semibold ms-1">{{ bedtime() }}</span>
                </div>
              }
              @if (wakeTime()) {
                <div class="col-6">
                  <span class="text-muted">Wake time:</span>
                  <span class="fw-semibold ms-1">{{ wakeTime() }}</span>
                </div>
              }
              @if (notesToCoach()) {
                <div class="col-12">
                  <span class="text-muted">Notes:</span>
                  <span class="ms-1">{{ notesToCoach() }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      @if (error()) {
        <div class="alert alert-danger small py-2 mb-3">{{ error() }}</div>
      }

      <div class="d-grid d-sm-flex justify-content-sm-between gap-2">
        <button class="btn btn-outline-secondary" (click)="step.set(3)" [disabled]="submitting()">Back</button>
        <button class="btn btn-primary" (click)="submit()" [disabled]="submitting()">
          @if (submitting()) {
            <span class="spinner-border spinner-border-sm me-1"></span> Saving…
          } @else {
            Submit Check-in
          }
        </button>
      </div>
    }

    <!-- ── Step 5: Success ──────────────────────────────────────────── -->
    @if (step() === 5) {
      <div class="text-center mb-4">
        <div class="display-4 mb-2">
          @if (overallLevel() === 'green') { ✅ }
          @else if (overallLevel() === 'amber') { ⚠️ }
          @else { 🔴 }
        </div>
        <h5 class="fw-bold">Check-in Complete!</h5>
        <p class="text-muted small">{{ overallMessage() }}</p>
        <div class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-2"
          [class]="overallBadgeClass()">
          <span class="fw-semibold">{{ overallLabel() }}</span>
        </div>
      </div>

      <!-- Streak -->
      @if (streak() > 0) {
        <div class="card border-0 shadow-sm mb-3 text-center py-3">
          <div class="fs-2 mb-1">🔥</div>
          <div class="fs-4 fw-bold">{{ streak() }}-day streak</div>
          <div class="text-muted small">Keep it going!</div>
        </div>
      }

      <!-- Per-metric feedback -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h6 class="fw-semibold mb-3">Your Feedback</h6>
          <div class="d-flex flex-column gap-3">
            @for (item of feedback(); track item.label) {
              <div class="d-flex gap-3 align-items-start">
                <span class="badge mt-1 flex-shrink-0" [class]="item.badgeClass">{{ item.score }}/5</span>
                <div>
                  <div class="fw-medium small">{{ item.label }}</div>
                  <div class="text-muted small">{{ item.message }}</div>
                </div>
              </div>
            }
            @if (hoursSlept() < 7) {
              <div class="d-flex gap-3 align-items-start">
                <span class="badge mt-1 flex-shrink-0 bg-warning-subtle text-warning">Sleep</span>
                <div>
                  <div class="fw-medium small">Sleep Duration</div>
                  <div class="text-muted small">You slept {{ hoursSlept() }}h — aim for 8–9 hours for optimal recovery and performance.</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-center">
        <a routerLink="/player/dashboard" class="btn btn-primary">Back to Dashboard</a>
      </div>
    }
  `,
})
export class Checkin implements OnInit {
  private wellnessService = inject(WellnessService);

  readonly LABELS = WELLNESS_LABELS;

  step = signal(1);
  submitting = signal(false);
  error = signal('');
  streak = signal(0);

  // Step 1 — Wellness
  wellnessValues = signal<Record<string, number>>({
    sleepQuality: 3,
    nutrition: 3,
    hydration: 3,
    recovery: 3,
    mood: 3,
  });

  wellnessMetrics = [
    { key: 'sleepQuality', label: 'Sleep Quality' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'hydration', label: 'Hydration' },
    { key: 'recovery', label: 'Recovery' },
    { key: 'mood', label: 'Mood' },
  ];

  setWellness(key: string, value: number) {
    this.wellnessValues.update((v) => ({ ...v, [key]: value }));
  }

  // Step 2 — Nutrition
  mealValues = signal<Record<string, string>>({
    breakfast: 'yes',
    lunch: 'yes',
    dinner: 'yes',
  });

  meals = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
  ];

  snackOptions = [
    { value: 'healthy', label: 'Healthy' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'processed', label: 'Processed' },
  ];

  snacks = signal('healthy');
  waterIntake = signal(2);

  setMeal(key: string, value: string) {
    this.mealValues.update((v) => ({ ...v, [key]: value }));
  }

  // Step 3 — Sleep
  hoursSlept = signal(8);
  bedtime = signal('22:30');
  wakeTime = signal('06:30');
  notesToCoach = signal('');

  // Step 5 — Result
  overallLevel = signal<'green' | 'amber' | 'red'>('green');

  overallMessage = computed(() => {
    const l = this.overallLevel();
    if (l === 'green') return 'You\'re in great shape today. Keep up the excellent work!';
    if (l === 'amber') return 'Some areas to monitor — a few small improvements could make a big difference.';
    return 'Your wellness needs some attention. Consider speaking to your coach.';
  });

  overallLabel = computed(() => {
    const l = this.overallLevel();
    if (l === 'green') return 'All good';
    if (l === 'amber') return 'Monitor';
    return 'Needs attention';
  });

  overallBadgeClass = computed(() => {
    const l = this.overallLevel();
    if (l === 'green') return 'bg-success-subtle text-success';
    if (l === 'amber') return 'bg-warning-subtle text-warning';
    return 'bg-danger-subtle text-danger';
  });

  feedback = computed(() => {
    const v = this.wellnessValues();
    return this.wellnessMetrics.map(({ key, label }) => {
      const score = v[key];
      return { label, score, ...this.getFeedback(key, score) };
    });
  });

  private getFeedback(key: string, score: number): { message: string; badgeClass: string } {
    const badgeClass =
      score >= 4 ? 'bg-success-subtle text-success' :
      score >= 3 ? 'bg-primary-subtle text-primary' :
      'bg-warning-subtle text-warning';

    const messages: Record<string, Record<string, string>> = {
      sleepQuality: {
        low: 'Sleep quality is low — try a consistent bedtime and avoid screens before sleep.',
        mid: 'Sleep quality is average — a little improvement could boost your performance.',
        high: 'Great sleep quality! Keep up the healthy sleep habits.',
      },
      nutrition: {
        low: 'Your nutrition needs attention — fuel your body with balanced meals.',
        mid: 'Nutrition is average — try to include more protein and vegetables.',
        high: 'Excellent nutrition! Your diet is supporting your performance.',
      },
      hydration: {
        low: 'You\'re not hydrated enough — aim for at least 2L of water daily.',
        mid: 'Hydration is average — try to drink water more consistently throughout the day.',
        high: 'Well hydrated! Staying on top of your fluid intake is great for recovery.',
      },
      recovery: {
        low: 'Your body needs more recovery — prioritise rest and consider some stretching.',
        mid: 'Recovery is moderate — make sure you\'re getting enough sleep and rest days.',
        high: 'Excellent recovery! Your body is bouncing back well.',
      },
      mood: {
        low: 'Your mood seems low — don\'t hesitate to speak to your coach if something is bothering you.',
        mid: 'Mood is average — try to find something positive to focus on today.',
        high: 'Great mindset! A positive attitude helps on and off the pitch.',
      },
    };

    const tier = score <= 2 ? 'low' : score === 3 ? 'mid' : 'high';
    return { message: messages[key]?.[tier] ?? '', badgeClass };
  }

  submit() {
    this.submitting.set(true);
    this.error.set('');
    const v = this.wellnessValues();
    const m = this.mealValues();

    this.wellnessService.submitCheckin({
      sleepQuality: v['sleepQuality'],
      nutrition: v['nutrition'],
      hydration: v['hydration'],
      recovery: v['recovery'],
      mood: v['mood'],
      breakfast: m['breakfast'],
      lunch: m['lunch'],
      dinner: m['dinner'],
      snacks: this.snacks(),
      waterIntake: this.waterIntake(),
      hoursSlept: this.hoursSlept(),
      bedtime: this.bedtime() || undefined,
      wakeTime: this.wakeTime() || undefined,
      notesToCoach: this.notesToCoach() || undefined,
    }).subscribe({
      next: (result) => {
        this.overallLevel.set(result.overallLevel);
        this.submitting.set(false);
        this.step.set(5);
        this.wellnessService.getStreak().subscribe((s) => this.streak.set(s));
      },
      error: () => {
        this.error.set('Something went wrong saving your check-in. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  ngOnInit() {
    this.wellnessService.getStreak().subscribe((s) => this.streak.set(s));
  }
}
