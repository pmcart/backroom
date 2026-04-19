import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClubSettings, ClubsService, DEFAULT_COACH_PERMISSIONS } from '../../../core/services/clubs.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private clubsService = inject(ClubsService);

  settings = signal<ClubSettings | null>(null);
  loading  = signal(true);
  saving   = signal(false);
  saved    = signal(false);
  error    = signal<string | null>(null);

  readonly permissionDefs: { key: keyof ClubSettings['coachPermissions']; label: string; desc: string }[] = [
    { key: 'canCreateSingleSession',  label: 'Create Single Sessions',  desc: 'Allow coaches to create individual training session plans' },
    { key: 'canCreateWeeklyPlan',     label: 'Create Weekly Plans',     desc: 'Allow coaches to create 7-day training plans' },
    { key: 'canCreateMultiWeekBlock', label: 'Create Multi-Week Blocks',desc: 'Allow coaches to create multi-week training blocks' },
    { key: 'canCreateSeasonPlan',     label: 'Create Season Plans',     desc: 'Allow coaches to create full season periodisation plans' },
    { key: 'canEditAdminPlans',       label: 'Edit Admin Plans',        desc: 'Allow coaches to edit plans created by club admins' },
    { key: 'canDeleteOwnPlans',       label: 'Delete Own Plans',        desc: 'Allow coaches to permanently delete their own plans' },
  ];

  ngOnInit() {
    this.clubsService.getSettings().subscribe({
      next: (s) => { this.settings.set(s); this.loading.set(false); },
      error: ()  => {
        // Fall back to defaults if settings not yet saved for this club
        this.settings.set({ coachPermissions: { ...DEFAULT_COACH_PERMISSIONS } });
        this.loading.set(false);
      },
    });
  }

  togglePermission(key: keyof ClubSettings['coachPermissions'], value: boolean) {
    this.settings.update(s => s ? {
      ...s,
      coachPermissions: { ...s.coachPermissions, [key]: value },
    } : s);
  }

  save() {
    const s = this.settings();
    if (!s) return;
    this.saving.set(true);
    this.clubsService.updateSettings(s).subscribe({
      next: (updated) => {
        this.settings.set(updated);
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: () => { this.saving.set(false); this.error.set('Failed to save settings.'); },
    });
  }
}
