import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

interface DemoUser {
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'player';
  club: string;
}

const DEMO_USERS: DemoUser[] = [
  // Shelbourne FC
  { name: 'Niall Quinn',    email: 'admin@shelbourne.com',         role: 'admin',  club: 'Shelbourne FC' },
  { name: 'Tommy Davis',    email: 'coach.davis@shelbourne.com',   role: 'coach',  club: 'Shelbourne FC' },
  { name: 'Sean Murphy',    email: 'coach.murphy@shelbourne.com',  role: 'coach',  club: 'Shelbourne FC' },
  { name: 'Aaron Connolly', email: 'aaron.connolly@shelbourne.com', role: 'player', club: 'Shelbourne FC' },
  { name: 'Liam Kelly',     email: 'liam.kelly@shelbourne.com',    role: 'player', club: 'Shelbourne FC' },
  { name: 'Cian Byrne',     email: 'cian.byrne@shelbourne.com',    role: 'player', club: 'Shelbourne FC' },
  { name: 'Fionn Walsh',    email: 'fionn.walsh@shelbourne.com',   role: 'player', club: 'Shelbourne FC' },
  // Cork City FC
  { name: 'Damien Duff',     email: 'admin@corkcity.com',           role: 'admin',  club: 'Cork City FC' },
  { name: 'James Ryan',      email: 'coach.ryan@corkcity.com',      role: 'coach',  club: 'Cork City FC' },
  { name: "Patrick O'Brien", email: 'coach.o-brien@corkcity.com',  role: 'coach',  club: 'Cork City FC' },
  { name: 'Conor Hayes',     email: 'conor.hayes@corkcity.com',     role: 'player', club: 'Cork City FC' },
  { name: 'Rory Lynch',      email: 'rory.lynch@corkcity.com',      role: 'player', club: 'Cork City FC' },
  { name: "Eoin O'Sullivan", email: 'eoin.o-sullivan@corkcity.com', role: 'player', club: 'Cork City FC' },
  { name: 'Darragh Power',   email: 'darragh.power@corkcity.com',   role: 'player', club: 'Cork City FC' },
];

const CLUBS = ['Shelbourne FC', 'Cork City FC'];

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe, DatePipe, RouterLink],
  template: `
    <header class="topbar">
      <span class="topbar-title">{{ pageTitle$ | async }}</span>

      <div class="ms-auto d-flex align-items-center gap-3">

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

        <!-- ── Switch Role Dropdown ──────────────────────────────────────── -->
        <div class="position-relative" (click)="$event.stopPropagation()">
          <button
            class="btn btn-sm d-flex align-items-center gap-2"
            style="background:#f1f3f5; border:1px solid #dee2e6; border-radius:8px; padding:6px 12px;"
            (click)="toggleDropdown()"
          >
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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:0.5;">
              <path d="M2 4l4 4 4-4" stroke="#212529" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          @if (open()) {
            <div
              class="position-absolute end-0 shadow-lg"
              style="top:calc(100% + 6px); width:280px; background:#fff; border:1px solid #dee2e6; border-radius:10px; z-index:1050; overflow:hidden;"
            >
              <div style="padding:8px 12px 6px; background:#f8f9fa; border-bottom:1px solid #dee2e6;">
                <small class="text-muted fw-semibold" style="font-size:0.65rem; letter-spacing:0.06em; text-transform:uppercase;">Switch Account</small>
              </div>

              @for (club of clubs; track club) {
                <div style="padding:6px 0 2px;">
                  <div style="padding:4px 12px 2px;">
                    <small class="text-muted fw-semibold" style="font-size:0.65rem; letter-spacing:0.04em; text-transform:uppercase;">{{ club }}</small>
                  </div>
                  @for (user of usersForClub(club); track user.email) {
                    <button
                      class="w-100 text-start border-0 d-flex align-items-center gap-2 switch-user-btn"
                      [class.active-user]="authService.currentUser()?.email === user.email"
                      [disabled]="switching()"
                      (click)="switchTo(user)"
                    >
                      <span
                        class="badge flex-shrink-0"
                        [style.background]="roleBg(user.role)"
                        style="font-size:0.6rem; width:48px; text-align:center; border-radius:4px;"
                      >{{ user.role | uppercase }}</span>
                      <span class="small fw-semibold" style="color:#212529;">{{ user.name }}</span>
                      @if (authService.currentUser()?.email === user.email) {
                        <span class="ms-auto" style="font-size:0.65rem; color:#4361ee;">&#10003;</span>
                      }
                    </button>
                  }
                </div>
                @if (club !== clubs[clubs.length - 1]) {
                  <hr style="margin:4px 0; border-color:#dee2e6;" />
                }
              }

              @if (switching()) {
                <div style="padding:8px 12px; text-align:center; border-top:1px solid #dee2e6;">
                  <small class="text-muted">Switching...</small>
                </div>
              }
            </div>
          }
        </div>

      </div>
    </header>

    <!-- Inline styles scoped to topbar -->
    <style>
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

  open      = signal(false);
  notifOpen = signal(false);
  switching = signal(false);

  clubs     = CLUBS;
  demoUsers = DEMO_USERS;

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

  toggleDropdown() {
    this.open.update((v) => !v);
    this.notifOpen.set(false);
  }

  toggleNotif() {
    this.notifOpen.update((v) => !v);
    this.open.set(false);
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
    this.open.set(false);
    this.notifOpen.set(false);
  }

  usersForClub(club: string): DemoUser[] {
    return this.demoUsers.filter((u) => u.club === club);
  }

  roleBg(role: string | null | undefined): string {
    switch (role) {
      case 'admin':  return '#4361ee';
      case 'coach':  return '#2a9d8f';
      case 'player': return '#e76f51';
      default:       return '#6c757d';
    }
  }

  switchTo(user: DemoUser) {
    if (this.authService.currentUser()?.email === user.email) {
      this.open.set(false);
      return;
    }
    this.switching.set(true);
    this.authService.login(user.email, 'Password1').subscribe({
      next: () => {
        this.switching.set(false);
        this.open.set(false);
        this.router.navigate([`/${user.role}/dashboard`]);
      },
      error: () => {
        this.switching.set(false);
      },
    });
  }
}
