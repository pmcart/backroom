import { IsOptional, IsString } from 'class-validator';

export class UpdateSwotDto {
  @IsString()
  @IsOptional()
  strengths?: string;

  @IsString()
  @IsOptional()
  weaknesses?: string;

  @IsString()
  @IsOptional()
  opportunities?: string;

  @IsString()
  @IsOptional()
  threats?: string;
}
