// src/infrastructure/entities/AiAnalysisEntity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { AIAgentEntity } from './AIAgentEntity';
import { ArticleEntity } from './ArticleEntity';

@Entity()
export class AIAnalysisEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ArticleEntity)
  article?: ArticleEntity;

  @ManyToOne(() => AIAgentEntity)
  agent?: AIAgentEntity;

  @Column()
  isRelevant!: boolean;

  @Column()
  analysisDate!: Date;
}
