// src/infrastructure/entities/RSSFeedEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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
}
