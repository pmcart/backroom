import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlayerStatus } from '../entities/player.entity';

export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(PlayerStatus)
  @IsOptional()
  status?: PlayerStatus;
}
