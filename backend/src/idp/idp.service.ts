import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { AddProgressNoteDto } from './dto/add-progress-note.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CreateIdpDto } from './dto/create-idp.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { UpdateEliteDto } from './dto/update-elite.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateSwotDto } from './dto/update-swot.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { IdpGoal } from './entities/idp-goal.entity';
import { IdpProgressNote } from './entities/idp-progress-note.entity';
import { Idp, IdpStatus } from './entities/idp.entity';

@Injectable()
export class IdpService {
  constructor(
    @InjectRepository(Idp) private idpRepo: Repository<Idp>,
    @InjectRepository(IdpGoal) private goalRepo: Repository<IdpGoal>,
    @InjectRepository(IdpProgressNote) private noteRepo: Repository<IdpProgressNote>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async findAll(clubId: string): Promise<any[]> {
    const idps = await this.idpRepo.find({
      where: { clubId },
      relations: ['player', 'squad', 'goals', 'notes'],
      order: { createdAt: 'ASC' },
    });
    return idps.map((idp) => this.shape(idp));
  }

  async findOne(id: string, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({
      where: { id, clubId },
      relations: ['player', 'squad', 'goals', 'notes'],
    });
    if (!idp) throw new NotFoundException('IDP not found');
    return this.shape(idp);
  }

  async findMine(userId: string, clubId: string): Promise<any | null> {
    const player = await this.playerRepo.findOne({ where: { userId, clubId } });
    if (!player) return null;
    const idp = await this.idpRepo.findOne({
      where: { playerId: player.id, clubId },
      relations: ['player', 'squad', 'goals', 'notes'],
    });
    if (!idp) return null;
    return this.shape(idp);
  }

  // ── Create / Delete IDP ───────────────────────────────────────────────────

  async create(dto: CreateIdpDto, clubId: string): Promise<any> {
    const idp = this.idpRepo.create({ ...dto, clubId });
    const saved = await this.idpRepo.save(idp);
    return this.findOne(saved.id, clubId);
  }

  async delete(id: string, clubId: string): Promise<void> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    await this.idpRepo.remove(idp);
  }

  // ── Status ────────────────────────────────────────────────────────────────

  async updateStatus(id: string, status: IdpStatus, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    idp.status = status;
    await this.idpRepo.save(idp);
    return this.findOne(id, clubId);
  }

  // ── Goals ─────────────────────────────────────────────────────────────────

  async addGoal(idpId: string, dto: CreateGoalDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id: idpId, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    const goal = this.goalRepo.create({ ...dto, idpId });
    await this.goalRepo.save(goal);
    return this.findOne(idpId, clubId);
  }

  async updateGoal(idpId: string, goalId: string, dto: UpdateGoalDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id: idpId, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    const goal = await this.goalRepo.findOne({ where: { id: goalId, idpId } });
    if (!goal) throw new NotFoundException('Goal not found');
    Object.assign(goal, dto);
    await this.goalRepo.save(goal);
    return this.findOne(idpId, clubId);
  }

  async deleteGoal(idpId: string, goalId: string, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id: idpId, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    const goal = await this.goalRepo.findOne({ where: { id: goalId, idpId } });
    if (!goal) throw new NotFoundException('Goal not found');
    await this.goalRepo.remove(goal);
    return this.findOne(idpId, clubId);
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  async updateComments(id: string, dto: UpdateCommentsDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    idp.coachComments = dto.comments ?? null;
    await this.idpRepo.save(idp);
    return this.findOne(id, clubId);
  }

  // ── Progress Notes ────────────────────────────────────────────────────────

  async addProgressNote(idpId: string, dto: AddProgressNoteDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id: idpId, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    const note = this.noteRepo.create({ ...dto, idpId });
    await this.noteRepo.save(note);
    return this.findOne(idpId, clubId);
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  async updateTimeline(id: string, dto: UpdateTimelineDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    if (dto.startDate !== undefined) idp.startDate = dto.startDate;
    if (dto.targetCompletionDate !== undefined) idp.targetCompletionDate = dto.targetCompletionDate;
    if (dto.reviewDate !== undefined) idp.reviewDate = dto.reviewDate;
    await this.idpRepo.save(idp);
    return this.findOne(id, clubId);
  }

  // ── SWOT ──────────────────────────────────────────────────────────────────

  async updateSwot(id: string, dto: UpdateSwotDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    idp.swot = {
      strengths: dto.strengths ?? idp.swot?.strengths ?? '',
      weaknesses: dto.weaknesses ?? idp.swot?.weaknesses ?? '',
      opportunities: dto.opportunities ?? idp.swot?.opportunities ?? '',
      threats: dto.threats ?? idp.swot?.threats ?? '',
    };
    await this.idpRepo.save(idp);
    return this.findOne(id, clubId);
  }

  // ── Elite fields ──────────────────────────────────────────────────────────

  async updateElite(id: string, dto: UpdateEliteDto, clubId: string): Promise<any> {
    const idp = await this.idpRepo.findOne({ where: { id, clubId } });
    if (!idp) throw new NotFoundException('IDP not found');
    Object.assign(idp, dto);
    await this.idpRepo.save(idp);
    return this.findOne(id, clubId);
  }

  // ── Shape ─────────────────────────────────────────────────────────────────

  private shape(idp: Idp): any {
    const progress = this.computeProgress(idp.goals ?? []);
    return {
      id: idp.id,
      mode: idp.mode,
      status: idp.status,
      ageGroup: idp.ageGroup,
      reviewDate: idp.reviewDate,
      startDate: idp.startDate ?? null,
      targetCompletionDate: idp.targetCompletionDate ?? null,
      coachComments: idp.coachComments,
      clubId: idp.clubId,
      squadId: idp.squadId,
      playerId: idp.playerId,
      createdAt: idp.createdAt,
      updatedAt: idp.updatedAt,
      progress,
      // Elite fields
      holisticEvaluation: idp.holisticEvaluation ?? null,
      primaryPosition: idp.primaryPosition ?? null,
      secondaryPosition: idp.secondaryPosition ?? null,
      positionalDemands: idp.positionalDemands ?? null,
      performanceSupport: idp.performanceSupport ?? null,
      offFieldDevelopment: idp.offFieldDevelopment ?? null,
      methodologyTags: idp.methodologyTags ?? null,
      swot: idp.swot ?? null,
      subSkillEvaluations: idp.subSkillEvaluations ?? null,
      // Relations
      player: idp.player
        ? { id: idp.player.id, firstName: idp.player.firstName, lastName: idp.player.lastName, position: idp.player.position }
        : null,
      squad: idp.squad
        ? { id: idp.squad.id, name: idp.squad.name, ageGroup: idp.squad.ageGroup }
        : null,
      goals: (idp.goals ?? []).map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        targetDate: g.targetDate,
        kpi: g.kpi,
        progress: g.progress,
        status: g.status,
        coachRating: g.coachRating,
      })),
      notes: (idp.notes ?? [])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((n) => ({
          id: n.id,
          content: n.content,
          status: n.status,
          createdAt: n.createdAt,
        })),
    };
  }

  private computeProgress(goals: IdpGoal[]): number {
    if (!goals.length) return 0;
    return Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
  }
}
