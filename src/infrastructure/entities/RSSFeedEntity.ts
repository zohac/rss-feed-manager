// src/infrastructure/entities/RSSFeedEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { CollectionEntity } from './CollectionEntity';

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
    () => CollectionEntity,
    (collectionEntity) => collectionEntity.feeds,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  collection?: CollectionEntity;
}
