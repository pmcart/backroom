import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Idp as IdpModel } from '../../../core/models/idp.model';
import { IdpService } from '../../../core/services/idp.service';
import { SquadsService } from '../../../core/services/squads.service';

@Component({
  selector: 'app-idp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './idp.html',
  styleUrl: './idp.scss',
})
export class Idp implements OnInit {
  private idpService = inject(IdpService);
  private squadsService = inject(SquadsService);

  idps = signal<IdpModel[]>([]);
  allSquads = signal<{ id: string; name: string; ageGroup: string }[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'by-squad' | 'engagement'>('by-squad');
  searchTerm = signal('');
  squadFilter = signal('');

  // ── Detail modal ──────────────────────────────────────────────────────────
  viewingIdp = signal<IdpModel | null>(null);
  detailTab  = signal<'overview' | 'goals' | 'notes' | 'elite'>('overview');

  ngOnInit() {
    let idpsLoaded = false;
    let squadsLoaded = false;

    const done = () => {
      if (idpsLoaded && squadsLoaded) this.loading.set(false);
    };

    this.idpService.getAll().subscribe({
      next: (data) => { this.idps.set(data); idpsLoaded = true; done(); },
      error: () => { this.error.set('Failed to load IDPs.'); this.loading.set(false); },
    });

    this.squadsService.getSquads().subscribe({
      next: (squads) => {
        this.allSquads.set(squads.map(s => ({ id: s.id, name: s.name, ageGroup: s.ageGroup })));
        squadsLoaded = true;
        done();
      },
      error: () => { squadsLoaded = true; done(); }, // non-fatal: degrade gracefully
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
    return this.allSquads().sort((a, b) => a.name.localeCompare(b.name));
  });

  bySquad = computed(() => {
    // Start with all known squads so newly-created squads (with no IDPs yet) still appear
    const groups = new Map<string, { squad: { id: string; name: string; ageGroup: string }; idps: IdpModel[] }>();

    const squadFilter = this.squadFilter();
    for (const s of this.allSquads()) {
      if (!squadFilter || squadFilter === s.id) {
        groups.set(s.id, { squad: s, idps: [] });
      }
    }

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

  // ── Detail modal ──────────────────────────────────────────────────────────

  openDetail(idp: IdpModel) {
    this.viewingIdp.set(idp);
    this.detailTab.set('overview');
  }

  closeDetail() { this.viewingIdp.set(null); }

  timelinePercent(idp: IdpModel): number {
    if (!idp.startDate || !idp.targetCompletionDate) return 0;
    const start = new Date(idp.startDate).getTime();
    const end   = new Date(idp.targetCompletionDate).getTime();
    const now   = Date.now();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
  }

  daysRemaining(idp: IdpModel): number | null {
    if (!idp.targetCompletionDate) return null;
    return Math.ceil((new Date(idp.targetCompletionDate).getTime() - Date.now()) / 86400000);
  }

  formatDate(d: string | null | undefined): string {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  }

  playerInitials(idp: IdpModel): string {
    return ((idp.player?.firstName?.[0] ?? '') + (idp.player?.lastName?.[0] ?? '')).toUpperCase();
  }

  goalStatusClass(status: string): string {
    switch (status) {
      case 'on-track':    return 'bg-success';
      case 'at-risk':     return 'bg-danger';
      case 'completed':   return 'bg-secondary';
      case 'in-progress': return 'bg-primary';
      default:            return 'bg-light text-dark border';
    }
  }

  goalStatusLabel(status: string): string {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'on-track':    return 'On Track';
      case 'at-risk':     return 'At Risk';
      case 'completed':   return 'Completed';
      default:            return status;
    }
  }

  noteStatusLabel(status: string): string {
    switch (status) {
      case 'on-track':        return 'On Track';
      case 'needs-attention': return 'Needs Attention';
      case 'exceeding':       return 'Exceeding';
      default:                return status;
    }
  }

  noteStatusClass(status: string): string {
    switch (status) {
      case 'on-track':        return 'text-success';
      case 'needs-attention': return 'text-warning';
      case 'exceeding':       return 'text-primary';
      default:                return 'text-muted';
    }
  }

  readonly holisticPillars = ['Technical', 'Tactical', 'Physical', 'Mental', 'Social'];

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
