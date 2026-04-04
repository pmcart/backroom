import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
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
        path: 'idp',
        loadComponent: () => import('./features/admin/idp/idp').then((m) => m.Idp),
        data: { title: 'IDP Management' },
      },
      {
        path: 'planning',
        loadComponent: () => import('./features/admin/planning/planning').then((m) => m.Planning),
        data: { title: 'Planning Overview' },
      },
      {
        path: 'monitoring',
        loadComponent: () => import('./features/admin/monitoring/monitoring').then((m) => m.Monitoring),
        data: { title: 'Monitoring' },
      },
      {
        path: 'education',
        loadComponent: () => import('./features/admin/education/education').then((m) => m.Education),
        data: { title: 'Education Hub' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings').then((m) => m.Settings),
        data: { title: 'Settings' },
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
        path: 'wellness',
        loadComponent: () => import('./features/coach/wellness/wellness').then((m) => m.Wellness),
        data: { title: 'Wellness Data' },
      },
      {
        path: 'education',
        loadComponent: () => import('./features/coach/education/education').then((m) => m.Education),
        data: { title: 'Education' },
      },
    ],
  },

  // ─── Player ────────────────────────────────────────────────────────────────
  {
    path: 'player',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard, roleGuard(['player'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/player/dashboard/player-dashboard.component').then((m) => m.PlayerDashboardComponent),
        data: { title: 'Dashboard' },
      },
      {
        path: 'idp',
        loadComponent: () => import('./features/player/idp/player-idp').then((m) => m.PlayerIdp),
        data: { title: 'My IDP' },
      },
      {
        path: 'checkin',
        loadComponent: () => import('./features/player/checkin/checkin').then((m) => m.Checkin),
        data: { title: 'Daily Check-in' },
      },
      {
        path: 'goals',
        loadComponent: () => import('./features/player/goals/goals').then((m) => m.Goals),
        data: { title: 'My Goals' },
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
