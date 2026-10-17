import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ default: 'To Do' })
  status: string;

  @Column({ default: false })
  priority: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
