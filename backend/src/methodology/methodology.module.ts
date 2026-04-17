import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodologyConfig } from './entities/methodology.entity';
import { MethodologyController } from './methodology.controller';
import { MethodologyService } from './methodology.service';

@Module({
  imports: [TypeOrmModule.forFeature([MethodologyConfig])],
  controllers: [MethodologyController],
  providers: [MethodologyService],
})
export class MethodologyModule {}
