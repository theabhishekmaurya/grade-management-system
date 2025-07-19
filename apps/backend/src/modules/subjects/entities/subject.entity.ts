import { BaseEntity } from 'src/common/base.entity';
import { Competency } from 'src/modules/competencies/entities/competency.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Subject extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Competency, (competency) => competency.subject, {
    cascade: true,
  })
  competencies: Competency[];
}
