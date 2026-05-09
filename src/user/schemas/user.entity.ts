import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
