import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { MobileMenuService } from '../../core/services/mobile-menu.service';

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
    <nav class="sidebar d-flex flex-column" [class.sidebar-mobile-open]="menu.isOpen()">
      <div class="sidebar-brand">
        @if (auth.isSuperadmin()) {
          <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
            <img src="/img/backroom-logo.png" alt="Backroom" style="width:130px; height:auto; margin:0 auto; filter:brightness(0) invert(1);" />
          </div>
        } @else if (clubName()) {
          <div class="club-logo-badge" [style.background]="clubColor()">{{ clubInitials() }}</div>
          <div class="club-brand-text">
            <div class="club-brand-name">{{ clubName() }}</div>
            <div class="club-brand-sub">{{ clubName() }} Academy</div>
          </div>
        } @else {
          <img src="/img/backroom-logo.png" alt="Backroom" style="width:130px; height:auto; margin:0 auto; filter:brightness(0) invert(1);" />
        }
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
        @if (auth.isImpersonating()) {
          <button class="btn btn-sm btn-outline-warning w-100 mb-2" (click)="auth.exitImpersonation()">
            ← Back to Superadmin
          </button>
        }
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
  menu = inject(MobileMenuService);

  constructor() {
    inject(Router).events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menu.close());
  }

  clubName = computed(() => this.auth.currentUser()?.clubName ?? null);

  clubInitials = computed(() => {
    const name = this.clubName();
    if (!name) return '';
    return name.split(' ').filter(w => w).map(w => w[0]).join('');
  });

  clubColor = computed(() => {
    const name = this.clubName() ?? '';
    const palette = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#16a085'];
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return palette[hash % palette.length];
  });

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
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Academy Admin';
    if (role === 'coach') return 'Coaching';
    return '';
  });

  navItems = computed<NavItem[]>(() => {
    const role = this.auth.role;
    if (role === 'superadmin') return SUPERADMIN_NAV;
    if (role === 'admin') return ADMIN_NAV;
    if (role === 'coach') return COACH_NAV;
    return [];
  });
}

const SUPERADMIN_NAV: NavItem[] = [
  { label: 'Platform Overview', icon: 'bi-speedometer2', route: '/superadmin/dashboard' },
  { label: 'Provision Organisation', icon: 'bi-plus-circle-fill', route: '/superadmin/provision' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard' },
  { label: 'Squads', icon: 'bi-people-fill', route: '/admin/squads' },
  { label: 'IDP Management', icon: 'bi-person-lines-fill', route: '/admin/idp' },
  { label: 'Session Plans', icon: 'bi-clipboard2-fill', route: '/admin/sessions' },
  { label: 'Weekly Schedule', icon: 'bi-calendar3', route: '/admin/planning' },
  { label: 'Club Methodology', icon: 'bi-book-half', route: '/admin/methodology' },
  { label: 'Settings', icon: 'bi-gear-fill', route: '/admin/settings' },
];

const COACH_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'bi-speedometer2', route: '/coach/dashboard' },
  { label: 'My Squad', icon: 'bi-people-fill', route: '/coach/squad' },
  { label: 'Session Plans', icon: 'bi-clipboard2-fill', route: '/coach/sessions' },
  { label: 'IDP', icon: 'bi-person-lines-fill', route: '/coach/idp' },
  { label: 'Club Methodology', icon: 'bi-book-half', route: '/coach/methodology' },
];
