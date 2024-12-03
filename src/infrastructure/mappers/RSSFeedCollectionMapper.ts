// src/infrastructure/mappers/RSSFeedCollectionMapper.ts

import { RSSFeedCollection } from '../../domain/entities/RSSFeedCollection';
import { RSSFeedCollectionEntity } from '../entities/RSSFeedCollectionEntity';

import { RSSFeedMapper } from './RSSFeedMapper';

export class RSSFeedCollectionMapper {
  static toDomain(entity: RSSFeedCollectionEntity): RSSFeedCollection {
    const feeds = entity.feeds?.map((feed) =>
      RSSFeedMapper.toPartialDomain(feed),
    );

    return new RSSFeedCollection(
      entity.id,
      entity.name,
      entity.description,
      feeds,
    );
  }

  static toPartialDomain(entity: RSSFeedCollectionEntity): RSSFeedCollection {
    return new RSSFeedCollection(entity.id, entity.name);
  }

  static toEntity(domain: RSSFeedCollection): RSSFeedCollectionEntity {
    const entity = new RSSFeedCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;

    entity.feeds = domain.feeds?.map((feed) =>
      RSSFeedMapper.toPartialEntity(feed),
    );

    return entity;
  }

  static toPartialEntity(domain: RSSFeedCollection): RSSFeedCollectionEntity {
    const entity = new RSSFeedCollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;

    return entity;
  }
}
