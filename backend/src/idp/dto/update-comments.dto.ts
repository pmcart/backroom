import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentsDto {
  @IsString()
  @IsOptional()
  comments?: string;
}
