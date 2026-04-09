import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Squad as SquadModel } from '../../../core/models/squad.model';
import { SquadsService } from '../../../core/services/squads.service';

@Component({
  selector: 'app-squad',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './squad.html',
  styleUrl: './squad.scss',
})
export class Squad implements OnInit {
  private squadsService = inject(SquadsService);
  private auth = inject(AuthService);

  allSquads = signal<SquadModel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedSquadId = signal<string | null>(null);

  mySquads = computed(() => {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return this.allSquads();
    const assigned = this.allSquads().filter((s) =>
      s.coachAssignments.some((ca) => ca.userId === userId),
    );
    return assigned.length > 0 ? assigned : this.allSquads();
  });

  selectedSquad = computed(() =>
    this.mySquads().find((s) => s.id === this.selectedSquadId()) ?? this.mySquads()[0] ?? null,
  );

  ngOnInit() {
    this.squadsService.getSquads().subscribe({
      next: (squads) => {
        this.allSquads.set(squads);
        const first = this.mySquads()[0];
        if (first) this.selectedSquadId.set(first.id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load squad data.');
        this.loading.set(false);
      },
    });
  }

  selectSquad(id: string) {
    this.selectedSquadId.set(id);
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'active':   return 'bg-success';
      case 'injured':  return 'bg-danger';
      case 'recovery': return 'bg-warning text-dark';
      default:         return 'bg-secondary';
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return date;
    }
  }

  activeCount(squad: SquadModel)   { return squad.players.filter((p) => p.status === 'active').length; }
  injuredCount(squad: SquadModel)  { return squad.players.filter((p) => p.status === 'injured').length; }
  recoveryCount(squad: SquadModel) { return squad.players.filter((p) => p.status === 'recovery').length; }
}
