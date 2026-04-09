import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CompetitionPhase, PlanStatus } from '../entities/session-plan.entity';

export class UpdateSessionPlanDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;

  @IsEnum(CompetitionPhase)
  @IsOptional()
  competitionPhase?: CompetitionPhase;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsOptional()
  data?: any;
}
