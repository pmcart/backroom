import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-player-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="player-bottom-nav">
      <a routerLink="/player/dashboard" routerLinkActive="active">
        <i class="bi bi-speedometer2"></i>
        <span>Home</span>
      </a>
      <a routerLink="/player/idp" routerLinkActive="active">
        <i class="bi bi-person-lines-fill"></i>
        <span>My IDP</span>
      </a>
      <a routerLink="/player/checkin" routerLinkActive="active">
        <i class="bi bi-check2-circle"></i>
        <span>Check-in</span>
      </a>
      <a routerLink="/player/goals" routerLinkActive="active">
        <i class="bi bi-trophy-fill"></i>
        <span>Goals</span>
      </a>
    </nav>
  `,
})
export class PlayerBottomNavComponent {}
