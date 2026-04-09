import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateEliteDto {
  @IsObject()
  @IsOptional()
  holisticEvaluation?: Record<string, number>;

  @IsString()
  @IsOptional()
  primaryPosition?: string;

  @IsString()
  @IsOptional()
  secondaryPosition?: string;

  @IsArray()
  @IsOptional()
  positionalDemands?: string[];

  @IsString()
  @IsOptional()
  performanceSupport?: string;

  @IsString()
  @IsOptional()
  offFieldDevelopment?: string;

  @IsArray()
  @IsOptional()
  methodologyTags?: string[];
}
