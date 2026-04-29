import { existsSync } from 'fs';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Club } from './clubs/entities/club.entity';
import { ClubsModule } from './clubs/clubs.module';
import { DatabaseModule } from './database/database.module';
import { IdpGoal } from './idp/entities/idp-goal.entity';
import { IdpProgressNote } from './idp/entities/idp-progress-note.entity';
import { Idp } from './idp/entities/idp.entity';
import { IdpModule } from './idp/idp.module';
import { Player } from './players/entities/player.entity';
import { MethodologyConfig } from './methodology/entities/methodology.entity';
import { MethodologyModule } from './methodology/methodology.module';
import { ScheduleEntry } from './schedule/entities/schedule-entry.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { WellnessCheckin } from './wellness/entities/wellness-checkin.entity';
import { WellnessModule } from './wellness/wellness.module';
import { SessionPlan } from './sessions/entities/session-plan.entity';
import { SessionsModule } from './sessions/sessions.module';
import { CoachAssignment } from './squads/entities/coach-assignment.entity';
import { Squad } from './squads/entities/squad.entity';
import { SquadsModule } from './squads/squads.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ProvisionModule } from './provision/provision.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(existsSync(join(__dirname, '..', 'public'))
      ? [ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public'), exclude: ['/api/(.*)'] })]
      : []),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [User, Club, Squad, Player, CoachAssignment, Idp, IdpGoal, IdpProgressNote, SessionPlan, ScheduleEntry, MethodologyConfig, WellnessCheckin],
            synchronize: true,
            logging: false,
          };
        }
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USER', 'postgres'),
          password: config.get<string>('DB_PASS', 'postgres'),
          database: config.get<string>('DB_NAME', 'backroom'),
          entities: [User, Club, Squad, Player, CoachAssignment, Idp, IdpGoal, IdpProgressNote, SessionPlan, ScheduleEntry, MethodologyConfig, WellnessCheckin],
          synchronize: true,
          logging: false,
        };
      },
    }),
    ClubsModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    SquadsModule,
    IdpModule,
    SessionsModule,
    ScheduleModule,
    MethodologyModule,
    WellnessModule,
    ProvisionModule,
  ],
})
export class AppModule {}
