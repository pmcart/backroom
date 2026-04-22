import { LowerCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Idp as IdpModel, IdpGoal, IdpMode, IdpStatus, NoteStatus, SwotAnalysis } from '../../../core/models/idp.model';
import { Squad } from '../../../core/models/squad.model';
import { ElitePayload, GoalPayload, IdpService, TimelinePayload } from '../../../core/services/idp.service';
import { SquadsService } from '../../../core/services/squads.service';

type DetailTab = 'overview' | 'goals' | 'swot' | 'notes' | 'elite' | 'reflections';

@Component({
  selector: 'app-idp',
  standalone: true,
  imports: [FormsModule, LowerCasePipe],
  templateUrl: './idp.html',
  styleUrl: './idp.scss',
})
export class Idp implements OnInit {
  private idpService = inject(IdpService);
  private squadsService = inject(SquadsService);
  private auth = inject(AuthService);

  // ── Core state ────────────────────────────────────────────────────────────
  idps    = signal<IdpModel[]>([]);
  squads  = signal<Squad[]>([]);
  loading = signal(true);
  saving  = signal(false);
  error   = signal<string | null>(null);

  selectedSquadId = signal<string | null>(null);
  selectedIdpId   = signal<string | null>(null);
  activeTab       = signal<DetailTab>('overview');
  sidebarSearch   = signal('');

  // ── Create IDP form ───────────────────────────────────────────────────────
  createView              = signal(false);
  createPlayerId          = signal('');
  createMode              = signal<IdpMode>('elite');
  createAgeGroup          = signal('');
  createReviewDate        = signal('');
  createStartDate         = signal('');
  createTargetCompletion  = signal('');

  // ── Export / Email ────────────────────────────────────────────────────────
  exportingPdf    = signal(false);
  showEmailModal  = signal(false);
  emailAddress    = signal('');
  emailSending    = signal(false);
  emailResult     = signal<{ ok: boolean; msg: string } | null>(null);

  // ── Timeline editing (detail view) ────────────────────────────────────────
  editingTimeline       = signal(false);
  timelineStartDate     = signal('');
  timelineReviewDate    = signal('');
  timelineTargetDate    = signal('');

  // ── Goal form ─────────────────────────────────────────────────────────────
  showGoalForm   = signal(false);
  editingGoalId  = signal<string | null>(null);
  goalTitle      = signal('');
  goalDescription = signal('');
  goalCategory   = signal('');
  goalTargetDate = signal('');
  goalKpi        = signal('');
  goalProgress   = signal(0);
  goalStatus     = signal('not-started');
  goalRating     = signal<number | null>(null);

  // ── Notes & Comments ──────────────────────────────────────────────────────
  noteContent    = signal('');
  noteStatus     = signal<NoteStatus>('on-track');
  commentText    = signal('');
  editingComments = signal(false);

  // ── SWOT state ────────────────────────────────────────────────────────────
  swotStrengths     = signal('');
  swotWeaknesses    = signal('');
  swotOpportunities = signal('');
  swotThreats       = signal('');
  editingSwot       = signal(false);

  // ── Sub-skill evaluation state ────────────────────────────────────────────
  expandedSubPillar = signal<string | null>(null);
  subSkillEval      = signal<Record<string, Record<string, number>>>({});

  // ── Elite form state ──────────────────────────────────────────────────────
  holisticEval      = signal<Record<string, number>>({ Technical: 5, Tactical: 5, Physical: 5, Mental: 5, Social: 5 });
  primaryPosition   = signal('');
  secondaryPosition = signal('');
  positionalDemands = signal<string[]>([]);
  newDemand         = signal('');
  performanceSupport  = signal('');
  offFieldDevelopment = signal('');
  methodologyTags   = signal<string[]>([]);

  readonly holisticPillars = ['Technical', 'Tactical', 'Physical', 'Mental', 'Social'];
  readonly goalPillars = ['technical', 'tactical', 'physical', 'psychological'] as const;

