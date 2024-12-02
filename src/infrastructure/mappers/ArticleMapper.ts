// src/infrastructure/mappers/ArticleMapper.ts

import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { Article } from '../../domain/entities/Article';
import { ArticleEntity } from '../entities/ArticleEntity';

import { AIAnalysisMapper } from './AIAnalysisMapper';
import { RSSFeedMapper } from './RSSFeedMapper';

export class ArticleMapper {
  static toDomain(entity: ArticleEntity): Article {
    const domain = new Article(
      entity.id,
      entity.title,
      entity.publicationDate,
      entity.isRead,
      entity.isFavorite,
      entity.isArchived,
      entity.isSaved,
      undefined,
      entity.sourceType,
      undefined,
      entity.link,
      entity.description,
      entity.content,
    );

    if (null !== entity.feed && undefined !== entity.feed) {
      domain.feed = RSSFeedMapper.toPartialDomain(entity.feed);
    }

    const analysis: AIAnalysis[] = [];
    if (null !== entity.analysis && undefined !== entity.analysis) {
      for (const analysisEntity of entity.analysis) {
        analysis.push(AIAnalysisMapper.toDomain(analysisEntity));
      }
    }
    domain.analysis = analysis;

    return domain;
  }

  static toPartialDomain(entity: ArticleEntity): Article {
    const domain = new Article(
      entity.id,
      entity.title,
      entity.publicationDate,
      entity.isRead,
      entity.isFavorite,
      entity.isArchived,
      entity.isSaved,
      undefined,
      entity.sourceType,
    );

    if (null !== entity.feed && undefined !== entity.feed) {
      domain.feed = RSSFeedMapper.toPartialDomain(entity.feed);
    }

    return domain;
  }

  static toEntity(domain: Article): ArticleEntity {
    const entity = new ArticleEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.link = domain.link;
    entity.publicationDate = domain.publicationDate;
    entity.isRead = domain.isRead;
    entity.isFavorite = domain.isFavorite;
    entity.isArchived = domain.isArchived;
    entity.isSaved = domain.isSaved;
    entity.isArchived = domain.isArchived;
    entity.sourceType = domain.sourceType;

    if (domain.feed) entity.feed = RSSFeedMapper.toPartialEntity(domain.feed);

    if (undefined !== domain.description)
      entity.description = domain.description;
    if (undefined !== domain.content) entity.content = domain.content;

    return entity;
  }

  static toPartialEntity(domain: Article): ArticleEntity {
    const entity = new ArticleEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.publicationDate = domain.publicationDate;
    entity.isRead = domain.isRead;
    entity.isFavorite = domain.isFavorite;
    entity.isArchived = domain.isArchived;
    entity.isSaved = domain.isSaved;
    entity.isArchived = domain.isArchived;
    entity.sourceType = domain.sourceType;

    if (domain.feed) entity.feed = RSSFeedMapper.toPartialEntity(domain.feed);

    if (undefined !== domain.description)
      entity.description = domain.description;

    return entity;
  }
}
