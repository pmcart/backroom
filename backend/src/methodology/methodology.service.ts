import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertMethodologyDto } from './dto/upsert-methodology.dto';
import { MethodologyConfig } from './entities/methodology.entity';

@Injectable()
export class MethodologyService {
  constructor(
    @InjectRepository(MethodologyConfig)
    private repo: Repository<MethodologyConfig>,
  ) {}

  async get(clubId: string): Promise<MethodologyConfig> {
    let config = await this.repo.findOne({ where: { clubId } });
    if (!config) {
      config = this.repo.create({ clubId });
      await this.repo.save(config);
    }
    return config;
  }

  async upsert(dto: UpsertMethodologyDto, clubId: string): Promise<MethodologyConfig> {
    let config = await this.repo.findOne({ where: { clubId } });
    if (!config) {
      config = this.repo.create({ clubId });
    }
    Object.assign(config, dto);
    return this.repo.save(config);
  }
}
