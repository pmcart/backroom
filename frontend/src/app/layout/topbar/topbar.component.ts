import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { MobileMenuService } from '../../core/services/mobile-menu.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe, DatePipe, RouterLink],
  template: `
    <header class="topbar">
      @if (authService.role !== 'player') {
        <button class="mobile-menu-btn" (click)="mobileMenu.toggle()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      }
      <span class="topbar-title">{{ pageTitle$ | async }}</span>

      <div class="ms-auto d-flex align-items-center gap-3">

        <!-- ── Impersonation banner ───────────────────────────────────────── -->
        @if (authService.isImpersonating()) {
          <div class="impersonation-banner">
            <span class="impersonation-icon">👁</span>
            <span>Viewing as <strong>{{ authService.currentUser()?.clubName }}</strong></span>
            <button class="impersonation-exit" (click)="authService.exitImpersonation()">Exit</button>
          </div>
        }

        <!-- ── Notification Bell (coach only) ────────────────────────────── -->
        @if (authService.currentUser()?.role === 'coach') {
          <div class="notif-wrap position-relative" (click)="$event.stopPropagation()">
            <button class="notif-bell-btn" [class.notif-bell-active]="notifOpen()" (click)="toggleNotif()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              @if (notifications.count() > 0) {
                <span class="notif-badge" [class.notif-badge-urgent]="notifications.hasOverdue()">
                  {{ notifications.count() > 9 ? '9+' : notifications.count() }}
                </span>
              }
            </button>

            @if (notifOpen()) {
              <div class="notif-panel">
                <div class="notif-panel-header">
                  <span class="notif-panel-title">IDP Notifications</span>
                  @if (notifications.count() > 0) {
                    <button class="notif-clear-all" (click)="clearAll()">Dismiss all</button>
                  }
                </div>

                @if (notifications.notifications().length === 0) {
                  <div class="notif-empty">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3; margin-bottom:6px">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p>All caught up — no upcoming IDP dates.</p>
                  </div>
                } @else {
                  <ul class="notif-list">
                    @for (n of notifications.notifications(); track n.id) {
                      <li class="notif-item" [class.notif-overdue]="n.daysUntil < 0" [class.notif-urgent]="n.daysUntil >= 0 && n.daysUntil <= 2">
                        <div class="notif-item-icon">
                          {{ n.type === 'review-due' ? '🕐' : '🎯' }}
                        </div>
                        <div class="notif-item-body">
                          <div class="notif-item-player">{{ n.playerName }}</div>
                          <div class="notif-item-detail">
                            {{ n.type === 'review-due' ? 'IDP Review Due' : 'Target Completion' }}
                            · {{ n.squad }}
                          </div>
                          <div class="notif-item-date" [class.text-danger]="n.daysUntil < 0">
                            @if (n.daysUntil < 0) {
                              {{ n.daysUntil * -1 }} day{{ n.daysUntil < -1 ? 's' : '' }} overdue
                            } @else if (n.daysUntil === 0) {
                              Due today
                            } @else if (n.daysUntil === 1) {
                              Due tomorrow
                            } @else {
                              In {{ n.daysUntil }} days · {{ n.date | date:'d MMM yyyy' }}
                            }
                          </div>
                        </div>
                        <button class="notif-dismiss-btn" title="Dismiss" (click)="dismiss(n.id)">✕</button>
                      </li>
                    }
                  </ul>
                  <div class="notif-footer">
                    <a [routerLink]="['/coach/idp']" class="notif-footer-link" (click)="notifOpen.set(false)">
                      View all IDPs →
                    </a>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- ── User profile chip ─────────────────────────────────────────── -->
        <div class="user-chip">
          <span
            class="badge"
            [style.background]="roleBg(authService.currentUser()?.role)"
            style="font-size:0.65rem; padding:3px 7px; border-radius:4px;"
          >
            {{ authService.currentUser()?.role | uppercase }}
          </span>
          <span class="fw-semibold small" style="color:#212529;">
            {{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}
          </span>
        </div>

      </div>
    </header>

    <style>
      .impersonation-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fffbeb;
        border: 1px solid #fcd34d;
        border-radius: 8px;
        padding: 5px 12px;
        font-size: 0.8rem;
        color: #92400e;
      }
      .impersonation-icon { font-size: 0.9rem; }
      .impersonation-exit {
        background: #f59e0b;
        border: none;
        border-radius: 5px;
        color: #fff;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 2px 8px;
        cursor: pointer;
        margin-left: 4px;
        transition: background 0.15s;
      }
      .impersonation-exit:hover { background: #d97706; }
      .user-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f1f3f5;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 6px 12px;
      }
      .notif-bell-btn {
        position: relative;
        background: none;
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 6px 8px;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
      }
      .notif-bell-btn:hover, .notif-bell-active {
        background: #f1f3f5;
        border-color: #dee2e6;
        color: #212529;
      }
      .notif-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        min-width: 16px;
        height: 16px;
        background: #4361ee;
        color: #fff;
        font-size: 0.6rem;
        font-weight: 700;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 3px;
        line-height: 1;
      }
      .notif-badge-urgent { background: #ef4444; }
      .notif-panel {
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        width: 320px;
        max-height: 420px;
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        z-index: 1050;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .notif-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 10px;
        border-bottom: 1px solid #f1f5f9;
        background: #f8fafc;
        flex-shrink: 0;
      }
      .notif-panel-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .notif-clear-all {
        background: none;
        border: none;
        font-size: 0.72rem;
        color: #94a3b8;
        cursor: pointer;
        padding: 0;
      }
      .notif-clear-all:hover { color: #4361ee; }
      .notif-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 28px 20px;
        color: #94a3b8;
        text-align: center;
      }
      .notif-empty p { font-size: 0.8rem; margin: 0; }
      .notif-list {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        flex: 1;
      }
      .notif-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.1s;
      }
      .notif-item:hover { background: #f8fafc; }
      .notif-item:last-child { border-bottom: none; }
      .notif-overdue { border-left: 3px solid #ef4444; }
      .notif-urgent  { border-left: 3px solid #f59e0b; }
      .notif-item-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
      .notif-item-body { flex: 1; min-width: 0; }
      .notif-item-player { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
      .notif-item-detail { font-size: 0.73rem; color: #64748b; margin-top: 1px; }
      .notif-item-date   { font-size: 0.72rem; font-weight: 600; color: #94a3b8; margin-top: 2px; }
      .notif-dismiss-btn {
        background: none;
        border: none;
        color: #cbd5e1;
        cursor: pointer;
        font-size: 0.7rem;
        padding: 2px 4px;
        flex-shrink: 0;
        border-radius: 3px;
        transition: color 0.1s, background 0.1s;
      }
      .notif-dismiss-btn:hover { color: #64748b; background: #f1f5f9; }
      .notif-footer {
        padding: 8px 14px;
        border-top: 1px solid #f1f5f9;
        background: #f8fafc;
        flex-shrink: 0;
      }
      .notif-footer-link {
        font-size: 0.75rem;
        color: #4361ee;
        text-decoration: none;
        font-weight: 600;
      }
      .notif-footer-link:hover { text-decoration: underline; }
    </style>
  `,
})
export class TopbarComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  authService   = inject(AuthService);
  notifications = inject(NotificationService);
  mobileMenu    = inject(MobileMenuService);

  notifOpen = signal(false);

  pageTitle$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.getDeepestTitle(this.activatedRoute)),
  );

  private getDeepestTitle(route: ActivatedRoute): string {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current.snapshot.data['title'] ?? 'Backroom';
  }

  toggleNotif() {
    this.notifOpen.update((v) => !v);
  }

  dismiss(id: string) {
    this.notifications.dismiss(id);
  }

  clearAll() {
    this.notifications.dismissAll();
    this.notifOpen.set(false);
  }

  @HostListener('document:click')
  closeAll() {
    this.notifOpen.set(false);
  }

  roleBg(role: string | null | undefined): string {
    switch (role) {
      case 'superadmin': return '#1e293b';
      case 'admin':      return '#4361ee';
      case 'coach':      return '#2a9d8f';
      case 'player':     return '#e76f51';
      default:           return '#6c757d';
    }
  }
}
