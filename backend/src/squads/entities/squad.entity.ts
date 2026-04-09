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
import { Club } from '../../clubs/entities/club.entity';
import { Player } from '../../players/entities/player.entity';
import { CoachAssignment } from './coach-assignment.entity';

@Entity('squads')
export class Squad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ageGroup: string;

  @Column()
  clubId: string;

  @ManyToOne(() => Club, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @OneToMany(() => Player, (player) => player.squad)
  players: Player[];

  @OneToMany(() => CoachAssignment, (ca) => ca.squad)
  coachAssignments: CoachAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
