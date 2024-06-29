import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  nick_name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  position: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: '' })
  owner: string;

  @Column('simple-array', { default: 'user' })
  roles: string[];

  @OneToMany(() => Company, (company) => company.auth)
  companies: Company[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(auth: Partial<Auth>) {
    Object.assign(this, auth);
  }
}
