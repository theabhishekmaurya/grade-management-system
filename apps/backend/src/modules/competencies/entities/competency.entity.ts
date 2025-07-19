import { BaseEntity } from 'src/common/base.entity';
import { Subject } from 'src/modules/subjects/entities/subject.entity';
import { Entity, Column, ManyToOne, Check, Unique, JoinColumn } from 'typeorm';

@Entity()
@Unique(['name', 'subject']) // Ensure name is unique within each subject
@Check(`"marks" >= 0 AND "marks" <= 10`) // Ensure marks are between 0 and 10
export class Competency extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'int' })
  marks: number;

  @ManyToOne(() => Subject, (subject) => subject.competencies, {
    
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ type: 'int' })
  subject_id: number;
}
