import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('journal')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  author_uuid: string;

  @Column()
  author_first_name: string;

  @Column()
  author_last_name: string;

  @Column()
  author_email: string;

  @Column()
  journal_title: string;

  @Column()
  journal_content: string;

  @Column('varchar', { array: true, default: [] })
  journal_tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true })
  image_url?: string | null;
}
