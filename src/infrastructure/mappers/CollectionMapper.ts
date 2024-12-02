// src/infrastructure/mappers/RSSFeedMapper.ts

import { Collection } from '../../domain/entities/Collection';
import { CollectionEntity } from '../entities/CollectionEntity';

import { RSSFeedMapper } from './RSSFeedMapper';

export class CollectionMapper {
  static toDomain(entity: CollectionEntity): Collection {
    const feeds = entity.feeds?.map((feed) =>
      RSSFeedMapper.toPartialDomain(feed),
    );

    return new Collection(entity.id, entity.name, entity.description, feeds);
  }

  static toPartialDomain(entity: CollectionEntity): Collection {
    return new Collection(entity.id, entity.name);
  }

  static toEntity(domain: Collection): CollectionEntity {
    const entity = new CollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;

    entity.feeds = domain.feeds?.map((feed) =>
      RSSFeedMapper.toPartialEntity(feed),
    );

    return entity;
  }

  static toPartialEntity(domain: Collection): CollectionEntity {
    const entity = new CollectionEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;

    return entity;
  }
}
