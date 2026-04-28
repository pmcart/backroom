import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/entities/player.entity';
import { IdpGoal } from './entities/idp-goal.entity';
import { IdpProgressNote } from './entities/idp-progress-note.entity';
import { Idp } from './entities/idp.entity';
import { IdpController } from './idp.controller';
import { IdpEmailService } from './idp-email.service';
import { IdpPdfService } from './idp-pdf.service';
import { IdpService } from './idp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idp, IdpGoal, IdpProgressNote, Player])],
  controllers: [IdpController],
  providers: [IdpService, IdpPdfService, IdpEmailService],
  exports: [IdpService],
})
export class IdpModule {}
