import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CompetitionPhase, PlanStatus, PlanType, PlanVisibility } from '../entities/session-plan.entity';

export class CreateSessionPlanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(PlanType)
  type: PlanType;

  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;

  @IsEnum(CompetitionPhase)
  @IsOptional()
  competitionPhase?: CompetitionPhase;

  @IsString()
  squadId: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsEnum(PlanVisibility)
  @IsOptional()
  visibility?: PlanVisibility;

  @IsOptional()
  data?: any;
}
