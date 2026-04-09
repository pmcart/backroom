import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

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
  { name: 'Patrick O\'Brien', email: 'coach.o-brien@corkcity.com',  role: 'coach',  club: 'Cork City FC' },
  { name: 'Conor Hayes',     email: 'conor.hayes@corkcity.com',     role: 'player', club: 'Cork City FC' },
  { name: 'Rory Lynch',      email: 'rory.lynch@corkcity.com',      role: 'player', club: 'Cork City FC' },
  { name: 'Eoin O\'Sullivan', email: 'eoin.o-sullivan@corkcity.com', role: 'player', club: 'Cork City FC' },
  { name: 'Darragh Power',   email: 'darragh.power@corkcity.com',   role: 'player', club: 'Cork City FC' },
];

const CLUBS = ['Shelbourne FC', 'Cork City FC'];

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe],
  template: `
    <header class="topbar">
      <span class="topbar-title">{{ pageTitle$ | async }}</span>

      <div class="ms-auto d-flex align-items-center gap-3">

        <!-- Switch Role Dropdown -->
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
  `,
})
export class TopbarComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);

  open = signal(false);
  switching = signal(false);

  clubs = CLUBS;
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
  }

  @HostListener('document:click')
  closeDropdown() {
    this.open.set(false);
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
