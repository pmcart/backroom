import { IsOptional, IsString } from 'class-validator';

export class UpdateTimelineDto {
  @IsString()
  @IsOptional()
  startDate?: string | null;

  @IsString()
  @IsOptional()
  targetCompletionDate?: string | null;

  @IsString()
  @IsOptional()
  reviewDate?: string | null;
}
