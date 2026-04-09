import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionPlanDto } from './dto/create-session-plan.dto';
import { UpdateSessionPlanDto } from './dto/update-session-plan.dto';
import { PlanStatus, SessionPlan } from './entities/session-plan.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionPlan) private repo: Repository<SessionPlan>,
  ) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async findAll(clubId: string): Promise<SessionPlan[]> {
    return this.repo.find({
      where: { clubId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, clubId: string): Promise<SessionPlan> {
    const plan = await this.repo.findOne({ where: { id, clubId } });
    if (!plan) throw new NotFoundException('Session plan not found');
    return plan;
  }

  // ── Create / Delete ───────────────────────────────────────────────────────

  async create(dto: CreateSessionPlanDto, coachId: string, clubId: string): Promise<SessionPlan> {
    const plan = this.repo.create({ ...dto, coachId, clubId });
    return this.repo.save(plan);
  }

  async delete(id: string, clubId: string): Promise<void> {
    const plan = await this.findOne(id, clubId);
    await this.repo.remove(plan);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateSessionPlanDto, clubId: string): Promise<SessionPlan> {
    const plan = await this.findOne(id, clubId);
    Object.assign(plan, dto);
    return this.repo.save(plan);
  }

  // ── Archive ───────────────────────────────────────────────────────────────

  async archive(id: string, clubId: string): Promise<SessionPlan> {
    const plan = await this.findOne(id, clubId);
    plan.status = PlanStatus.Archived;
    return this.repo.save(plan);
  }

  // ── Duplicate ─────────────────────────────────────────────────────────────

  async duplicate(id: string, coachId: string, clubId: string): Promise<SessionPlan> {
    const original = await this.findOne(id, clubId);
    const copy = this.repo.create({
      title: `${original.title} (Copy)`,
      type: original.type,
      status: PlanStatus.Draft,
      competitionPhase: original.competitionPhase,
      squadId: original.squadId,
      coachId,
      clubId,
      tags: original.tags ? [...original.tags] : null,
      data: original.data ? JSON.parse(JSON.stringify(original.data)) : null,
    });
    return this.repo.save(copy);
  }
}
