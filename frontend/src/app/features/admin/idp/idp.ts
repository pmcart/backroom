import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Idp as IdpModel } from '../../../core/models/idp.model';
import { IdpService } from '../../../core/services/idp.service';

@Component({
  selector: 'app-idp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './idp.html',
  styleUrl: './idp.scss',
})
export class Idp implements OnInit {
  private idpService = inject(IdpService);

  idps = signal<IdpModel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'by-squad' | 'engagement'>('by-squad');
  searchTerm = signal('');
  squadFilter = signal('');

  ngOnInit() {
    this.idpService.getAll().subscribe({
      next: (data) => { this.idps.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load IDPs.'); this.loading.set(false); },
    });
  }

  // ── Derived lists ────────────────────────────────────────────────────────

  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const squad = this.squadFilter();
    return this.idps().filter((idp) => {
      const name = `${idp.player?.firstName ?? ''} ${idp.player?.lastName ?? ''}`.toLowerCase();
      return (!term || name.includes(term)) && (!squad || idp.squadId === squad);
    });
  });

  squads = computed(() => {
    const seen = new Map<string, { id: string; name: string }>();
    for (const idp of this.idps()) {
      if (idp.squad && !seen.has(idp.squadId)) {
        seen.set(idp.squadId, { id: idp.squadId, name: idp.squad.name });
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  bySquad = computed(() => {
    const groups = new Map<string, { squad: { id: string; name: string; ageGroup: string }; idps: IdpModel[] }>();
    for (const idp of this.filtered()) {
      if (!idp.squad) continue;
      if (!groups.has(idp.squadId)) {
        groups.set(idp.squadId, { squad: idp.squad, idps: [] });
      }
      groups.get(idp.squadId)!.idps.push(idp);
    }
    return [...groups.values()].sort((a, b) => a.squad.name.localeCompare(b.squad.name));
  });

  // ── Summary stats (always from full idps list, not filtered) ────────────

  totalIdps     = computed(() => this.idps().length);
  onTrackCount  = computed(() => this.idps().filter((i) => i.progress >= 70).length);
  atRiskCount   = computed(() => this.idps().filter((i) => i.progress < 40).length);
  reviewsDue    = computed(() => this.idps().filter((i) => i.status === 'review-due').length);
  avgProgress   = computed(() => {
    if (!this.idps().length) return 0;
    return Math.round(this.idps().reduce((s, i) => s + i.progress, 0) / this.idps().length);
  });

  // ── Engagement tab ───────────────────────────────────────────────────────

  squadAverages = computed(() => {
    const groups = new Map<string, { squad: { id: string; name: string }; idps: IdpModel[] }>();
    for (const idp of this.idps()) {
      if (!idp.squad) continue;
      if (!groups.has(idp.squadId)) groups.set(idp.squadId, { squad: idp.squad, idps: [] });
      groups.get(idp.squadId)!.idps.push(idp);
    }
    return [...groups.values()].map(({ squad, idps }) => ({
      squad,
      avg: Math.round(idps.reduce((s, i) => s + i.progress, 0) / idps.length),
      total: idps.length,
      onTrack: idps.filter((i) => i.progress >= 70).length,
      atRisk: idps.filter((i) => i.progress < 40).length,
    })).sort((a, b) => a.squad.name.localeCompare(b.squad.name));
  });

  needingAttention = computed(() =>
    this.idps()
      .filter((i) => i.progress < 40 || i.status === 'review-due')
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 10),
  );

  // ── Helpers ──────────────────────────────────────────────────────────────

  progressClass(p: number): string {
    if (p >= 70) return 'bg-success';
    if (p >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  progressTextClass(p: number): string {
    if (p >= 70) return 'text-success';
    if (p >= 40) return 'text-warning';
    return 'text-danger';
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'active':     return 'bg-success';
      case 'review-due': return 'bg-warning text-dark';
      case 'completed':  return 'bg-secondary';
      default:           return 'bg-secondary';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'active':     return 'Active';
      case 'review-due': return 'Review Due';
      case 'completed':  return 'Completed';
      default:           return status;
    }
  }
}
