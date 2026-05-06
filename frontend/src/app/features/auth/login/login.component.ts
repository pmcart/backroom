import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div style="width:260px; overflow:hidden; margin:0 auto 4px;">
          <img src="/img/backroom-logo.png" alt="Backroom" style="width:100%; display:block;" />
        </div>

        @if (error()) {
          <div class="alert alert-danger py-2 small">{{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label fw-semibold small">Email</label>
            <input type="email" class="form-control" formControlName="email" placeholder="you@club.com" autocomplete="email" />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <div class="text-danger small mt-1">Valid email required</div>
            }
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold small">Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••••" autocomplete="current-password" />
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <div class="text-danger small mt-1">Password must be at least 8 characters</div>
            }
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-border spinner-border-sm me-2"></span>
            }
            Sign in
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);
  loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading.set(false);
        const route = res.user.role === 'superadmin' ? '/superadmin/dashboard' : `/${res.user.role}/dashboard`;
        this.router.navigate([route]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Login failed. Please try again.');
      },
    });
  }
}
