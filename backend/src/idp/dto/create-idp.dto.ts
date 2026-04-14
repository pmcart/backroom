import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IdpMode } from '../entities/idp.entity';

export class CreateIdpDto {
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  squadId: string;

  @IsEnum(IdpMode)
  @IsOptional()
  mode?: IdpMode;

  @IsString()
  @IsOptional()
  ageGroup?: string;

  @IsString()
  @IsOptional()
  reviewDate?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  targetCompletionDate?: string;
}
