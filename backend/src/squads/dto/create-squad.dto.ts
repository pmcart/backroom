import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSquadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ageGroup: string;
}
