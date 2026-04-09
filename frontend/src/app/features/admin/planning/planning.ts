import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';
import { SquadsService } from '../../../core/services/squads.service';
import { ScheduleDay, ScheduleEntry, ScheduleEntryType } from '../../../core/models/schedule.model';
import { Squad } from '../../../core/models/squad.model';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(m.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildDays(monday: Date): ScheduleDay[] {
  return DAY_NAMES.map((label, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return {
      date: toIso(d),
      label,
      full: `${label} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
    };
  });
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning.html',
  styleUrl: './planning.scss',
})
export class Planning implements OnInit {
  private scheduleService = inject(ScheduleService);
  private squadsService   = inject(SquadsService);

  // ── State ──────────────────────────────────────────────────────────────────
  weekMonday   = signal<Date>(mondayOf(new Date()));
  entries      = signal<ScheduleEntry[]>([]);
  squads       = signal<Squad[]>([]);
  loading      = signal(false);
  squadFilter  = signal<string>('all');

  showModal  = signal(false);
  modalDate  = signal('');
  modalSquad = signal('');
  modalTitle = signal('');
  modalType  = signal<ScheduleEntryType>('training');
  saving     = signal(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  days = computed(() => buildDays(this.weekMonday()));

  weekLabel = computed(() => {
    const ds = this.days();
    return `${ds[0].full} — ${ds[6].full}`;
  });

  squadMap = computed(() => {
    const m = new Map<string, Squad>();
    for (const s of this.squads()) m.set(s.id, s);
    return m;
  });

  filteredEntries = computed(() => {
    const filter = this.squadFilter();
    if (filter === 'all') return this.entries();
    return this.entries().filter(e => e.squadId === filter);
  });

  entriesByDay = computed(() => {
    const m = new Map<string, ScheduleEntry[]>();
    for (const e of this.filteredEntries()) {
      const list = m.get(e.date) ?? [];
      list.push(e);
      m.set(e.date, list);
    }
    return m;
  });

  isCurrentWeek = computed(() => toIso(mondayOf(new Date())) === toIso(this.weekMonday()));

  // ── Stats ──────────────────────────────────────────────────────────────────
  stats = computed(() => {
    const all = this.filteredEntries();
    return {
      total:    all.length,
      training: all.filter(e => e.type === 'training').length,
      match:    all.filter(e => e.type === 'match').length,
      recovery: all.filter(e => e.type === 'recovery').length,
      rest:     all.filter(e => e.type === 'rest').length,
    };
  });

  readonly entryTypes: { value: ScheduleEntryType; label: string }[] = [
    { value: 'training',  label: 'Training'  },
    { value: 'match',     label: 'Match'     },
    { value: 'recovery',  label: 'Recovery'  },
    { value: 'rest',      label: 'Rest'      },
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit() {
    this.squadsService.getSquads().subscribe(s => this.squads.set(s));
    this.loadWeek();
  }

  // ── Week navigation ────────────────────────────────────────────────────────
  prevWeek() {
    const d = new Date(this.weekMonday());
    d.setDate(d.getDate() - 7);
    this.weekMonday.set(d);
    this.loadWeek();
  }

  nextWeek() {
    const d = new Date(this.weekMonday());
    d.setDate(d.getDate() + 7);
    this.weekMonday.set(d);
    this.loadWeek();
  }

  goToday() {
    this.weekMonday.set(mondayOf(new Date()));
    this.loadWeek();
  }

  private loadWeek() {
    this.loading.set(true);
    this.scheduleService.getByWeek(toIso(this.weekMonday())).subscribe({
      next: entries => { this.entries.set(entries); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }

  // ── Squad filter ───────────────────────────────────────────────────────────
  setSquadFilter(id: string) { this.squadFilter.set(id); }

  // ── Add entry modal ────────────────────────────────────────────────────────
  openModal(date: string) {
    this.modalDate.set(date);
    this.modalSquad.set(
      this.squadFilter() !== 'all' ? this.squadFilter() : (this.squads()[0]?.id ?? '')
    );
    this.modalTitle.set('');
    this.modalType.set('training');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  saveEntry() {
    if (!this.modalSquad() || !this.modalTitle().trim()) return;
    this.saving.set(true);
    this.scheduleService.create({
      squadId: this.modalSquad(),
      date:    this.modalDate(),
      title:   this.modalTitle().trim(),
      type:    this.modalType(),
    }).subscribe({
      next: entry => {
        this.entries.update(list => [...list, entry]);
        this.saving.set(false);
        this.showModal.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  deleteEntry(id: string) {
    this.scheduleService.delete(id).subscribe(() =>
      this.entries.update(list => list.filter(e => e.id !== id))
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  dayEntries(date: string): ScheduleEntry[] {
    return this.entriesByDay().get(date) ?? [];
  }

  squadName(squadId: string): string {
    return this.squadMap().get(squadId)?.name ?? '—';
  }
}
