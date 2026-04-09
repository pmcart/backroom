import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SquadsService } from '../../../core/services/squads.service';
import { Squad } from '../../../core/models/squad.model';

@Component({
  selector: 'app-squads',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './squads.html',
  styleUrl: './squads.scss',
})
export class Squads implements OnInit {
  private squadsService = inject(SquadsService);
  private router = inject(Router);

  squads = signal<Squad[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');
  ageGroupFilter = signal('');
  activeDropdown = signal<string | null>(null);

  showAddModal = signal(false);
  newName = '';
  newAgeGroup = '';
  saving = false;

  squadToDelete = signal<Squad | null>(null);
  deleting = false;

  filteredSquads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filter = this.ageGroupFilter();
    return this.squads().filter((s) => {
      const matchesSearch = !term || s.name.toLowerCase().includes(term);
      const matchesFilter = !filter || s.ageGroup === filter;
      return matchesSearch && matchesFilter;
    });
  });

  ageGroups = computed(() => [...new Set(this.squads().map((s) => s.ageGroup))].sort());

  ngOnInit() {
    this.loadSquads();
  }

  loadSquads() {
    this.loading.set(true);
    this.error.set(null);
    this.squadsService.getSquads().subscribe({
      next: (squads) => {
        this.squads.set(squads);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load squads. Is the backend running?');
        this.loading.set(false);
      },
    });
  }

  openAddModal() {
    this.newName = '';
    this.newAgeGroup = '';
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  createSquad() {
    if (!this.newName.trim() || !this.newAgeGroup.trim()) return;
    this.saving = true;
    this.squadsService.createSquad({ name: this.newName.trim(), ageGroup: this.newAgeGroup.trim() }).subscribe({
      next: (squad) => {
        this.squads.update((s) => [...s, squad]);
        this.saving = false;
        this.closeAddModal();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  viewSquad(id: string) {
    this.router.navigate(['/admin/squads', id]);
  }

  confirmDelete(squad: Squad) {
    this.activeDropdown.set(null);
    this.squadToDelete.set(squad);
  }

  cancelDelete() {
    this.squadToDelete.set(null);
  }

  deleteSquad() {
    const squad = this.squadToDelete();
    if (!squad) return;
    this.deleting = true;
    this.squadsService.deleteSquad(squad.id).subscribe({
      next: () => {
        this.squads.update((s) => s.filter((x) => x.id !== squad.id));
        this.deleting = false;
        this.squadToDelete.set(null);
      },
      error: () => {
        this.deleting = false;
      },
    });
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    this.activeDropdown.update((current) => (current === id ? null : id));
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdown.set(null);
  }

  activeCount(squad: Squad) {
    return squad.players.filter((p) => p.status === 'active').length;
  }

  injuredCount(squad: Squad) {
    return squad.players.filter((p) => p.status === 'injured').length;
  }

  recoveryCount(squad: Squad) {
    return squad.players.filter((p) => p.status === 'recovery').length;
  }
}
