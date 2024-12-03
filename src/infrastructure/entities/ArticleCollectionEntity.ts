// src/infrastructure/entities/CollectionEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { ArticleEntity } from './ArticleEntity';

@Entity()
export class ArticleCollectionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => ArticleEntity,
    (ArticleEntity) => ArticleEntity.collection,
    {},
  )
  articles?: ArticleEntity[];
}