  readonly subSkillsByPillar: Record<string, string[]> = {
    Technical: ['Passing', 'Dribbling', 'Shooting', 'Heading', 'First Touch', 'Crossing', 'Finishing'],
    Tactical:  ['Decision Making', 'Positioning', 'Pressing', 'Transitions', 'Set Pieces', 'Ball Retention'],
    Physical:  ['Pace', 'Strength', 'Stamina', 'Agility', 'Balance', 'Aerial Ability'],
    Mental:    ['Concentration', 'Confidence', 'Communication', 'Leadership', 'Resilience', 'Work Rate'],
    Social:    ['Teamwork', 'Attitude', 'Coachability', 'Body Language', 'Discipline'],
  };
  readonly allMethodologyTags = [
    'Pressing High', 'Positional Play', 'Transition Speed', 'Ball Retention',
    'Direct Play', 'Width & Depth', 'Set Pieces', 'Defensive Shape',
  ];
  readonly stars = [1, 2, 3, 4, 5];

  // ── Computed ──────────────────────────────────────────────────────────────
  mySquads = computed(() => {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return this.squads();
    const assigned = this.squads().filter((s) =>
      s.coachAssignments.some((ca) => ca.userId === userId),
    );
    return assigned.length > 0 ? assigned : this.squads();
  });

  selectedSquad = computed(() =>
    this.mySquads().find((s) => s.id === this.selectedSquadId()) ?? this.mySquads()[0] ?? null,
  );

  squadIdps = computed(() => {
    const squad = this.selectedSquad();
    if (!squad) return [];
    return this.idps().filter((idp) => idp.squadId === squad.id);
  });

  filteredIdps = computed(() => {
    const term = this.sidebarSearch().toLowerCase();
    if (!term) return this.squadIdps();
    return this.squadIdps().filter((idp) => {
      const name = `${idp.player?.firstName ?? ''} ${idp.player?.lastName ?? ''}`.toLowerCase();
      return name.includes(term);
    });
  });

  selectedIdp = computed(() =>
    this.idps().find((i) => i.id === this.selectedIdpId()) ?? null,
  );

  goalsByPillar = computed(() => {
    const idp = this.selectedIdp();
    if (!idp) return {} as Record<string, IdpGoal[]>;
    const result: Record<string, IdpGoal[]> = {
      technical: [], tactical: [], physical: [], psychological: [], other: [],
    };
    for (const goal of idp.goals) {
      const cat = goal.category ?? 'other';
      const key = ['technical', 'tactical', 'physical', 'psychological'].includes(cat) ? cat : 'other';
      result[key].push(goal);
    }
    return result;
  });

