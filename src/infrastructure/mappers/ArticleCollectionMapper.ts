// src/infrastructure/mappers/ArticleCollectionMapper.ts

import { ArticleCollection } from '../../domain/entities/ArticleCollection';
import { ArticleCollectionEntity } from '../entities/ArticleCollectionEntity';

import { ArticleMapper } from './ArticleMapper';

export class ArticleCollectionMapper {
  static toDomain(entity: ArticleCollectionEntity): ArticleCollection {
    const articles = entity.articles?.map((feed) =>
      ArticleMapper.toPartialDomain(feed),
    );

    return new ArticleCollection(
      entity.id,
      entity.name,
      entity.description,
      articles,
    );
  }

  static toPartialDomain(entity: ArticleCollectionEntity): ArticleCollection {
    return new ArticleCollection(entity.id, entity.name);
  }

  static toEntity(domain: ArticleCollection): ArticleCollectionEntity {
    const entity = new ArticleCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;

    entity.articles = domain.articles?.map((article) =>
      ArticleMapper.toPartialEntity(article),
    );

    return entity;
  }

  static toPartialEntity(domain: ArticleCollection): ArticleCollectionEntity {
    const entity = new ArticleCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;

    return entity;
  }
}
