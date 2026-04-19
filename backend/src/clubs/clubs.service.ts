import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club, ClubSettings, DEFAULT_CLUB_SETTINGS } from './entities/club.entity';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';

@Injectable()
export class ClubsService {
  constructor(@InjectRepository(Club) private repo: Repository<Club>) {}

  async getSettings(clubId: string): Promise<ClubSettings> {
    const club = await this.repo.findOne({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Club not found');
    return club.settings ?? DEFAULT_CLUB_SETTINGS;
  }

  async updateSettings(clubId: string, dto: UpdateClubSettingsDto): Promise<ClubSettings> {
    const club = await this.repo.findOne({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Club not found');
    const current = club.settings ?? DEFAULT_CLUB_SETTINGS;
    club.settings = {
      coachPermissions: { ...current.coachPermissions, ...dto.coachPermissions },
    };
    await this.repo.save(club);
    return club.settings;
  }
}
