import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Squad } from './squad.entity';

@Entity('coach_assignments')
export class CoachAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  squadId: string;

  @ManyToOne(() => Squad, (squad) => squad.coachAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'squadId' })
  squad: Squad;

  @Column()
  clubId: string;

  @CreateDateColumn()
  createdAt: Date;
}
