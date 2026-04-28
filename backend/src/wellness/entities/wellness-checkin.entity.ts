import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wellness_checkins')
export class WellnessCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true, type: 'varchar' })
  playerId: string | null;

  @Column()
  clubId: string;

  @Column({ nullable: true, type: 'varchar' })
  squadId: string | null;

  @Column({ type: 'date' })
  date: string;

  // Wellness metrics (1–5)
  @Column({ type: 'int' })
  sleepQuality: number;

  @Column({ type: 'int' })
  nutrition: number;

  @Column({ type: 'int' })
  hydration: number;

  @Column({ type: 'int' })
  recovery: number;

  @Column({ type: 'int' })
  mood: number;

  // Nutrition detail
  @Column({ type: 'varchar' })
  breakfast: string;

  @Column({ type: 'varchar' })
  lunch: string;

  @Column({ type: 'varchar' })
  dinner: string;

  @Column({ type: 'varchar' })
  snacks: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  waterIntake: number;

  // Sleep detail
  @Column({ type: 'decimal', precision: 4, scale: 1 })
  hoursSlept: number;

  @Column({ nullable: true, type: 'varchar' })
  bedtime: string | null;

  @Column({ nullable: true, type: 'varchar' })
  wakeTime: string | null;

  @Column({ nullable: true, type: 'text' })
  notesToCoach: string | null;

  // Computed
  @Column({ type: 'varchar' })
  overallLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
