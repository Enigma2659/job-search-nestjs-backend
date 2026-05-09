import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Job } from '../../jobs/schemas/job.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

@Column({ type: 'varchar', length: 255, nullable: true })
location: string;

  @Column({type:'clob',nullable:true})
  jobDescription: string;

  @Column({ length: 255,select:false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];
}