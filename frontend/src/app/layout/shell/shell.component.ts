import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { PlayerBottomNavComponent } from '../player-bottom-nav/player-bottom-nav.component';
import { AuthService } from '../../core/auth/auth.service';
import { MobileMenuService } from '../../core/services/mobile-menu.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, PlayerBottomNavComponent],
  template: `
    <app-sidebar />

    @if (auth.role !== 'player') {
      <div class="sidebar-overlay" [class.show]="menu.isOpen()" (click)="menu.close()"></div>
    }

    <div class="main-wrapper" [class.player-layout]="auth.role === 'player'">
      <app-topbar />
      <main class="page-content">
        <router-outlet />
      </main>
    </div>

    @if (auth.role === 'player') {
      <app-player-bottom-nav />
    }
  `,
})
export class ShellComponent {
  auth = inject(AuthService);
  menu = inject(MobileMenuService);
}
