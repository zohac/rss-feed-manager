// src/infrastructure/entities/ArticleEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { ArticleSourceType } from '../../domain/entities/Article';

import { AIAnalysisEntity } from './AIAnalysisEntity';
import { RSSFeedEntity } from './RSSFeedEntity';

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true, type: 'text' })
  link?: string;

  @Column('text')
  description!: string;

  @Column({ nullable: true, type: 'text' })
  content?: string;

  @Column()
  publicationDate!: Date;

  @Column({ nullable: true, type: 'text' })
  tag?: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ default: false })
  isFavorite!: boolean;

  @Column({ default: false })
  isArchived!: boolean;

  @Column({ default: false })
  isSaved!: boolean;

  @ManyToOne(() => RSSFeedEntity, {
    onDelete: 'CASCADE',
  })
  feed!: RSSFeedEntity;

  @OneToMany(
    () => AIAnalysisEntity,
    (aiAnalysisEntity) => aiAnalysisEntity.article,
    {
      onDelete: 'CASCADE',
    },
  )
  analysis?: AIAnalysisEntity[];

  @Column()
  sourceType!: ArticleSourceType;
}
