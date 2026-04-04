import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <app-sidebar />
    <div class="main-wrapper">
      <app-topbar />
      <main class="page-content">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  auth = inject(AuthService);
}
