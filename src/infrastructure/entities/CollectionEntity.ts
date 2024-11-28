// src/infrastructure/entities/CollectionEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { RSSFeedEntity } from './RSSFeedEntity';

@Entity()
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => RSSFeedEntity,
    (rSSFeedEntity) => rSSFeedEntity.collection,
    {},
  )
  feeds?: RSSFeedEntity[];
}
