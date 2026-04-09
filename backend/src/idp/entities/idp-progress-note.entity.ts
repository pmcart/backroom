import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Idp } from './idp.entity';

export enum NoteStatus {
  OnTrack = 'on-track',
  NeedsAttention = 'needs-attention',
  Exceeding = 'exceeding',
}

@Entity('idp_progress_notes')
export class IdpProgressNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idpId: string;

  @ManyToOne(() => Idp, (idp) => idp.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idpId' })
  idp: Idp;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: NoteStatus, default: NoteStatus.OnTrack })
  status: NoteStatus;

  @CreateDateColumn()
  createdAt: Date;
}
