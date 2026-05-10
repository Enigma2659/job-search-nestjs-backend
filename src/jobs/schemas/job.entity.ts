import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Company } from '../../companies/schemas/company.entity';
import { Application } from '../../applications/schemas/application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({type:'clob',nullable:true,
    transformer:{
      to:(value:string[])=> value? value.join(','):null,
      from:(value:string)=>value ?value.split(','):[]
    }
  })
  requirements: string[];

  @Column({type:'clob',nullable:true})
  description: string;

  @Column('date')
  dueDate: Date;

  @ManyToOne(() => Company, company => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}