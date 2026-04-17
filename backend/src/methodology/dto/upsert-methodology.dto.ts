import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CorePrincipleDto {
  @IsString() title: string;
  @IsString() desc: string;
}

class PlayerPositionDto {
  @IsString() id: string;
  @IsString() position: string;
  @IsString() ageGroups: string;
  @IsString() roles: string;
  @IsString() responsibilities: string;
  @IsString() playerType: string;
  @IsString() keyAttributes: string;
}

export class UpsertMethodologyDto {
  @IsString()
  @IsOptional()
  philosophy?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CorePrincipleDto)
  corePrinciples?: CorePrincipleDto[];

  @IsArray()
  @IsOptional()
  nonNegotiables?: string[];

  @IsString()
  @IsOptional()
  playerDevelopmentPhilosophy?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PlayerPositionDto)
  playerPositions?: PlayerPositionDto[];

  @IsObject()
  @IsOptional()
  customSections?: Record<string, { id: string; title: string; content: string }[]>;
}
