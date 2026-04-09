import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { User } from '../users/entities/user.entity';
import { CoachAssignment } from './entities/coach-assignment.entity';
import { Squad } from './entities/squad.entity';
import { SquadsController } from './squads.controller';
import { SquadsService } from './squads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Squad, Player, CoachAssignment, User])],
  controllers: [SquadsController],
  providers: [SquadsService],
  exports: [SquadsService],
})
export class SquadsModule {}
