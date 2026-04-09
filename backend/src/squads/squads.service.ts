import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { UpdatePlayerDto } from '../players/dto/update-player.dto';
import { Player } from '../players/entities/player.entity';
import { User } from '../users/entities/user.entity';
import { CreateSquadDto } from './dto/create-squad.dto';
import { CoachAssignment } from './entities/coach-assignment.entity';
import { Squad } from './entities/squad.entity';

@Injectable()
export class SquadsService {
  constructor(
    @InjectRepository(Squad) private squadsRepo: Repository<Squad>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    @InjectRepository(CoachAssignment) private assignmentsRepo: Repository<CoachAssignment>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async findAll(clubId: string): Promise<any[]> {
    const squads = await this.squadsRepo.find({
      where: { clubId },
      relations: ['players', 'coachAssignments', 'coachAssignments.user'],
      order: { createdAt: 'ASC' },
    });
    return squads.map((s) => this.sanitize(s));
  }

  async findOne(id: string, clubId: string): Promise<any> {
    const squad = await this.squadsRepo.findOne({
      where: { id, clubId },
      relations: ['players', 'coachAssignments', 'coachAssignments.user'],
    });
    if (!squad) throw new NotFoundException('Squad not found');
    return this.sanitize(squad);
  }

  async create(dto: CreateSquadDto, clubId: string): Promise<any> {
    const squad = this.squadsRepo.create({ ...dto, clubId });
    const saved = await this.squadsRepo.save(squad);
    saved.players = [];
    saved.coachAssignments = [];
    return this.sanitize(saved);
  }

  // ── Players ────────────────────────────────────────────────────────────────

  async addPlayer(squadId: string, dto: CreatePlayerDto, clubId: string): Promise<Player> {
    await this.findOne(squadId, clubId);
    const player = this.playersRepo.create({ ...dto, squadId, clubId });
    return this.playersRepo.save(player);
  }

  async updatePlayer(squadId: string, playerId: string, dto: UpdatePlayerDto, clubId: string): Promise<Player> {
    const player = await this.playersRepo.findOne({ where: { id: playerId, squadId, clubId } });
    if (!player) throw new NotFoundException('Player not found');
    Object.assign(player, dto);
    return this.playersRepo.save(player);
  }

  async removePlayer(squadId: string, playerId: string, clubId: string): Promise<void> {
    const player = await this.playersRepo.findOne({ where: { id: playerId, squadId, clubId } });
    if (!player) throw new NotFoundException('Player not found');
    await this.playersRepo.remove(player);
  }

  async importPlayers(squadId: string, dtos: CreatePlayerDto[], clubId: string): Promise<{ imported: number }> {
    await this.findOne(squadId, clubId);
    const entities = dtos.map((p) => this.playersRepo.create({ ...p, squadId, clubId }));
    await this.playersRepo.save(entities);
    return { imported: entities.length };
  }

  /** Club players not already in this squad — for "add existing player" picker */
  async getAvailablePlayers(squadId: string, clubId: string): Promise<Player[]> {
    await this.findOne(squadId, clubId);
    return this.playersRepo.find({
      where: { clubId, squadId: Not(squadId) },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  /** Move an existing club player into this squad */
  async assignPlayer(squadId: string, playerId: string, clubId: string): Promise<Player> {
    await this.findOne(squadId, clubId);
    const player = await this.playersRepo.findOne({ where: { id: playerId, clubId } });
    if (!player) throw new NotFoundException('Player not found');
    player.squadId = squadId;
    return this.playersRepo.save(player);
  }

  // ── Coaches ────────────────────────────────────────────────────────────────

  /** Club coaches not already assigned to this squad — for "assign existing coach" picker */
  async getAvailableCoaches(squadId: string, clubId: string): Promise<Partial<User>[]> {
    await this.findOne(squadId, clubId);
    const assigned = await this.assignmentsRepo.find({ where: { squadId, clubId } });
    const assignedIds = assigned.map((a) => a.userId);

    const coaches = await this.usersRepo.find({ where: { clubId, role: Role.Coach, isActive: true } });
    return coaches
      .filter((c) => !assignedIds.includes(c.id))
      .map(({ id, firstName, lastName }) => ({ id, firstName, lastName }));
  }

  /** Assign an existing coach user to this squad */
  async addCoach(squadId: string, userId: string, clubId: string): Promise<any> {
    await this.findOne(squadId, clubId);
    const user = await this.usersRepo.findOne({ where: { id: userId, clubId, role: Role.Coach } });
    if (!user) throw new NotFoundException('Coach not found');

    const existing = await this.assignmentsRepo.findOne({ where: { squadId, userId, clubId } });
    if (existing) throw new ConflictException('Coach is already assigned to this squad');

    const assignment = await this.assignmentsRepo.save(
      this.assignmentsRepo.create({ userId, squadId, clubId }),
    );
    return { ...assignment, user: { id: user.id, firstName: user.firstName, lastName: user.lastName } };
  }

  /** Create a new coach user and assign them to this squad */
  async createCoach(
    squadId: string,
    dto: { firstName: string; lastName: string; email: string },
    clubId: string,
  ): Promise<any> {
    await this.findOne(squadId, clubId);

    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('A user with this email already exists');

    const user = this.usersRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: 'Password1',
      role: Role.Coach,
      clubId,
      isActive: true,
    });
    const saved = await this.usersRepo.save(user);

    const assignment = await this.assignmentsRepo.save(
      this.assignmentsRepo.create({ userId: saved.id, squadId, clubId }),
    );
    return { ...assignment, user: { id: saved.id, firstName: saved.firstName, lastName: saved.lastName } };
  }

  /** Delete a squad and all its related data */
  async deleteSquad(squadId: string, clubId: string): Promise<void> {
    const squad = await this.squadsRepo.findOne({ where: { id: squadId, clubId } });
    if (!squad) throw new NotFoundException('Squad not found');
    await this.squadsRepo.remove(squad);
  }

  /** Remove a coach assignment */
  async removeCoach(squadId: string, assignmentId: string, clubId: string): Promise<void> {
    const assignment = await this.assignmentsRepo.findOne({ where: { id: assignmentId, squadId, clubId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    await this.assignmentsRepo.remove(assignment);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private sanitize(squad: Squad): any {
    return {
      ...squad,
      coachAssignments: (squad.coachAssignments ?? []).map((ca) => ({
        id: ca.id,
        userId: ca.userId,
        squadId: ca.squadId,
        clubId: ca.clubId,
        createdAt: ca.createdAt,
        user: ca.user
          ? { id: ca.user.id, firstName: ca.user.firstName, lastName: ca.user.lastName }
          : null,
      })),
    };
  }
}
