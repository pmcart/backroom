import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubsService } from '../clubs/clubs.service';
import { CoachAssignment } from '../squads/entities/coach-assignment.entity';
import { CreateSessionPlanDto } from './dto/create-session-plan.dto';
import { UpdateSessionPlanDto } from './dto/update-session-plan.dto';
import { PlanStatus, PlanVisibility, SessionPlan } from './entities/session-plan.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionPlan) private repo: Repository<SessionPlan>,
    @InjectRepository(CoachAssignment) private assignmentRepo: Repository<CoachAssignment>,
    private clubsService: ClubsService,
  ) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  // Admin: all plans for the club
  async findAll(clubId: string): Promise<SessionPlan[]> {
    return this.repo.find({
      where: { clubId },
      order: { createdAt: 'DESC' },
    });
  }

  // Coach: own plans + squad/club-visible plans for their assigned squads
  async findForCoach(clubId: string, coachId: string): Promise<SessionPlan[]> {
    const assignments = await this.assignmentRepo.find({ where: { userId: coachId } });
    const squadIds = assignments.map(a => a.squadId);
    if (!squadIds.length) return [];

    return this.repo
      .createQueryBuilder('plan')
      .where('plan.clubId = :clubId', { clubId })
      .andWhere('plan.squadId IN (:...squadIds)', { squadIds })
      .andWhere(
        '(plan.coachId = :coachId OR plan.visibility = :squad OR plan.visibility = :club)',
        { coachId, squad: PlanVisibility.Squad, club: PlanVisibility.Club },
      )
      .orderBy('plan.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, clubId: string): Promise<SessionPlan> {
    const plan = await this.repo.findOne({ where: { id, clubId } });
    if (!plan) throw new NotFoundException('Session plan not found');
    return plan;
  }

  // ── Create ────────────────────────────────────────────────────────────────

  async create(dto: CreateSessionPlanDto, userId: string, clubId: string, role: string): Promise<SessionPlan> {
    if (role === 'coach') {
      const settings = await this.clubsService.getSettings(clubId);
      const perms = settings.coachPermissions;
      const allowed: Record<string, boolean> = {
        'single-session':   perms.canCreateSingleSession,
        'weekly-plan':      perms.canCreateWeeklyPlan,
        'multi-week-block': perms.canCreateMultiWeekBlock,
        'season-plan':      perms.canCreateSeasonPlan,
      };
      if (!allowed[dto.type]) {
        throw new ForbiddenException(`Your club does not allow coaches to create ${dto.type} plans.`);
      }
    }

    const plan = this.repo.create({
      ...dto,
      coachId: role === 'coach' ? userId : null,
      clubId,
      createdByRole: role,
    });
    return this.repo.save(plan);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateSessionPlanDto, clubId: string, userId: string, role: string): Promise<SessionPlan> {
    const plan = await this.findOne(id, clubId);
    if (role === 'coach' && plan.createdByRole === 'admin') {
      const settings = await this.clubsService.getSettings(clubId);
      if (!settings.coachPermissions.canEditAdminPlans) {
        throw new ForbiddenException('Coaches cannot edit admin-created plans at this club.');
      }
    }
    Object.assign(plan, dto);
    return this.repo.save(plan);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async delete(id: string, clubId: string, userId: string, role: string): Promise<void> {
    const plan = await this.findOne(id, clubId);
    if (role === 'coach') {
      const settings = await this.clubsService.getSettings(clubId);
      if (!settings.coachPermissions.canDeleteOwnPlans) {
        throw new ForbiddenException('Your club does not allow coaches to delete plans.');
      }
    }
    await this.repo.remove(plan);
  }

  // ── Archive ───────────────────────────────────────────────────────────────

  async archive(id: string, clubId: string): Promise<SessionPlan> {
    const plan = await this.findOne(id, clubId);
    plan.status = PlanStatus.Archived;
    return this.repo.save(plan);
  }

  // ── Duplicate ─────────────────────────────────────────────────────────────

  async duplicate(id: string, userId: string, clubId: string, role: string): Promise<SessionPlan> {
    const original = await this.findOne(id, clubId);
    const copy = this.repo.create({
      title: `${original.title} (Copy)`,
      type: original.type,
      status: PlanStatus.Draft,
      competitionPhase: original.competitionPhase,
      squadId: original.squadId,
      coachId: role === 'coach' ? userId : null,
      clubId,
      createdByRole: role,
      visibility: PlanVisibility.Private,
      tags: original.tags ? [...original.tags] : null,
      data: original.data ? JSON.parse(JSON.stringify(original.data)) : null,
    });
    return this.repo.save(copy);
  }
}
