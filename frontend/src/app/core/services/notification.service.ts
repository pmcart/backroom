import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IdpService } from './idp.service';

export type NotificationType = 'review-due' | 'target-completion';

export interface IdpNotification {
  id: string;           // unique key: idpId-type
  idpId: string;
  playerName: string;
  squad: string;
  type: NotificationType;
  date: string;
  daysUntil: number;    // negative = overdue
  dismissed: boolean;
}

const DISMISSED_KEY = 'backroom_dismissed_notifications';
const WINDOW_DAYS   = 7;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private auth       = inject(AuthService);
  private idpService = inject(IdpService);

  private _all       = signal<IdpNotification[]>([]);
  private _dismissed = signal<Set<string>>(this.loadDismissed());

  /** All undismissed notifications */
  notifications = computed(() =>
    this._all().filter((n) => !this._dismissed().has(n.id)),
  );

  /** Count for badge */
  count = computed(() => this.notifications().length);

  /** Urgency — any overdue */
  hasOverdue = computed(() => this.notifications().some((n) => n.daysUntil < 0));

  constructor() {
    // Re-evaluate whenever the logged-in user changes
    effect(() => {
      const user = this.auth.currentUser();
      if (user?.role === 'coach') {
        this.load();
      } else {
        this._all.set([]);
      }
    });
  }

  dismiss(id: string) {
    this._dismissed.update((s) => {
      const next = new Set(s);
      next.add(id);
      return next;
    });
    this.saveDismissed();
  }

  dismissAll() {
    const allIds = new Set(this._all().map((n) => n.id));
    this._dismissed.set(allIds);
    this.saveDismissed();
  }

  refresh() { this.load(); }

  // ── Private ───────────────────────────────────────────────────────────────

  private load() {
    this.idpService.getAll().subscribe({
      next: (idps) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() + WINDOW_DAYS);

        const results: IdpNotification[] = [];

        for (const idp of idps) {
          if (idp.status === 'completed') continue;

          const playerName = `${idp.player?.firstName ?? ''} ${idp.player?.lastName ?? ''}`.trim();
          const squad      = idp.squad?.name ?? '';

          const checks: { type: NotificationType; date: string | null }[] = [
            { type: 'review-due',        date: idp.reviewDate },
            { type: 'target-completion', date: idp.targetCompletionDate },
          ];

          for (const { type, date } of checks) {
            if (!date) continue;
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            // Include overdue (past today) and upcoming within window
            if (d <= cutoff) {
              const daysUntil = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
              results.push({
                id: `${idp.id}-${type}`,
                idpId: idp.id,
                playerName,
                squad,
                type,
                date,
                daysUntil,
                dismissed: false,
              });
            }
          }
        }

        // Sort: overdue first, then soonest
        results.sort((a, b) => a.daysUntil - b.daysUntil);
        this._all.set(results);
      },
    });
  }

  private loadDismissed(): Set<string> {
    try {
      const raw = localStorage.getItem(DISMISSED_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }

  private saveDismissed() {
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...this._dismissed()]));
    } catch { /* ignore */ }
  }
}
