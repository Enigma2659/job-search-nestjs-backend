import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/schemas/user.entity';
import { Job } from '../../jobs/schemas/job.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  coverLetter?: string;

  @CreateDateColumn({ type: 'timestamp' })
  appliedAt: Date;

  @ManyToOne(() => User, (user) => user.applications, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Job, (job) => job.applications, { eager: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;
}