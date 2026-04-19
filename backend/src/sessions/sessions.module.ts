import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from '../clubs/clubs.module';
import { CoachAssignment } from '../squads/entities/coach-assignment.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionPlan } from './entities/session-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionPlan, CoachAssignment]),
    ClubsModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
