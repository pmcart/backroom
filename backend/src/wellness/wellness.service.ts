import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { WellnessCheckin } from './entities/wellness-checkin.entity';

@Injectable()
export class WellnessService {
  constructor(
    @InjectRepository(WellnessCheckin) private repo: Repository<WellnessCheckin>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  async create(dto: CreateCheckinDto, userId: string, clubId: string): Promise<WellnessCheckin> {
    const player = await this.playerRepo.findOne({ where: { userId, clubId } });

    const avg = (dto.sleepQuality + dto.nutrition + dto.hydration + dto.recovery + dto.mood) / 5;
    const overallLevel = avg >= 3.5 ? 'green' : avg >= 2.5 ? 'amber' : 'red';

    const today = new Date().toISOString().split('T')[0];

    const checkin = this.repo.create({
      userId,
      clubId,
      playerId: player?.id ?? null,
      squadId: player?.squadId ?? null,
      date: today,
      sleepQuality: dto.sleepQuality,
      nutrition: dto.nutrition,
      hydration: dto.hydration,
      recovery: dto.recovery,
      mood: dto.mood,
      breakfast: dto.breakfast,
      lunch: dto.lunch,
      dinner: dto.dinner,
      snacks: dto.snacks,
      waterIntake: dto.waterIntake,
      hoursSlept: dto.hoursSlept,
      bedtime: dto.bedtime ?? null,
      wakeTime: dto.wakeTime ?? null,
      notesToCoach: dto.notesToCoach ?? null,
      overallLevel,
    });

    return this.repo.save(checkin);
  }

  async getStreak(userId: string, clubId: string): Promise<number> {
    const checkins = await this.repo.find({
      where: { userId, clubId },
      order: { date: 'DESC' },
      select: ['date'],
    });

    if (!checkins.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = new Date(today.getTime() - 86_400_000).toISOString().split('T')[0];

    const mostRecent = checkins[0].date;
    if (mostRecent !== todayStr && mostRecent !== yesterdayStr) return 0;

    let streak = 1;
    const cursor = new Date(mostRecent);

    for (let i = 1; i < checkins.length; i++) {
      cursor.setDate(cursor.getDate() - 1);
      const expected = cursor.toISOString().split('T')[0];
      if (checkins[i].date === expected) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async findByClub(clubId: string): Promise<WellnessCheckin[]> {
    return this.repo.find({
      where: { clubId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }
}
