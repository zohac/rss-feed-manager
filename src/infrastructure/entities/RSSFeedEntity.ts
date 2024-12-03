// src/infrastructure/entities/RSSFeedEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { RSSFeedCollectionEntity } from './RSSFeedCollectionEntity';

@Entity()
export class RSSFeedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    () => RSSFeedCollectionEntity,
    (collectionEntity) => collectionEntity.feeds,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  collection?: RSSFeedCollectionEntity;
}
