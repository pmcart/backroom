import { Routes } from '@angular/router';
import { authGuard, roleGuard, superadminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // ─── Superadmin ────────────────────────────────────────────────────────────
  {
    path: 'superadmin',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard, superadminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/superadmin/dashboard/superadmin-dashboard.component').then((m) => m.SuperadminDashboardComponent),
        data: { title: 'Platform Overview' },
      },
    ],
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        data: { title: 'Dashboard' },
      },
      {
        path: 'squads',
        loadComponent: () => import('./features/admin/squads/squads').then((m) => m.Squads),
        data: { title: 'Squads' },
      },
      {
        path: 'squads/:id',
        loadComponent: () => import('./features/admin/squads/squad-detail').then((m) => m.SquadDetail),
        data: { title: 'Squad Detail' },
      },
      {
        path: 'idp',
        loadComponent: () => import('./features/admin/idp/idp').then((m) => m.Idp),
        data: { title: 'IDP Management' },
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/coach/sessions/sessions').then((m) => m.Sessions),
        data: { title: 'Session Plans' },
      },
      {
        path: 'planning',
        loadComponent: () => import('./features/admin/planning/planning').then((m) => m.Planning),
        data: { title: 'Weekly Schedule' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings').then((m) => m.Settings),
        data: { title: 'Settings' },
      },
      {
        path: 'methodology',
        loadComponent: () => import('./features/admin/methodology/methodology').then((m) => m.Methodology),
        data: { title: 'Club Methodology' },
      },
    ],
  },

  // ─── Coach ─────────────────────────────────────────────────────────────────
  {
    path: 'coach',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard, roleGuard(['coach'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/coach/dashboard/coach-dashboard.component').then((m) => m.CoachDashboardComponent),
        data: { title: 'Dashboard' },
      },
      {
        path: 'squad',
        loadComponent: () => import('./features/coach/squad/squad').then((m) => m.Squad),
        data: { title: 'My Squad' },
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/coach/sessions/sessions').then((m) => m.Sessions),
        data: { title: 'Session Plans' },
      },
      {
        path: 'idp',
        loadComponent: () => import('./features/coach/idp/idp').then((m) => m.Idp),
        data: { title: 'IDP' },
      },
      {
        path: 'methodology',
        loadComponent: () => import('./features/coach/methodology/methodology').then((m) => m.Methodology),
        data: { title: 'Club Methodology' },
      },
    ],
  },

  // ─── Hidden: Organisation provisioning (no nav link, key-protected) ──────
  {
    path: 'provision',
    loadComponent: () =>
      import('./features/provision/provision.component').then((m) => m.ProvisionComponent),
  },

  { path: '**', redirectTo: 'login' },
];
