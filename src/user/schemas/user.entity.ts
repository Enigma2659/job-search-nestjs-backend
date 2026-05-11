import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/schemas/application.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  Firstname: string;

  @Column({ length: 255 })
  surname: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column('date')
  DoB: Date;

  @Column({ length: 255 })
  password: string;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}