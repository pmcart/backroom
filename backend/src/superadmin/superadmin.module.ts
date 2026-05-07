import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../clubs/entities/club.entity';
import { User } from '../users/entities/user.entity';
import { Squad } from '../squads/entities/squad.entity';
import { ProvisionModule } from '../provision/provision.module';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, User, Squad]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' as const },
      }),
    }),
    ProvisionModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule {}
