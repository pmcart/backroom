import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { GoalStatus } from '../entities/idp-goal.entity';

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  kpi?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  coachRating?: number | null;
}
