import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';
import { User } from '../users/entities/user.entity';
import { ProvisionController } from './provision.controller';
import { ProvisionEmailService } from './provision-email.service';
import { ProvisionService } from './provision.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club, User])],
  controllers: [ProvisionController],
  providers: [ProvisionService, ProvisionEmailService],
})
export class ProvisionModule {}
