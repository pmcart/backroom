import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface ClubCoachPermissions {
  canCreateSingleSession:  boolean;
  canCreateWeeklyPlan:     boolean;
  canCreateMultiWeekBlock: boolean;
  canCreateSeasonPlan:     boolean;
  canEditAdminPlans:       boolean;
  canDeleteOwnPlans:       boolean;
}

export interface ClubSettings {
  coachPermissions: ClubCoachPermissions;
}

export const DEFAULT_CLUB_SETTINGS: ClubSettings = {
  coachPermissions: {
    canCreateSingleSession:  true,
    canCreateWeeklyPlan:     true,
    canCreateMultiWeekBlock: true,
    canCreateSeasonPlan:     true,
    canEditAdminPlans:       false,
    canDeleteOwnPlans:       true,
  },
};

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings: ClubSettings | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
