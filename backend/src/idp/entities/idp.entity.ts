import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Squad } from '../../squads/entities/squad.entity';
import { IdpGoal } from './idp-goal.entity';
import { IdpProgressNote } from './idp-progress-note.entity';

export enum IdpStatus {
  Active = 'active',
  ReviewDue = 'review-due',
  Completed = 'completed',
}

export enum IdpMode {
  Standard = 'standard',
  Elite = 'elite',
}

@Entity('idps')
export class Idp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  playerId: string;

  @ManyToOne(() => Player, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column()
  squadId: string;

  @ManyToOne(() => Squad, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'squadId' })
  squad: Squad;

  @Column()
  clubId: string;

  @Column({ type: 'enum', enum: IdpMode, default: IdpMode.Standard })
  mode: IdpMode;

  @Column({ type: 'enum', enum: IdpStatus, default: IdpStatus.Active })
  status: IdpStatus;

  @Column({ nullable: true, type: 'varchar' })
  ageGroup: string | null;

  @Column({ nullable: true, type: 'date' })
  reviewDate: string | null;

  @Column({ nullable: true, type: 'date' })
  startDate: string | null;

  @Column({ nullable: true, type: 'date' })
  targetCompletionDate: string | null;

  @Column({ nullable: true, type: 'text' })
  coachComments: string | null;

  // ── Elite fields ─────────────────────────────────────────────────────────

  @Column({ nullable: true, type: 'jsonb' })
  holisticEvaluation: Record<string, number> | null;

  @Column({ nullable: true, type: 'varchar' })
  primaryPosition: string | null;

  @Column({ nullable: true, type: 'varchar' })
  secondaryPosition: string | null;

  @Column({ nullable: true, type: 'jsonb' })
  positionalDemands: string[] | null;

  @Column({ nullable: true, type: 'text' })
  performanceSupport: string | null;

  @Column({ nullable: true, type: 'text' })
  offFieldDevelopment: string | null;

  @Column({ nullable: true, type: 'jsonb' })
  methodologyTags: string[] | null;

  @Column({ nullable: true, type: 'jsonb' })
  swot: { strengths: string; weaknesses: string; opportunities: string; threats: string } | null;

  @Column({ nullable: true, type: 'jsonb' })
  subSkillEvaluations: Record<string, Record<string, number>> | null;

  // ── Relations ─────────────────────────────────────────────────────────────

  @OneToMany(() => IdpGoal, (goal) => goal.idp, { cascade: true })
  goals: IdpGoal[];

  @OneToMany(() => IdpProgressNote, (note) => note.idp, { cascade: true })
  notes: IdpProgressNote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