  availablePlayersForCreate = computed(() => {
    const squad = this.selectedSquad();
    if (!squad) return [];
    const taken = new Set(this.squadIdps().map((i) => i.playerId));
    return squad.players.filter((p) => !taken.has(p.id));
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    let squadsLoaded = false;
    let idpsLoaded = false;

    const tryAutoSelect = () => {
      if (!squadsLoaded || !idpsLoaded) return;
      this.loading.set(false);
    };

    this.squadsService.getSquads().subscribe({
      next: (squads) => { this.squads.set(squads); squadsLoaded = true; tryAutoSelect(); },
      error: () => { this.error.set('Failed to load squads.'); this.loading.set(false); },
    });

    this.idpService.getAll().subscribe({
      next: (idps) => { this.idps.set(idps); idpsLoaded = true; tryAutoSelect(); },
      error: () => { this.error.set('Failed to load IDPs.'); this.loading.set(false); },
    });
  }

  // ── Selection ─────────────────────────────────────────────────────────────
  selectIdp(id: string) {
    this.selectedIdpId.set(id);
    this.activeTab.set('overview');
    this.showGoalForm.set(false);
    this.editingComments.set(false);
    this.editingSwot.set(false);
    this.expandedSubPillar.set(null);
    const idp = this.idps().find((i) => i.id === id);
    if (idp) {
      this.syncSwotForm(idp);
      if (idp.mode === 'elite') this.syncEliteForm(idp);
    }
  }

  private syncSwotForm(idp: IdpModel) {
    this.swotStrengths.set(idp.swot?.strengths ?? '');
    this.swotWeaknesses.set(idp.swot?.weaknesses ?? '');
    this.swotOpportunities.set(idp.swot?.opportunities ?? '');
    this.swotThreats.set(idp.swot?.threats ?? '');
  }

  private syncEliteForm(idp: IdpModel) {
    this.holisticEval.set({ ...(idp.holisticEvaluation ?? { Technical: 5, Tactical: 5, Physical: 5, Mental: 5, Social: 5 }) });
    this.primaryPosition.set(idp.primaryPosition ?? '');
    this.secondaryPosition.set(idp.secondaryPosition ?? '');
    this.positionalDemands.set([...(idp.positionalDemands ?? [])]);
    this.performanceSupport.set(idp.performanceSupport ?? '');
    this.offFieldDevelopment.set(idp.offFieldDevelopment ?? '');
    this.methodologyTags.set([...(idp.methodologyTags ?? [])]);
    // Seed sub-skill evals from saved data, default missing skills to 5
    const saved = idp.subSkillEvaluations ?? {};
    const result: Record<string, Record<string, number>> = {};
    for (const pillar of this.holisticPillars) {
      result[pillar] = {};
      for (const skill of (this.subSkillsByPillar[pillar] ?? [])) {
        result[pillar][skill] = saved[pillar]?.[skill] ?? 5;
      }
    }
    this.subSkillEval.set(result);
  }

  // ── Create IDP ────────────────────────────────────────────────────────────
  openCreateForm() {
    this.createPlayerId.set('');
    this.createMode.set('elite');
    this.createAgeGroup.set(this.selectedSquad()?.ageGroup ?? '');
    this.createReviewDate.set('');
    this.createStartDate.set('');
    this.createTargetCompletion.set('');
    this.createView.set(true);
  }

  cancelCreate() {
    this.createView.set(false);
  }

  submitCreate() {
    const squadId = this.selectedSquad()?.id;
    if (!this.createPlayerId() || !squadId) return;
    this.saving.set(true);
    this.idpService.create({
      playerId: this.createPlayerId(),
      squadId,
      mode: this.createMode(),
      ageGroup: this.createAgeGroup() || undefined,
      reviewDate: this.createReviewDate() || undefined,
      startDate: this.createStartDate() || undefined,
      targetCompletionDate: this.createTargetCompletion() || undefined,
    }).subscribe({
      next: (idp) => {
        this.idps.update((list) => [...list, idp]);
        this.createView.set(false);
        this.saving.set(false);
        this.selectIdp(idp.id);
      },
      error: () => { this.saving.set(false); },
    });
  }

  // ── Delete IDP ────────────────────────────────────────────────────────────
  deleteIdp(id: string) {
    if (!confirm('Delete this IDP? This cannot be undone.')) return;
    this.idpService.delete(id).subscribe({
      next: () => {
        this.idps.update((list) => list.filter((i) => i.id !== id));
        if (this.selectedIdpId() === id) this.selectedIdpId.set(null);
      },
    });
  }

  atRiskCount(idp: IdpModel): number {
    return idp.goals.filter(g => g.status === 'at-risk').length;
  }

  // ── Status ────────────────────────────────────────────────────────────────
  updateStatus(status: IdpStatus) {
    const idp = this.selectedIdp();
    if (!idp) return;
    this.idpService.updateStatus(idp.id, status).subscribe({
      next: (updated) => this.patchIdp(updated),
    });
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  openAddGoal() {
    this.editingGoalId.set(null);
    this.goalTitle.set('');
    this.goalDescription.set('');
    this.goalCategory.set('');
    this.goalTargetDate.set('');
    this.goalKpi.set('');
    this.goalProgress.set(0);
    this.goalStatus.set('not-started');
    this.goalRating.set(null);
    this.showGoalForm.set(true);
  }

  openEditGoal(goal: IdpGoal) {
    this.editingGoalId.set(goal.id);
    this.goalTitle.set(goal.title);
    this.goalDescription.set(goal.description ?? '');
    this.goalCategory.set(goal.category ?? '');
    this.goalTargetDate.set(goal.targetDate ?? '');
    this.goalKpi.set(goal.kpi ?? '');
    this.goalProgress.set(goal.progress);
    this.goalStatus.set(goal.status);
    this.goalRating.set(goal.coachRating);
    this.showGoalForm.set(true);
  }

  submitGoal() {
    const idp = this.selectedIdp();
    if (!idp || !this.goalTitle().trim()) return;
    const payload: GoalPayload = {
      title:       this.goalTitle(),
      description: this.goalDescription() || undefined,
      category:    this.goalCategory() || undefined,
      targetDate:  this.goalTargetDate() || undefined,
      kpi:         this.goalKpi() || undefined,
      progress:    this.goalProgress(),
      status:      this.goalStatus(),
      coachRating: this.goalRating(),
    };
    this.saving.set(true);
    const goalId = this.editingGoalId();
    const obs = goalId
      ? this.idpService.updateGoal(idp.id, goalId, payload)
      : this.idpService.addGoal(idp.id, payload);
    obs.subscribe({
      next: (updated) => { this.patchIdp(updated); this.showGoalForm.set(false); this.saving.set(false); },
      error: () => { this.saving.set(false); },
    });
  }

  deleteGoal(goalId: string) {
    const idp = this.selectedIdp();
    if (!idp) return;
    this.idpService.deleteGoal(idp.id, goalId).subscribe({
      next: (updated) => this.patchIdp(updated),
    });
  }

  setGoalRating(n: number) {
    this.goalRating.set(this.goalRating() === n ? null : n);
  }

  quickSetGoalStatus(goal: IdpGoal, status: string) {
    const idp = this.selectedIdp();
    if (!idp) return;
    const payload: GoalPayload = {
      title:       goal.title,
      description: goal.description ?? undefined,
      category:    goal.category ?? undefined,
      targetDate:  goal.targetDate ?? undefined,
      kpi:         goal.kpi ?? undefined,
      progress:    goal.progress,
      status,
      coachRating: goal.coachRating ?? undefined,
    };
    this.idpService.updateGoal(idp.id, goal.id, payload).subscribe({
      next: (updated) => this.patchIdp(updated),
    });
  }

  // ── Comments ──────────────────────────────────────────────────────────────
  startEditComments() {
    this.commentText.set(this.selectedIdp()?.coachComments ?? '');
    this.editingComments.set(true);
  }

  saveComments() {
    const idp = this.selectedIdp();
    if (!idp) return;
    this.idpService.updateComments(idp.id, this.commentText()).subscribe({
      next: (updated) => { this.patchIdp(updated); this.editingComments.set(false); },
    });
  }

  // ── Progress Notes ────────────────────────────────────────────────────────
  submitNote() {
    const idp = this.selectedIdp();
    if (!idp || !this.noteContent().trim()) return;
    this.idpService.addProgressNote(idp.id, { content: this.noteContent(), status: this.noteStatus() }).subscribe({
      next: (updated) => { this.patchIdp(updated); this.noteContent.set(''); },
    });
  }

  // ── SWOT ──────────────────────────────────────────────────────────────────
  openEditSwot() {
    const idp = this.selectedIdp();
    if (idp) this.syncSwotForm(idp);
    this.editingSwot.set(true);
  }

  cancelEditSwot() { this.editingSwot.set(false); }

  saveSwot() {
    const idp = this.selectedIdp();
    if (!idp) return;
    const payload: Partial<SwotAnalysis> = {
      strengths:    this.swotStrengths(),
      weaknesses:   this.swotWeaknesses(),
      opportunities: this.swotOpportunities(),
      threats:      this.swotThreats(),
    };
    this.idpService.updateSwot(idp.id, payload).subscribe({
      next: (updated) => { this.patchIdp(updated); this.editingSwot.set(false); },
    });
  }

  // ── Goal pillar helpers ────────────────────────────────────────────────────
  openAddGoalForPillar(pillar: string) {
    this.editingGoalId.set(null);
    this.goalTitle.set('');
    this.goalDescription.set('');
    this.goalCategory.set(pillar);
    this.goalTargetDate.set('');
    this.goalKpi.set('');
    this.goalProgress.set(0);
    this.goalStatus.set('not-started');
    this.goalRating.set(null);
    this.showGoalForm.set(true);
  }

  pillarLabel(p: string): string {
    const labels: Record<string, string> = {
      technical: 'Technical', tactical: 'Tactical',
      physical: 'Physical', psychological: 'Psychological', other: 'Other',
    };
    return labels[p] ?? p;
  }

  pillarIcon(p: string): string {
    const icons: Record<string, string> = {
      technical: '⚽', tactical: '🧠', physical: '💪', psychological: '🎯', other: '📋',
    };
    return icons[p] ?? '📋';
  }

  // ── Sub-skill evaluations ──────────────────────────────────────────────────
  toggleSubPillar(pillar: string) {
    this.expandedSubPillar.set(this.expandedSubPillar() === pillar ? null : pillar);
  }

  setSubSkill(pillar: string, skill: string, value: number) {
    this.subSkillEval.update((s) => ({
      ...s,
      [pillar]: { ...(s[pillar] ?? {}), [skill]: value },
    }));
  }

  // ── Elite ─────────────────────────────────────────────────────────────────
  saveElite() {
    const idp = this.selectedIdp();
    if (!idp) return;
    this.saving.set(true);
    const payload: ElitePayload = {
      holisticEvaluation:  this.holisticEval(),
      primaryPosition:     this.primaryPosition() || undefined,
      secondaryPosition:   this.secondaryPosition() || undefined,
      positionalDemands:   this.positionalDemands(),
      performanceSupport:  this.performanceSupport() || undefined,
      offFieldDevelopment: this.offFieldDevelopment() || undefined,
      methodologyTags:     this.methodologyTags(),
      subSkillEvaluations: this.subSkillEval(),
    };
    this.idpService.updateElite(idp.id, payload).subscribe({
      next: (updated) => { this.patchIdp(updated); this.saving.set(false); },
      error: () => { this.saving.set(false); },
    });
  }

  addDemand() {
    const d = this.newDemand().trim();
    if (!d) return;
    this.positionalDemands.update((list) => [...list, d]);
    this.newDemand.set('');
  }

  removeDemand(i: number) {
    this.positionalDemands.update((list) => list.filter((_, idx) => idx !== i));
  }

  toggleMethodologyTag(tag: string) {
    this.methodologyTags.update((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  }

  setHolisticPillar(pillar: string, value: number) {
    this.holisticEval.update((e) => ({ ...e, [pillar]: value }));
  }

  // ── PDF / Email ───────────────────────────────────────────────────────────
  downloadPdf() {
    const idp = this.selectedIdp();
    if (!idp) return;
    const name = `${idp.player?.firstName ?? 'idp'}-${idp.player?.lastName ?? idp.id}`
      .toLowerCase().replace(/\s+/g, '-') + '-idp.pdf';
    this.exportingPdf.set(true);
    this.idpService.downloadPdf(idp.id, name).subscribe({
      next: () => this.exportingPdf.set(false),
      error: () => this.exportingPdf.set(false),
    });
  }

  openEmailModal() {
    this.emailAddress.set('');
    this.emailResult.set(null);
    this.showEmailModal.set(true);
  }

  closeEmailModal() { this.showEmailModal.set(false); }

  sendEmail() {
    const idp = this.selectedIdp();
    if (!idp || !this.emailAddress().trim()) return;
    this.emailSending.set(true);
    this.emailResult.set(null);
    this.idpService.sendEmail(idp.id, this.emailAddress().trim()).subscribe({
      next: (res) => {
        this.emailSending.set(false);
        this.emailResult.set({ ok: true, msg: res.message });
      },
      error: () => {
        this.emailSending.set(false);
        this.emailResult.set({ ok: false, msg: 'Failed to send email. Check SMTP configuration.' });
      },
    });
  }

  // ── Timeline ──────────────────────────────────────────────────────────────
  openEditTimeline() {
    const idp = this.selectedIdp();
    if (!idp) return;
    this.timelineStartDate.set(idp.startDate ?? '');
    this.timelineReviewDate.set(idp.reviewDate ?? '');
    this.timelineTargetDate.set(idp.targetCompletionDate ?? '');
    this.editingTimeline.set(true);
  }

  cancelEditTimeline() { this.editingTimeline.set(false); }

  saveTimeline() {
    const idp = this.selectedIdp();
    if (!idp) return;
    const payload: TimelinePayload = {
      startDate: this.timelineStartDate() || null,
      reviewDate: this.timelineReviewDate() || null,
      targetCompletionDate: this.timelineTargetDate() || null,
    };
    this.idpService.updateTimeline(idp.id, payload).subscribe({
      next: (updated) => { this.patchIdp(updated); this.editingTimeline.set(false); },
    });
  }

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
    const diff = new Date(idp.targetCompletionDate).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private patchIdp(updated: IdpModel) {
    this.idps.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
  }

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

  noteStatusClass(status: string): string {
    switch (status) {
      case 'on-track':        return 'text-success';
      case 'needs-attention': return 'text-warning';
      case 'exceeding':       return 'text-primary';
      default:                return 'text-muted';
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

  formatDate(d: string | null | undefined): string {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  }

  playerInitials(idp: IdpModel): string {
    const f = idp.player?.firstName?.[0] ?? '';
    const l = idp.player?.lastName?.[0] ?? '';
    return (f + l).toUpperCase();
  }
}
