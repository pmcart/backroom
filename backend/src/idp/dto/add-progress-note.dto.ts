import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NoteStatus } from '../entities/idp-progress-note.entity';

export class AddProgressNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(NoteStatus)
  status: NoteStatus;
}
