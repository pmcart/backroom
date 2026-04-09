import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlayerStatus } from '../entities/player.entity';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

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
