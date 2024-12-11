// src/infrastructure/entities/AiAnalysisEntity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { AIAgentEntity } from './AIAgentEntity';
import { ArticleEntity } from './ArticleEntity';

@Entity()
export class AIAnalysisEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ArticleEntity, {
    cascade: true,
    eager: true,
  })
  article?: ArticleEntity;

  @ManyToOne(() => AIAgentEntity, {
    cascade: true,
    eager: true,
  })
  agent?: AIAgentEntity;

  @Column({ type: 'boolean', default: false })
  isRelevant!: boolean;

  @Column({ type: 'boolean', default: false })
  isActionExecuted!: boolean;

  @Column()
  analysisDate!: Date;
}
