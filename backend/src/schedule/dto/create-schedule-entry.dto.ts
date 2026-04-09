import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleEntryType } from '../entities/schedule-entry.entity';

export class CreateScheduleEntryDto {
  @IsString()
  @IsNotEmpty()
  squadId: string;

  /** YYYY-MM-DD */
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(ScheduleEntryType)
  type: ScheduleEntryType;
}
