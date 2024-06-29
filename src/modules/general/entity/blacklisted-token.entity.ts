import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlackListedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  token: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  constructor(blackList: Partial<BlackListedToken>) {
      Object.assign(this, blackList);
  }
}
