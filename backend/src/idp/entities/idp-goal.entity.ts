import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Idp } from './idp.entity';

export enum GoalStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  OnTrack = 'on-track',
  AtRisk = 'at-risk',
  Completed = 'completed',
}

@Entity('idp_goals')
export class IdpGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idpId: string;

  @ManyToOne(() => Idp, (idp) => idp.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idpId' })
  idp: Idp;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ nullable: true, type: 'varchar' })
  category: string | null;

  @Column({ nullable: true, type: 'date' })
  targetDate: string | null;

  @Column({ nullable: true, type: 'varchar' })
  kpi: string | null;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.NotStarted })
  status: GoalStatus;

  @Column({ type: 'int', nullable: true })
  coachRating: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
