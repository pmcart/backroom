import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type Step = 'form' | 'success';

interface CreatedAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  temporaryPassword: string;
  emailSent: boolean;
}

interface ProvisionResult {
  club: { id: string; name: string; slug: string };
  admins: CreatedAdmin[];
}

@Component({
  selector: 'app-provision',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="prov-page">
      <div class="prov-card">

        <!-- ── Step: Form ─────────────────────────────────────────── -->
        @if (step() === 'form') {
          <div class="pcard-body">
            <h2 class="section-heading">New Organisation</h2>

            @if (formError()) {
              <div class="alert-error">{{ formError() }}</div>
            }

            <form [formGroup]="orgForm" (ngSubmit)="submit()">

              <div class="section-label">Organisation Details</div>
              <div class="field-group">
                <label class="field-label">Name <span class="req">*</span></label>
                <input type="text" class="field-input" formControlName="name" placeholder="e.g. Shamrock Rovers FC" />
                @if (orgForm.get('name')?.invalid && orgForm.get('name')?.touched) {
                  <div class="field-error">Organisation name is required</div>
                }
              </div>

              <div class="admins-header">
                <div class="section-label mb-0">Admin Users</div>
                <button type="button" class="btn-add" (click)="addAdmin()">+ Add Admin</button>
              </div>

              <div formArrayName="admins">
                @for (admin of adminsArray.controls; track $index) {
                  <div class="admin-card" [formGroupName]="$index">
                    <div class="admin-card-header">
                      <span class="admin-card-title">Admin {{ $index + 1 }}</span>
                      @if (adminsArray.length > 1) {
                        <button type="button" class="btn-remove" (click)="removeAdmin($index)">Remove</button>
                      }
                    </div>
                    <div class="field-row">
                      <div class="field-group flex-1">
                        <label class="field-label">First Name <span class="req">*</span></label>
                        <input type="text" class="field-input" formControlName="firstName" placeholder="First name" />
                        @if (admin.get('firstName')?.invalid && admin.get('firstName')?.touched) {
                          <div class="field-error">Required</div>
                        }
                      </div>
                      <div class="field-group flex-1">
                        <label class="field-label">Last Name <span class="req">*</span></label>
                        <input type="text" class="field-input" formControlName="lastName" placeholder="Last name" />
                        @if (admin.get('lastName')?.invalid && admin.get('lastName')?.touched) {
                          <div class="field-error">Required</div>
                        }
                      </div>
                    </div>
                    <div class="field-group">
                      <label class="field-label">Email <span class="req">*</span></label>
                      <input type="email" class="field-input" formControlName="email" placeholder="admin@club.com" />
                      @if (admin.get('email')?.invalid && admin.get('email')?.touched) {
                        <div class="field-error">Valid email required</div>
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="form-actions">
                <button type="button" class="btn-ghost" (click)="router.navigate(['/superadmin/dashboard'])">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="loading()">
                  @if (loading()) {
                    <span class="spinner"></span>
                  }
                  Create Organisation
                </button>
              </div>
            </form>
          </div>
        }

        <!-- ── Step: Success ──────────────────────────────────────── -->
        @if (step() === 'success' && result()) {
          <div class="pcard-body">
            <div class="success-banner">
              <div class="success-icon">✓</div>
              <div>
                <div class="success-title">Organisation Created</div>
                <div class="success-sub">{{ result()!.club.name }} is ready to use</div>
              </div>
            </div>

            <div class="warning-box">
              <strong>Save these credentials now.</strong>
              Temporary passwords are shown once and cannot be retrieved again.
            </div>

            @for (admin of result()!.admins; track admin.id; let first = $first) {
              <div class="cred-card" [class.cred-card-first]="first">
                <div class="cred-card-header">
                  <span class="cred-name">{{ admin.firstName }} {{ admin.lastName }}</span>
                  @if (admin.emailSent) {
                    <span class="badge-sent">Email sent</span>
                  } @else {
                    <span class="badge-failed">Email failed</span>
                  }
                </div>
                <div class="cred-row">
                  <span class="cred-label">Email</span>
                  <span class="cred-value">{{ admin.email }}</span>
                </div>
                <div class="cred-row">
                  <span class="cred-label">Temp Password</span>
                  <span class="cred-password">{{ admin.temporaryPassword }}</span>
                </div>
              </div>
            }

            <div class="form-actions">
              <button class="btn-ghost" (click)="router.navigate(['/superadmin/dashboard'])">Back to Overview</button>
              <button class="btn-primary" (click)="reset()">Provision Another</button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .prov-page {
      padding: 28px 32px;
    }
    .prov-card {
      width: 100%;
      max-width: 600px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .pcard-body {
      padding: 28px 32px 32px;
    }
    /* Fields */
    .field-group {
      margin-bottom: 14px;
    }
    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .req { color: #f87171; }
    .field-input {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      padding: 9px 12px;
      font-size: 14px;
      color: #1e293b;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    .field-input:focus {
      outline: none;
      border-color: #6366f1;
      background: #fff;
    }
    .field-input::placeholder { color: #94a3b8; }
    .font-mono { font-family: 'Courier New', monospace; }
    .field-error {
      font-size: 11px;
      color: #f87171;
      margin-top: 4px;
    }
    .field-hint {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }
    .field-row {
      display: flex;
      gap: 12px;
    }
    .flex-1 { flex: 1; }
    /* Buttons */
    .btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s;
    }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-ghost {
      background: transparent;
      color: #94a3b8;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .btn-ghost:hover { border-color: #6366f1; color: #f1f5f9; }
    .btn-add {
      background: transparent;
      color: #6366f1;
      border: 1px dashed #4f46e5;
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-add:hover { background: rgba(99,102,241,0.1); }
    .btn-remove {
      background: transparent;
      color: #f87171;
      border: none;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 6px;
    }
    .w-full { width: 100%; }
    .mt-4 { margin-top: 16px; }
    /* Sections */
    .section-heading {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px;
    }
    .section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      margin-bottom: 12px;
    }
    .mb-0 { margin-bottom: 0; }
    .admins-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      margin-top: 8px;
    }
    .admin-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .admin-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .admin-card-title {
      font-size: 12px;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    /* Success */
    .success-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(16,185,129,0.1);
      border: 1px solid #10b981;
      border-radius: 10px;
      padding: 16px 18px;
      margin-bottom: 16px;
    }
    .success-icon {
      width: 44px;
      height: 44px;
      min-width: 44px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }
    .success-title {
      font-size: 16px;
      font-weight: 700;
      color: #10b981;
      margin: 0 0 2px;
    }
    .success-sub {
      font-size: 13px;
      color: #94a3b8;
    }
    .cred-card-first {
      border-color: #4f46e5 !important;
      box-shadow: 0 0 0 1px #4f46e5;
    }
    .result-org-slug {
      font-size: 12px;
      color: #64748b;
      font-family: 'Courier New', monospace;
      margin-top: 3px;
    }
    .warning-box {
      background: #1c1207;
      border: 1px solid #92400e;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 13px;
      color: #fbbf24;
      margin-bottom: 16px;
    }
    .warning-box strong { display: block; margin-bottom: 3px; }
    .cred-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 10px;
    }
    .cred-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .cred-name {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }
    .badge-sent {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16,185,129,0.1);
      border-radius: 999px;
      padding: 2px 8px;
    }
    .badge-failed {
      font-size: 11px;
      font-weight: 700;
      color: #f87171;
      background: rgba(248,113,113,0.1);
      border-radius: 999px;
      padding: 2px 8px;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .cred-row:last-child { border-bottom: none; }
    .cred-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cred-value {
      font-size: 13px;
      color: #cbd5e1;
      font-family: 'Courier New', monospace;
    }
    .cred-password {
      font-size: 13px;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      color: #fbbf24;
      background: rgba(251,191,36,0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
    /* Misc */
    .alert-error {
      background: rgba(239,68,68,0.1);
      border: 1px solid #ef4444;
      border-radius: 7px;
      color: #f87171;
      font-size: 13px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ProvisionComponent {
  private fb   = inject(FormBuilder);
  private http = inject(HttpClient);
  router = inject(Router);

  step      = signal<Step>('form');
  loading   = signal(false);
  formError = signal<string | null>(null);
  result    = signal<ProvisionResult | null>(null);

  orgForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    admins: this.fb.array([this.newAdminGroup()]),
  });

  get adminsArray(): FormArray {
    return this.orgForm.get('admins') as FormArray;
  }

  newAdminGroup() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
    });
  }

  addAdmin() {
    this.adminsArray.push(this.newAdminGroup());
  }

  removeAdmin(i: number) {
    this.adminsArray.removeAt(i);
  }

  submit() {
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.formError.set(null);

    const { name, admins } = this.orgForm.getRawValue();

    this.http.post<ProvisionResult>('/api/superadmin/provision', {
      organization: { name },
      admins,
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.step.set('success');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message;
        this.formError.set(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong'));
      },
    });
  }

  reset() {
    this.orgForm.reset();
    while (this.adminsArray.length > 1) this.adminsArray.removeAt(1);
    this.result.set(null);
    this.step.set('form');
  }
}
