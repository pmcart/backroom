import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar d-flex flex-column">
      <div class="sidebar-brand">
        <span>&#9918; Backroom</span>
      </div>

      <div class="flex-grow-1 py-2">
        @if (sectionLabel()) {
          <div class="nav-section-label">{{ sectionLabel() }}</div>
        }
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-link"
          >
            <i [class]="'bi ' + item.icon"></i>
            {{ item.label }}
          </a>
        }
      </div>

      <div class="p-3 border-top border-secondary border-opacity-25">
        <div class="d-flex align-items-center gap-2 mb-2">
          <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
               style="width:32px;height:32px;font-size:0.8rem;flex-shrink:0">
            {{ initials() }}
          </div>
          <div style="overflow:hidden">
            <div class="text-white small fw-semibold text-truncate">{{ fullName() }}</div>
            <div class="text-muted" style="font-size:0.7rem;text-transform:capitalize">{{ auth.role }}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-secondary w-100" (click)="auth.logout()">Sign out</button>
      </div>
    </nav>
  `,
})
export class SidebarComponent {
  auth = inject(AuthService);

  fullName = computed(() => {
    const u = this.auth.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  initials = computed(() => {
    const u = this.auth.currentUser();
    return u ? `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() : '';
  });

  sectionLabel = computed(() => {
    const role = this.auth.role;
    if (role === 'admin') return 'Academy Admin';
    if (role === 'coach') return 'Coaching';
    if (role === 'player') return 'My Space';
    return '';
  });

  navItems = computed<NavItem[]>(() => {
    const role = this.auth.role;
    if (role === 'admin') return ADMIN_NAV;
    if (role === 'coach') return COACH_NAV;
    if (role === 'player') return PLAYER_NAV;
    return [];
  });
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard' },
  { label: 'Squads', icon: 'bi-people-fill', route: '/admin/squads' },
  { label: 'IDP Management', icon: 'bi-person-lines-fill', route: '/admin/idp' },
  { label: 'Planning Overview', icon: 'bi-calendar3', route: '/admin/planning' },
  { label: 'Monitoring', icon: 'bi-heart-pulse-fill', route: '/admin/monitoring' },
  { label: 'Education Hub', icon: 'bi-mortarboard-fill', route: '/admin/education' },
  { label: 'Settings', icon: 'bi-gear-fill', route: '/admin/settings' },
];

const COACH_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/coach/dashboard' },
  { label: 'My Squad', icon: 'bi-people-fill', route: '/coach/squad' },
  { label: 'Session Plans', icon: 'bi-clipboard2-fill', route: '/coach/sessions' },
  { label: 'IDP', icon: 'bi-person-lines-fill', route: '/coach/idp' },
  { label: 'Wellness', icon: 'bi-heart-pulse-fill', route: '/coach/wellness' },
  { label: 'Education', icon: 'bi-mortarboard-fill', route: '/coach/education' },
];

const PLAYER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/player/dashboard' },
  { label: 'My IDP', icon: 'bi-person-lines-fill', route: '/player/idp' },
  { label: 'Daily Check-in', icon: 'bi-check2-circle', route: '/player/checkin' },
  { label: 'My Goals', icon: 'bi-trophy-fill', route: '/player/goals' },
];
