import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ScheduleEntryType {
  Training  = 'training',
  Match     = 'match',
  Recovery  = 'recovery',
  Rest      = 'rest',
}

@Entity('schedule_entries')
export class ScheduleEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clubId: string;

  @Column()
  squadId: string;

  /** ISO date string: YYYY-MM-DD */
  @Column()
  date: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ScheduleEntryType, default: ScheduleEntryType.Training })
  type: ScheduleEntryType;

  @CreateDateColumn()
  createdAt: Date;
}
