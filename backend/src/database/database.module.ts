import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';
import { IdpGoal } from '../idp/entities/idp-goal.entity';
import { Idp } from '../idp/entities/idp.entity';
import { Player } from '../players/entities/player.entity';
import { ScheduleEntry } from '../schedule/entities/schedule-entry.entity';
import { SessionPlan } from '../sessions/entities/session-plan.entity';
import { CoachAssignment } from '../squads/entities/coach-assignment.entity';
import { Squad } from '../squads/entities/squad.entity';
import { User } from '../users/entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club, User, Squad, Player, CoachAssignment, Idp, IdpGoal, SessionPlan, ScheduleEntry])],
  providers: [SeedService],
})
export class DatabaseModule {}
