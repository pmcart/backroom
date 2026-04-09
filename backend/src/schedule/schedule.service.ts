import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { ScheduleEntry } from './entities/schedule-entry.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntry)
    private readonly repo: Repository<ScheduleEntry>,
  ) {}

  /** Return all entries whose date falls within the 7-day window starting at weekStart (YYYY-MM-DD). */
  getByWeek(weekStart: string, clubId: string): Promise<ScheduleEntry[]> {
    const start = weekStart;
    const end   = offsetDate(weekStart, 6);
    return this.repo.find({
      where: { clubId, date: Between(start, end) },
      order: { date: 'ASC', createdAt: 'ASC' },
    });
  }

  create(dto: CreateScheduleEntryDto, clubId: string): Promise<ScheduleEntry> {
    const entry = this.repo.create({ ...dto, clubId });
    return this.repo.save(entry);
  }

  async delete(id: string, clubId: string): Promise<void> {
    const entry = await this.repo.findOne({ where: { id, clubId } });
    if (!entry) throw new NotFoundException('Schedule entry not found');
    await this.repo.remove(entry);
  }
}

/** Add `days` calendar days to an ISO date string and return the new ISO date string. */
function offsetDate(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
