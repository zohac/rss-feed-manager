// src/infrastructure/mappers/AIAnalysisMapper.ts

import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { AIAnalysisEntity } from '../entities/AIAnalysisEntity';

import { AIAgentMapper } from './AIAgentMapper';
import { ArticleMapper } from './ArticleMapper';

export class AIAnalysisMapper {
  static toDomain(entity: AIAnalysisEntity): AIAnalysis {
    const domain = new AIAnalysis(
      entity.id,
      entity.isRelevant,
      entity.isActionExecuted,
      entity.analysisDate,
      undefined,
      undefined,
    );

    if (undefined !== entity.agent)
      domain.agent = AIAgentMapper.toDomain(entity.agent);

    if (undefined !== entity.article)
      domain.article = ArticleMapper.toPartialDomain(entity.article);

    return domain;
  }

  static toEntity(domain: AIAnalysis): AIAnalysisEntity {
    const entity = new AIAnalysisEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.isRelevant = domain.isRelevant;
    entity.isActionExecuted = domain.isActionExecuted;
    entity.analysisDate = domain.analysisDate;

    if (undefined !== domain.agent)
      entity.agent = AIAgentMapper.toEntity(domain.agent);

    if (undefined !== domain.article)
      entity.article = ArticleMapper.toEntity(domain.article);

    return entity;
  }
}
