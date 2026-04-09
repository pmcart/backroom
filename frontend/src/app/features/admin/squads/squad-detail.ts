import { TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AvailableCoach, CreatePlayerPayload, Player, Squad } from '../../../core/models/squad.model';
import { SquadsService } from '../../../core/services/squads.service';

@Component({
  selector: 'app-squad-detail',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './squad-detail.html',
  styleUrl: './squad-detail.scss',
})
export class SquadDetail implements OnInit {
  private squadsService = inject(SquadsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);

  isAdmin = this.auth.role === 'admin';

  squad = signal<Squad | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // ── Player dropdowns / modals ────────────────────────────────────────────
  showPlayerDropdown = signal(false);

  showCreatePlayerModal = signal(false);
  newPlayer: CreatePlayerPayload = { firstName: '', lastName: '', position: '', dateOfBirth: '', status: 'active' };
  savingPlayer = false;
  playerError: string | null = null;

  showAddExistingPlayerModal = signal(false);
  availablePlayers = signal<Player[]>([]);
  loadingAvailablePlayers = signal(false);
  selectedPlayerId: string | null = null;
  assigningPlayer = false;
  assignPlayerError: string | null = null;

  // ── Coach dropdowns / modals ─────────────────────────────────────────────
  showCoachDropdown = signal(false);

  showAssignCoachModal = signal(false);
  availableCoaches = signal<AvailableCoach[]>([]);
  loadingAvailableCoaches = signal(false);
  selectedCoachId: string | null = null;
  assigningCoach = false;
  assignCoachError: string | null = null;

  showCreateCoachModal = signal(false);
  newCoach = { firstName: '', lastName: '', email: '' };
  savingCoach = false;
  coachError: string | null = null;

