import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdpGoal } from './entities/idp-goal.entity';
import { IdpProgressNote } from './entities/idp-progress-note.entity';
import { Idp } from './entities/idp.entity';
import { IdpController } from './idp.controller';
import { IdpService } from './idp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idp, IdpGoal, IdpProgressNote])],
  controllers: [IdpController],
  providers: [IdpService],
  exports: [IdpService],
})
export class IdpModule {}
