import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanType {
  SingleSession    = 'single-session',
  WeeklyPlan       = 'weekly-plan',
  MultiWeekBlock   = 'multi-week-block',
  SeasonPlan       = 'season-plan',
}

export enum PlanStatus {
  Active   = 'active',
  Draft    = 'draft',
  Archived = 'archived',
}

export enum CompetitionPhase {
  PreSeason  = 'pre-season',
  InSeason   = 'in-season',
  PostSeason = 'post-season',
  OffSeason  = 'off-season',
}

export enum PlanVisibility {
  Private = 'private',
  Squad   = 'squad',
  Club    = 'club',
}

@Entity('session_plans')
export class SessionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: PlanType })
  type: PlanType;

  @Column({ type: 'enum', enum: PlanStatus, default: PlanStatus.Draft })
  status: PlanStatus;

  @Column({ type: 'enum', enum: CompetitionPhase, nullable: true })
  competitionPhase: CompetitionPhase | null;

  @Column()
  squadId: string;

  @Column({ type: 'varchar', nullable: true })
  coachId: string | null;

  @Column()
  clubId: string;

  @Column({ type: 'enum', enum: PlanVisibility, default: PlanVisibility.Private })
  visibility: PlanVisibility;

  @Column({ default: 'coach' })
  createdByRole: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[] | null;

  /** Stores type-specific plan content as JSONB */
  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