  // ── CSV import ───────────────────────────────────────────────────────────
  importError: string | null = null;
  importSuccess: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadSquad(id);
  }

  loadSquad(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.squadsService.getSquad(id).subscribe({
      next: (squad) => { this.squad.set(squad); this.loading.set(false); },
      error: () => { this.error.set('Failed to load squad.'); this.loading.set(false); },
    });
  }

  goBack() { this.router.navigate(['/admin/squads']); }

  // ── Document click — close all dropdowns ────────────────────────────────
  @HostListener('document:click')
  closeDropdowns() {
    this.showPlayerDropdown.set(false);
    this.showCoachDropdown.set(false);
  }

  togglePlayerDropdown(e: Event) {
    e.stopPropagation();
    const next = !this.showPlayerDropdown();
    this.showPlayerDropdown.set(next);
    if (next) this.showCoachDropdown.set(false);
  }

  toggleCoachDropdown(e: Event) {
    e.stopPropagation();
    const next = !this.showCoachDropdown();
    this.showCoachDropdown.set(next);
    if (next) this.showPlayerDropdown.set(false);
  }

  // ── Create new player ────────────────────────────────────────────────────
  openCreatePlayerModal() {
    this.showPlayerDropdown.set(false);
    this.newPlayer = { firstName: '', lastName: '', position: '', dateOfBirth: '', status: 'active' };
    this.playerError = null;
    this.showCreatePlayerModal.set(true);
  }

  closeCreatePlayerModal() { this.showCreatePlayerModal.set(false); }

  createPlayer() {
    if (!this.newPlayer.firstName.trim() || !this.newPlayer.lastName.trim()) {
      this.playerError = 'First name and last name are required.';
      return;
    }
    this.savingPlayer = true;
    this.playerError = null;
    const squadId = this.squad()!.id;
    const payload: CreatePlayerPayload = {
      firstName: this.newPlayer.firstName.trim(),
      lastName: this.newPlayer.lastName.trim(),
      position: this.newPlayer.position?.trim() || undefined,
      dateOfBirth: this.newPlayer.dateOfBirth || undefined,
      status: this.newPlayer.status,
    };
    this.squadsService.addPlayer(squadId, payload).subscribe({
      next: (player) => {
        this.squad.update((s) => s ? { ...s, players: [...s.players, player] } : s);
        this.savingPlayer = false;
        this.closeCreatePlayerModal();
      },
      error: () => { this.playerError = 'Failed to add player.'; this.savingPlayer = false; },
    });
  }

  // ── Add existing player ──────────────────────────────────────────────────
  openAddExistingPlayerModal() {
    this.showPlayerDropdown.set(false);
    this.selectedPlayerId = null;
    this.assignPlayerError = null;
    this.showAddExistingPlayerModal.set(true);
    this.loadingAvailablePlayers.set(true);
    this.squadsService.getAvailablePlayers(this.squad()!.id).subscribe({
      next: (p) => { this.availablePlayers.set(p); this.loadingAvailablePlayers.set(false); },
      error: () => { this.availablePlayers.set([]); this.loadingAvailablePlayers.set(false); },
    });
  }

  closeAddExistingPlayerModal() { this.showAddExistingPlayerModal.set(false); }

  assignPlayer() {
    if (!this.selectedPlayerId) return;
    this.assigningPlayer = true;
    this.assignPlayerError = null;
    this.squadsService.assignPlayer(this.squad()!.id, this.selectedPlayerId).subscribe({
      next: (player) => {
        this.squad.update((s) => s ? { ...s, players: [...s.players, player] } : s);
        this.availablePlayers.update((list) => list.filter((p) => p.id !== player.id));
        this.selectedPlayerId = null;
        this.assigningPlayer = false;
        this.closeAddExistingPlayerModal();
      },
      error: () => { this.assignPlayerError = 'Failed to assign player.'; this.assigningPlayer = false; },
    });
  }

  removePlayer(player: Player) {
    if (!confirm(`Remove ${player.firstName} ${player.lastName} from this squad?`)) return;
    this.squadsService.removePlayer(this.squad()!.id, player.id).subscribe({
      next: () => this.squad.update((s) => s ? { ...s, players: s.players.filter((p) => p.id !== player.id) } : s),
    });
  }

  // ── Assign existing coach ────────────────────────────────────────────────
  openAssignCoachModal() {
    this.showCoachDropdown.set(false);
    this.selectedCoachId = null;
    this.assignCoachError = null;
    this.showAssignCoachModal.set(true);
    this.loadingAvailableCoaches.set(true);
    this.squadsService.getAvailableCoaches(this.squad()!.id).subscribe({
      next: (c) => { this.availableCoaches.set(c); this.loadingAvailableCoaches.set(false); },
      error: () => { this.availableCoaches.set([]); this.loadingAvailableCoaches.set(false); },
    });
  }

  closeAssignCoachModal() { this.showAssignCoachModal.set(false); }

  assignCoach() {
    if (!this.selectedCoachId) return;
    this.assigningCoach = true;
    this.assignCoachError = null;
    this.squadsService.addCoach(this.squad()!.id, this.selectedCoachId).subscribe({
      next: (assignment) => {
        this.squad.update((s) => s ? { ...s, coachAssignments: [...s.coachAssignments, assignment] } : s);
        this.selectedCoachId = null;
        this.assigningCoach = false;
        this.closeAssignCoachModal();
      },
      error: () => { this.assignCoachError = 'Failed to assign coach.'; this.assigningCoach = false; },
    });
  }

  // ── Create new coach ─────────────────────────────────────────────────────
  openCreateCoachModal() {
    this.showCoachDropdown.set(false);
    this.newCoach = { firstName: '', lastName: '', email: '' };
    this.coachError = null;
    this.showCreateCoachModal.set(true);
  }

  closeCreateCoachModal() { this.showCreateCoachModal.set(false); }

  createCoach() {
    if (!this.newCoach.firstName.trim() || !this.newCoach.lastName.trim() || !this.newCoach.email.trim()) {
      this.coachError = 'All fields are required.';
      return;
    }
    this.savingCoach = true;
    this.coachError = null;
    this.squadsService.createCoach(this.squad()!.id, {
      firstName: this.newCoach.firstName.trim(),
      lastName: this.newCoach.lastName.trim(),
      email: this.newCoach.email.trim(),
    }).subscribe({
      next: (assignment) => {
        this.squad.update((s) => s ? { ...s, coachAssignments: [...s.coachAssignments, assignment] } : s);
        this.savingCoach = false;
        this.closeCreateCoachModal();
      },
      error: (err) => {
        this.coachError = err?.error?.message ?? 'Failed to create coach.';
        this.savingCoach = false;
      },
    });
  }

  removeCoach(assignmentId: string, name: string) {
    if (!confirm(`Remove ${name} from coaching staff?`)) return;
    this.squadsService.removeCoach(this.squad()!.id, assignmentId).subscribe({
      next: () => this.squad.update((s) =>
        s ? { ...s, coachAssignments: s.coachAssignments.filter((ca) => ca.id !== assignmentId) } : s,
      ),
    });
  }

  // ── CSV import ───────────────────────────────────────────────────────────
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.importError = null;
    this.importSuccess = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const players = this.parseCSV(text);
        if (players.length === 0) {
          this.importError = 'No valid rows found. Expected columns: firstName, lastName, dateOfBirth, position';
          return;
        }
        const squadId = this.squad()!.id;
        this.squadsService.importPlayers(squadId, players).subscribe({
          next: (res) => {
            this.importSuccess = `Successfully imported ${res.imported} player${res.imported !== 1 ? 's' : ''}.`;
            this.loadSquad(squadId);
          },
          error: () => { this.importError = 'Import failed. Please check the file format and try again.'; },
        });
      } catch {
        this.importError = 'Failed to parse CSV file.';
      }
    };
    reader.readAsText(file);
    (event.target as HTMLInputElement).value = '';
  }

  private parseCSV(text: string): CreatePlayerPayload[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, ''));
    return lines.slice(1).filter((l) => l.trim()).map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      const get = (k: string) => cols[headers.indexOf(k)] ?? '';
      return {
        firstName: get('firstname'),
        lastName: get('lastname'),
        dateOfBirth: get('dateofbirth') || undefined,
        position: get('position') || undefined,
        status: (['active', 'injured', 'recovery'].includes(get('status')) ? get('status') : 'active') as any,
      };
    }).filter((p) => p.firstName && p.lastName);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
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
    } catch { return date; }
  }

  activeCount()   { return this.squad()?.players.filter((p) => p.status === 'active').length ?? 0; }
  injuredCount()  { return this.squad()?.players.filter((p) => p.status === 'injured').length ?? 0; }
  recoveryCount() { return this.squad()?.players.filter((p) => p.status === 'recovery').length ?? 0; }
}
