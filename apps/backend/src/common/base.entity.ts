import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Index()
  @Column({ type: 'integer', nullable: true })
  created_by: number;

  @Column({ type: 'integer', nullable: true })
  updated_by: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updated_at: Date;
}
