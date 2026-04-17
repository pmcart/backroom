import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('methodology_configs')
export class MethodologyConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clubId: string;

  @Column({ type: 'text', nullable: true })
  philosophy: string;

  @Column({ type: 'jsonb', nullable: true })
  corePrinciples: { title: string; desc: string }[];

  @Column({ type: 'jsonb', nullable: true })
  nonNegotiables: string[];

  @Column({ type: 'text', nullable: true })
  playerDevelopmentPhilosophy: string;

  @Column({ type: 'jsonb', nullable: true })
  playerPositions: {
    id: string;
    position: string;
    ageGroups: string;
    roles: string;
    responsibilities: string;
    playerType: string;
    keyAttributes: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  customSections: Record<string, { id: string; title: string; content: string }[]>;

  @UpdateDateColumn()
  updatedAt: Date;
}
