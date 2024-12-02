// src/infrastructure/mappers/RSSFeedMapper.ts

import { RSSFeed } from '../../domain/entities/RSSFeed';
import { RSSFeedEntity } from '../entities/RSSFeedEntity';

import { CollectionMapper } from './CollectionMapper';

export class RSSFeedMapper {
  static toDomain(entity: RSSFeedEntity): RSSFeed {
    const domain = new RSSFeed(
      entity.id,
      entity.title,
      entity.url,
      entity.description,
    );

    if (undefined !== entity.collection && null !== entity.collection) {
      domain.collection = CollectionMapper.toPartialDomain(entity.collection);
    }

    return domain;
  }

  static toPartialDomain(entity: RSSFeedEntity): RSSFeed {
    return new RSSFeed(entity.id, entity.title, entity.url);
  }

  static toEntity(domain: RSSFeed): RSSFeedEntity {
    const entity = new RSSFeedEntity();
    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.url = domain.url;
    entity.description = domain.description;

    return entity;
  }

  static toPartialEntity(domain: RSSFeed): RSSFeedEntity {
    const entity = new RSSFeedEntity();
    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.url = domain.url;
    entity.description = domain.description;

    return entity;
  }
}
