import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <header class="topbar">
      <span class="topbar-title">{{ pageTitle$ | async }}</span>
      <div class="ms-auto d-flex align-items-center gap-3">
        <button class="btn btn-sm btn-light position-relative">
          <i class="bi bi-bell"></i>
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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
}
