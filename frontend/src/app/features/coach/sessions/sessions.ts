import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import {
  CompetitionPhase,
  DEFAULT_DAY,
  DEFAULT_PHASES,
  DEFAULT_SEASON_PHASE,
  DEFAULT_WEEK,
  MultiWeekBlockData,
  PlanDay,
  PlanStatus,
  PlanType,
  SeasonPhase,
  SeasonPlanData,
  SessionPhase,
  SessionPlan,
  SingleSessionData,
  WEEK_DAYS,
  WeeklyPlanData,
} from '../../../core/models/session.model';
import { Squad } from '../../../core/models/squad.model';
import { CreatePlanPayload, SessionsService } from '../../../core/services/sessions.service';
import { SquadsService } from '../../../core/services/squads.service';

type ListTab   = 'active' | 'archived';
type DetailTab = 'overview' | 'content';
type AppView   = 'list' | 'create' | 'detail';

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions implements OnInit {
  private sessionsService = inject(SessionsService);
  private squadsService   = inject(SquadsService);
  private auth            = inject(AuthService);

  // ── Core state ─────────────────────────────────────────────────────────────
  plans   = signal<SessionPlan[]>([]);
  squads  = signal<Squad[]>([]);
  loading = signal(true);
  saving  = signal(false);
  error   = signal<string | null>(null);

  // ── UI state ───────────────────────────────────────────────────────────────
  currentView    = signal<AppView>('list');
  selectedPlanId = signal<string | null>(null);
  listSearch     = signal('');
  filterType     = signal<string>('all');
  filterPhase    = signal<string>('all');
  listTab        = signal<ListTab>('active');
  detailTab      = signal<DetailTab>('overview');

  // ── Create form ────────────────────────────────────────────────────────────
  createTitle      = signal('');
  createType       = signal<PlanType>('single-session');
  createStatus     = signal<PlanStatus>('draft');
  createCompPhase  = signal<string>('in-season');
  createTags       = signal('');
  createSingleData = signal<SingleSessionData>(this.defaultSingle());
  createWeeklyData = signal<WeeklyPlanData>(this.defaultWeekly());
  createMultiData  = signal<MultiWeekBlockData>(this.defaultMulti(2));
  createSeasonData = signal<SeasonPlanData>(this.defaultSeason());
  createCpInput    = signal<string[]>(Array(5).fill(''));
  createEqInput    = signal<string[]>(Array(5).fill(''));
  createIdpInput   = signal('');
  createObjInput   = signal<string[]>(Array(7).fill(''));
  createWkObjInput = signal<Record<string, string>>({});

  // ── Edit state ─────────────────────────────────────────────────────────────
  editTitle     = signal('');
  editStatus    = signal<PlanStatus>('draft');
  editCompPhase = signal<string>('');
  editTags      = signal<string[]>([]);
  editData      = signal<any>(null);
  editDirty     = signal(false);
  editCpInput   = signal<string[]>(Array(5).fill(''));
  editEqInput   = signal<string[]>(Array(5).fill(''));
  editIdpInput  = signal('');
  editObjInput  = signal<string[]>(Array(7).fill(''));
  editWkObjInput= signal<Record<string, string>>({});
  editNewTag    = signal('');

  // ── Constants ──────────────────────────────────────────────────────────────
  readonly planTypes: { value: PlanType; label: string }[] = [
    { value: 'single-session',   label: 'Single Session'   },
    { value: 'weekly-plan',      label: 'Weekly Plan'      },
    { value: 'multi-week-block', label: 'Multi-Week Block' },
    { value: 'season-plan',      label: 'Season Plan'      },
  ];

  readonly competitionPhases: { value: CompetitionPhase; label: string }[] = [
    { value: 'pre-season',  label: 'Pre-Season'  },
    { value: 'in-season',   label: 'In-Season'   },
    { value: 'post-season', label: 'Post-Season' },
    { value: 'off-season',  label: 'Off-Season'  },
  ];

  readonly dayTypes    = ['training', 'rest', 'match', 'recovery'];
  readonly intensities = ['low', 'medium', 'high'];
  readonly weekDays    = WEEK_DAYS;

  // ── Computed ───────────────────────────────────────────────────────────────
  mySquad = computed(() => {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return this.squads()[0] ?? null;
    return this.squads().find(s => s.coachAssignments.some(ca => ca.userId === userId))
      ?? this.squads()[0] ?? null;
  });

  filteredPlans = computed(() => {
    let list = this.plans();
    const squad = this.mySquad();
    if (squad) list = list.filter(p => p.squadId === squad.id);
    list = this.listTab() === 'active'
      ? list.filter(p => p.status !== 'archived')
      : list.filter(p => p.status === 'archived');
    if (this.filterType() !== 'all')  list = list.filter(p => p.type === this.filterType());
    if (this.filterPhase() !== 'all') list = list.filter(p => p.competitionPhase === this.filterPhase());
    const term = this.listSearch().toLowerCase();
    if (term) list = list.filter(p => p.title.toLowerCase().includes(term));
    return list;
  });

  selectedPlan = computed(() =>
    this.plans().find(p => p.id === this.selectedPlanId()) ?? null,
  );

  mySquadPlans = computed(() => {
    const squad = this.mySquad();
    return this.plans().filter(p => squad ? p.squadId === squad.id : true);
  });

  statsSessionCount = computed(() =>
    this.mySquadPlans().filter(p => p.type === 'single-session' && p.status !== 'archived').length);

  statsWeeklyCount = computed(() =>
    this.mySquadPlans().filter(p => p.type === 'weekly-plan' && p.status !== 'archived').length);

  statsBlockCount = computed(() =>
    this.mySquadPlans().filter(p => p.type === 'multi-week-block' && p.status !== 'archived').length);

  statsActiveCount = computed(() =>
    this.mySquadPlans().filter(p => p.status === 'active').length);

  activeTabCount = computed(() =>
    this.mySquadPlans().filter(p => p.status !== 'archived').length);

  archivedTabCount = computed(() =>
    this.mySquadPlans().filter(p => p.status === 'archived').length);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit() {
    let squadsLoaded = false;
    let plansLoaded  = false;

    const tryAutoSelect = () => {
      if (!squadsLoaded || !plansLoaded) return;
      this.loading.set(false);
    };

    this.squadsService.getSquads().subscribe({
      next: (squads) => { this.squads.set(squads); squadsLoaded = true; tryAutoSelect(); },
      error: () => { this.error.set('Failed to load squads.'); this.loading.set(false); },
    });

    this.sessionsService.getAll().subscribe({
      next: (plans) => { this.plans.set(plans); plansLoaded = true; tryAutoSelect(); },
      error: () => { this.error.set('Failed to load session plans.'); this.loading.set(false); },
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  goBack() {
    this.currentView.set('list');
    this.selectedPlanId.set(null);
  }

  // ── Selection ──────────────────────────────────────────────────────────────
  selectPlan(id: string) {
    this.selectedPlanId.set(id);
    this.detailTab.set('overview');
    const plan = this.plans().find(p => p.id === id);
    if (plan) this.syncEditState(plan);
    this.currentView.set('detail');
  }

  private syncEditState(plan: SessionPlan) {
    this.editTitle.set(plan.title);
    this.editStatus.set(plan.status);
    this.editCompPhase.set(plan.competitionPhase ?? '');
    this.editTags.set([...(plan.tags ?? [])]);
    this.editData.set(plan.data ? clone(plan.data) : null);
    this.editDirty.set(false);
    this.editCpInput.set(Array(5).fill(''));
    this.editEqInput.set(Array(5).fill(''));
    this.editIdpInput.set('');
    this.editObjInput.set(Array(7).fill(''));
    this.editWkObjInput.set({});
    this.editNewTag.set('');
  }

  // ── Save plan ──────────────────────────────────────────────────────────────
  savePlan() {
    const plan = this.selectedPlan();
    if (!plan) return;
    this.saving.set(true);
    this.sessionsService.update(plan.id, {
      title: this.editTitle(),
      status: this.editStatus(),
      competitionPhase: this.editCompPhase() || undefined,
      tags: this.editTags(),
      data: this.editData(),
    }).subscribe({
      next: (updated) => { this.patchPlan(updated); this.editDirty.set(false); this.saving.set(false); },
      error: () => { this.saving.set(false); },
    });
  }

  markDirty() { this.editDirty.set(true); }

  // ── Create ─────────────────────────────────────────────────────────────────
  openCreate() {
    this.createTitle.set('');
    this.createType.set('single-session');
    this.createStatus.set('draft');
    this.createCompPhase.set('in-season');
    this.createTags.set('');
    this.resetCreateData('single-session');
    this.currentView.set('create');
  }

  onCreateTypeChange(type: PlanType) {
    this.createType.set(type);
    this.resetCreateData(type);
  }

  private resetCreateData(type: PlanType) {
    this.createCpInput.set(Array(5).fill(''));
    this.createEqInput.set(Array(5).fill(''));
    this.createIdpInput.set('');
    this.createObjInput.set(Array(7).fill(''));
    this.createWkObjInput.set({});
    switch (type) {
      case 'single-session':   this.createSingleData.set(this.defaultSingle()); break;
      case 'weekly-plan':      this.createWeeklyData.set(this.defaultWeekly()); break;
      case 'multi-week-block': this.createMultiData.set(this.defaultMulti(2));  break;
      case 'season-plan':      this.createSeasonData.set(this.defaultSeason()); break;
    }
  }

  submitCreate() {
    const squadId = this.mySquad()?.id;
    if (!this.createTitle().trim() || !squadId) return;
    const tags = this.createTags().split(',').map(t => t.trim()).filter(Boolean);
    const payload: CreatePlanPayload = {
      title: this.createTitle().trim(),
      type: this.createType(),
      status: this.createStatus(),
      competitionPhase: this.createCompPhase() || undefined,
      squadId,
      tags: tags.length ? tags : undefined,
      data: this.getCreateData(),
    };
    this.saving.set(true);
    this.sessionsService.create(payload).subscribe({
      next: (plan) => {
        this.plans.update(list => [plan, ...list]);
        this.saving.set(false);
        this.listTab.set('active');
        this.selectPlan(plan.id);
      },
      error: () => { this.saving.set(false); },
    });
  }

  private getCreateData(): any {
    switch (this.createType()) {
      case 'single-session':   return clone(this.createSingleData());
      case 'weekly-plan':      return clone(this.createWeeklyData());
      case 'multi-week-block': return clone(this.createMultiData());
      case 'season-plan':      return clone(this.createSeasonData());
    }
  }

  // ── Duplicate / Archive / Delete ───────────────────────────────────────────
  duplicatePlan(id: string) {
    this.sessionsService.duplicate(id).subscribe({
      next: (copy) => {
        this.plans.update(list => [copy, ...list]);
        this.listTab.set('active');
        this.selectPlan(copy.id);
      },
    });
  }

  archivePlan(id: string) {
    this.sessionsService.archive(id).subscribe({
      next: (updated) => {
        this.patchPlan(updated);
        if (this.selectedPlanId() === id) this.goBack();
      },
    });
  }

  deletePlan(id: string) {
    if (!confirm('Delete this plan permanently? This cannot be undone.')) return;
    this.sessionsService.delete(id).subscribe({
      next: () => {
        this.plans.update(list => list.filter(p => p.id !== id));
        if (this.selectedPlanId() === id) this.goBack();
      },
    });
  }

  // ── Edit: tags ─────────────────────────────────────────────────────────────
  addEditTag() {
    const tag = this.editNewTag().trim();
    if (!tag || this.editTags().includes(tag)) return;
    this.editTags.update(t => [...t, tag]);
    this.editNewTag.set('');
    this.editDirty.set(true);
  }

  removeEditTag(i: number) {
    this.editTags.update(t => t.filter((_, idx) => idx !== i));
    this.editDirty.set(true);
  }

  // ── Edit: Single Session ───────────────────────────────────────────────────
  setSingleField(field: 'date' | 'theme', value: string) {
    this.editData.update((d: SingleSessionData) => ({ ...d, [field]: value }));
    this.editDirty.set(true);
  }

  addIdpLink() {
    const link = this.editIdpInput().trim();
    if (!link) return;
    this.editData.update((d: SingleSessionData) => ({ ...d, idpLinks: [...(d.idpLinks ?? []), link] }));
    this.editIdpInput.set('');
    this.editDirty.set(true);
  }

  removeIdpLink(idx: number) {
    this.editData.update((d: SingleSessionData) => ({
      ...d, idpLinks: d.idpLinks.filter((_, i) => i !== idx),
    }));
    this.editDirty.set(true);
  }

  setPhaseField(phaseIdx: number, field: keyof SessionPhase, value: any) {
    this.editData.update((d: SingleSessionData) => {
      const phases = clone(d.phases);
      (phases[phaseIdx] as any)[field] = value;
      return { ...d, phases };
    });
    this.editDirty.set(true);
  }

  addCoachingPoint(phaseIdx: number) {
    const pt = this.editCpInput()[phaseIdx]?.trim();
    if (!pt) return;
    this.editData.update((d: SingleSessionData) => {
      const phases = clone(d.phases);
      phases[phaseIdx].coachingPoints = [...phases[phaseIdx].coachingPoints, pt];
      return { ...d, phases };
    });
    this.editCpInput.update(arr => arr.map((v, i) => i === phaseIdx ? '' : v));
    this.editDirty.set(true);
  }

  removeCp(phaseIdx: number, cpIdx: number) {
    this.editData.update((d: SingleSessionData) => {
      const phases = clone(d.phases);
      phases[phaseIdx].coachingPoints = phases[phaseIdx].coachingPoints.filter((_, i) => i !== cpIdx);
      return { ...d, phases };
    });
    this.editDirty.set(true);
  }

  addEquipment(phaseIdx: number) {
    const eq = this.editEqInput()[phaseIdx]?.trim();
    if (!eq) return;
    this.editData.update((d: SingleSessionData) => {
      const phases = clone(d.phases);
      phases[phaseIdx].equipment = [...phases[phaseIdx].equipment, eq];
      return { ...d, phases };
    });
    this.editEqInput.update(arr => arr.map((v, i) => i === phaseIdx ? '' : v));
    this.editDirty.set(true);
  }

  removeEq(phaseIdx: number, eqIdx: number) {
    this.editData.update((d: SingleSessionData) => {
      const phases = clone(d.phases);
      phases[phaseIdx].equipment = phases[phaseIdx].equipment.filter((_, i) => i !== eqIdx);
      return { ...d, phases };
    });
    this.editDirty.set(true);
  }

  // ── Edit: Weekly Plan ──────────────────────────────────────────────────────
  setDayField(dayIdx: number, field: keyof PlanDay, value: any) {
    this.editData.update((d: WeeklyPlanData) => {
      const days = clone(d.days);
      (days[dayIdx] as any)[field] = value;
      return { ...d, days };
    });
    this.editDirty.set(true);
  }

  addDayObjective(dayIdx: number) {
    const obj = this.editObjInput()[dayIdx]?.trim();
    if (!obj) return;
    this.editData.update((d: WeeklyPlanData) => {
      const days = clone(d.days);
      days[dayIdx].idpObjectives = [...days[dayIdx].idpObjectives, obj];
      return { ...d, days };
    });
    this.editObjInput.update(arr => arr.map((v, i) => i === dayIdx ? '' : v));
    this.editDirty.set(true);
  }

  removeDayObjective(dayIdx: number, objIdx: number) {
    this.editData.update((d: WeeklyPlanData) => {
      const days = clone(d.days);
      days[dayIdx].idpObjectives = days[dayIdx].idpObjectives.filter((_, i) => i !== objIdx);
      return { ...d, days };
    });
    this.editDirty.set(true);
  }

  // ── Edit: Multi-Week Block ─────────────────────────────────────────────────
  addWeek() {
    this.editData.update((d: MultiWeekBlockData) => ({
      ...d, weeks: [...d.weeks, clone(DEFAULT_WEEK(`Week ${d.weeks.length + 1}`))],
    }));
    this.editDirty.set(true);
  }

  removeWeek(weekIdx: number) {
    this.editData.update((d: MultiWeekBlockData) => ({
      ...d, weeks: d.weeks.filter((_, i) => i !== weekIdx),
    }));
    this.editDirty.set(true);
  }

  setWeekLabel(weekIdx: number, label: string) {
    this.editData.update((d: MultiWeekBlockData) => {
      const weeks = clone(d.weeks);
      weeks[weekIdx].label = label;
      return { ...d, weeks };
    });
    this.editDirty.set(true);
  }

  setWeekDayField(weekIdx: number, dayIdx: number, field: keyof PlanDay, value: any) {
    this.editData.update((d: MultiWeekBlockData) => {
      const weeks = clone(d.weeks);
      (weeks[weekIdx].days[dayIdx] as any)[field] = value;
      return { ...d, weeks };
    });
    this.editDirty.set(true);
  }

  addWeekDayObjective(weekIdx: number, dayIdx: number) {
    const key = `${weekIdx}_${dayIdx}`;
    const obj = (this.editWkObjInput()[key] ?? '').trim();
    if (!obj) return;
    this.editData.update((d: MultiWeekBlockData) => {
      const weeks = clone(d.weeks);
      weeks[weekIdx].days[dayIdx].idpObjectives = [...weeks[weekIdx].days[dayIdx].idpObjectives, obj];
      return { ...d, weeks };
    });
    this.editWkObjInput.update(m => ({ ...m, [key]: '' }));
    this.editDirty.set(true);
  }

  removeWeekDayObjective(weekIdx: number, dayIdx: number, objIdx: number) {
    this.editData.update((d: MultiWeekBlockData) => {
      const weeks = clone(d.weeks);
      weeks[weekIdx].days[dayIdx].idpObjectives =
        weeks[weekIdx].days[dayIdx].idpObjectives.filter((_, i) => i !== objIdx);
      return { ...d, weeks };
    });
    this.editDirty.set(true);
  }

  // ── Edit: Season Plan ──────────────────────────────────────────────────────
  addSeasonPhase() {
    this.editData.update((d: SeasonPlanData) => ({
      ...d, phases: [...d.phases, DEFAULT_SEASON_PHASE()],
    }));
    this.editDirty.set(true);
  }

  removeSeasonPhase(idx: number) {
    this.editData.update((d: SeasonPlanData) => ({
      ...d, phases: d.phases.filter((_, i) => i !== idx),
    }));
    this.editDirty.set(true);
  }

  setSeasonPhaseField(idx: number, field: keyof SeasonPhase, value: string) {
    this.editData.update((d: SeasonPlanData) => {
      const phases = clone(d.phases);
      phases[idx][field] = value;
      return { ...d, phases };
    });
    this.editDirty.set(true);
  }

  // ── Temp-input helpers (computed keys not allowed in templates) ────────────
  setEditWkObjInput(wi: number, di: number, value: string) {
    const key = `${wi}_${di}`;
    this.editWkObjInput.update(m => ({ ...m, [key]: value }));
  }

  setCreateWkObjInput(wi: number, di: number, value: string) {
    const key = `${wi}_${di}`;
    this.createWkObjInput.update(m => ({ ...m, [key]: value }));
  }

  // ── Create: Phase fields (multi-statement blocks not allowed in templates) ─
  setCreatePhaseField(pi: number, field: keyof SessionPhase, value: any) {
    this.createSingleData.update(d => {
      const phases = clone(d.phases);
      (phases[pi] as any)[field] = field === 'duration' ? +value : value;
      return { ...d, phases };
    });
  }

  setCreateDayField(di: number, field: keyof PlanDay, value: any) {
    this.createWeeklyData.update(d => {
      const days = clone(d.days);
      (days[di] as any)[field] = value;
      return { ...d, days };
    });
  }

  setCreateWeekLabel(wi: number, label: string) {
    this.createMultiData.update(d => {
      const weeks = clone(d.weeks);
      weeks[wi].label = label;
      return { ...d, weeks };
    });
  }

  setCreateWeekDayField(wi: number, di: number, field: keyof PlanDay, value: any) {
    this.createMultiData.update(d => {
      const weeks = clone(d.weeks);
      (weeks[wi].days[di] as any)[field] = value;
      return { ...d, weeks };
    });
  }

  setCreateSeasonField(spi: number, field: keyof SeasonPhase, value: string) {
    this.createSeasonData.update(d => {
      const phases = clone(d.phases);
      phases[spi][field] = value;
      return { ...d, phases };
    });
  }

  // ── Create helpers: Single Session ─────────────────────────────────────────
  addCreateIdpLink() {
    const link = this.createIdpInput().trim();
    if (!link) return;
    this.createSingleData.update(d => ({ ...d, idpLinks: [...d.idpLinks, link] }));
    this.createIdpInput.set('');
  }

  removeCreateIdpLink(idx: number) {
    this.createSingleData.update(d => ({ ...d, idpLinks: d.idpLinks.filter((_, i) => i !== idx) }));
  }

  addCreateCp(phaseIdx: number) {
    const pt = this.createCpInput()[phaseIdx]?.trim();
    if (!pt) return;
    this.createSingleData.update(d => {
      const phases = clone(d.phases);
      phases[phaseIdx].coachingPoints = [...phases[phaseIdx].coachingPoints, pt];
      return { ...d, phases };
    });
    this.createCpInput.update(arr => arr.map((v, i) => i === phaseIdx ? '' : v));
  }

  removeCreateCp(phaseIdx: number, cpIdx: number) {
    this.createSingleData.update(d => {
      const phases = clone(d.phases);
      phases[phaseIdx].coachingPoints = phases[phaseIdx].coachingPoints.filter((_, i) => i !== cpIdx);
      return { ...d, phases };
    });
  }

  addCreateEq(phaseIdx: number) {
    const eq = this.createEqInput()[phaseIdx]?.trim();
    if (!eq) return;
    this.createSingleData.update(d => {
      const phases = clone(d.phases);
      phases[phaseIdx].equipment = [...phases[phaseIdx].equipment, eq];
      return { ...d, phases };
    });
    this.createEqInput.update(arr => arr.map((v, i) => i === phaseIdx ? '' : v));
  }

  removeCreateEq(phaseIdx: number, eqIdx: number) {
    this.createSingleData.update(d => {
      const phases = clone(d.phases);
      phases[phaseIdx].equipment = phases[phaseIdx].equipment.filter((_, i) => i !== eqIdx);
      return { ...d, phases };
    });
  }

  // ── Create helpers: Weekly Plan ────────────────────────────────────────────
  addCreateDayObj(dayIdx: number) {
    const obj = this.createObjInput()[dayIdx]?.trim();
    if (!obj) return;
    this.createWeeklyData.update(d => {
      const days = clone(d.days);
      days[dayIdx].idpObjectives = [...days[dayIdx].idpObjectives, obj];
      return { ...d, days };
    });
    this.createObjInput.update(arr => arr.map((v, i) => i === dayIdx ? '' : v));
  }

  removeCreateDayObj(dayIdx: number, objIdx: number) {
    this.createWeeklyData.update(d => {
      const days = clone(d.days);
      days[dayIdx].idpObjectives = days[dayIdx].idpObjectives.filter((_, i) => i !== objIdx);
      return { ...d, days };
    });
  }

  // ── Create helpers: Multi-Week Block ───────────────────────────────────────
  addCreateWeek() {
    this.createMultiData.update(d => ({
      ...d, weeks: [...d.weeks, clone(DEFAULT_WEEK(`Week ${d.weeks.length + 1}`))],
    }));
  }

  removeCreateWeek(idx: number) {
    this.createMultiData.update(d => ({ ...d, weeks: d.weeks.filter((_, i) => i !== idx) }));
  }

  addCreateWkDayObj(weekIdx: number, dayIdx: number) {
    const key = `${weekIdx}_${dayIdx}`;
    const obj = (this.createWkObjInput()[key] ?? '').trim();
    if (!obj) return;
    this.createMultiData.update(d => {
      const weeks = clone(d.weeks);
      weeks[weekIdx].days[dayIdx].idpObjectives = [...weeks[weekIdx].days[dayIdx].idpObjectives, obj];
      return { ...d, weeks };
    });
    this.createWkObjInput.update(m => ({ ...m, [key]: '' }));
  }

  removeCreateWkDayObj(weekIdx: number, dayIdx: number, objIdx: number) {
    this.createMultiData.update(d => {
      const weeks = clone(d.weeks);
      weeks[weekIdx].days[dayIdx].idpObjectives =
        weeks[weekIdx].days[dayIdx].idpObjectives.filter((_, i) => i !== objIdx);
      return { ...d, weeks };
    });
  }

  // ── Create helpers: Season Plan ────────────────────────────────────────────
  addCreateSeasonPhase() {
    this.createSeasonData.update(d => ({ ...d, phases: [...d.phases, DEFAULT_SEASON_PHASE()] }));
  }

  removeCreateSeasonPhase(idx: number) {
    this.createSeasonData.update(d => ({ ...d, phases: d.phases.filter((_, i) => i !== idx) }));
  }

  // ── Private helpers ────────────────────────────────────────────────────────
  private patchPlan(updated: SessionPlan) {
    this.plans.update(list => list.map(p => p.id === updated.id ? updated : p));
    if (this.selectedPlanId() === updated.id) this.syncEditState(updated);
  }

  private defaultSingle(): SingleSessionData {
    return { date: '', theme: '', idpLinks: [], phases: clone(DEFAULT_PHASES) };
  }

  private defaultWeekly(): WeeklyPlanData {
    return { days: WEEK_DAYS.map(DEFAULT_DAY) };
  }

  private defaultMulti(weeks: number): MultiWeekBlockData {
    return { weeks: Array.from({ length: weeks }, (_, i) => clone(DEFAULT_WEEK(`Week ${i + 1}`))) };
  }

  private defaultSeason(): SeasonPlanData {
    return { phases: [DEFAULT_SEASON_PHASE()] };
  }

  // ── Display helpers ────────────────────────────────────────────────────────
  typeLabel(type: string): string {
    return this.planTypes.find(t => t.value === type)?.label ?? type;
  }

  typeBadgeClass(type: string): string {
    switch (type) {
      case 'single-session':   return 'bg-primary';
      case 'weekly-plan':      return 'bg-success';
      case 'multi-week-block': return 'bg-warning text-dark';
      case 'season-plan':      return 'bg-info text-dark';
      default:                 return 'bg-secondary';
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'active':   return 'bg-success';
      case 'draft':    return 'bg-light text-dark border';
      case 'archived': return 'bg-secondary';
      default:         return 'bg-secondary';
    }
  }

  phaseLabel(phase: string): string {
    return this.competitionPhases.find(p => p.value === phase)?.label ?? phase;
  }

  dayTypeBadge(type: string): string {
    switch (type) {
      case 'match':    return 'bg-danger';
      case 'rest':     return 'bg-light text-dark border';
      case 'recovery': return 'bg-warning text-dark';
      default:         return 'bg-primary';
    }
  }

  intensityClass(intensity: string): string {
    switch (intensity) {
      case 'high':   return 'text-danger fw-semibold';
      case 'medium': return 'text-warning fw-semibold';
      default:       return 'text-success';
    }
  }

  formatDate(d: string | null | undefined): string {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  }

  asSingle(data: any): SingleSessionData   { return data as SingleSessionData;   }
  asWeekly(data: any): WeeklyPlanData      { return data as WeeklyPlanData;      }
  asMulti(data: any):  MultiWeekBlockData  { return data as MultiWeekBlockData;  }
  asSeason(data: any): SeasonPlanData      { return data as SeasonPlanData;      }

  /** Exposed so the HTML template can call clone() in inline expressions */
  clone<T>(v: T): T { return clone(v); }
}
