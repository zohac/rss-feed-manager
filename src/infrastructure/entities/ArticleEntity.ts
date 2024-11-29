// src/infrastructure/entities/ArticleEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { ArticleSourceType } from '../../domain/entities/Article';

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

  @Column()
  sourceType!: ArticleSourceType;
}
