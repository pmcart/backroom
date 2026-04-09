import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Squad } from '../../squads/entities/squad.entity';

export enum PlayerStatus {
  Active = 'active',
  Injured = 'injured',
  Recovery = 'recovery',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth: string | null;

  @Column({ nullable: true, type: 'varchar' })
  position: string | null;

  @Column({ type: 'enum', enum: PlayerStatus, default: PlayerStatus.Active })
  status: PlayerStatus;

  @Column()
  squadId: string;

  @ManyToOne(() => Squad, (squad) => squad.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'squadId' })
  squad: Squad;

  @Column()
  clubId: string;

  @Column({ nullable: true, type: 'varchar' })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
