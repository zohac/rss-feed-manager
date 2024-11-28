import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { Collection } from '../../domain/entities/Collection';
import { RSSFeed } from '../../domain/entities/RSSFeed';
import { AppDataSource } from '../database/dataSource';
import { CollectionEntity } from '../entities/CollectionEntity';
import { RSSFeedEntity } from '../entities/RSSFeedEntity';
import logger from '../logger/logger';

export class RSSFeedRepository implements IRepository<RSSFeed> {
  private readonly feedRepository: Repository<RSSFeedEntity>;

  constructor() {
    // AppDataSource est déjà initialisé ici
    this.feedRepository = AppDataSource.getRepository(RSSFeedEntity);
  }

  async getOneById(id: number): Promise<RSSFeed | null> {
    const entity = await this.feedRepository.findOne({
      where: { id },
      relations: ['collection'],
    });
    if (!entity) return null;

    return this.createRssFeed(entity);
  }

  async getAll(): Promise<RSSFeed[]> {
    const entities = await this.feedRepository.find({
      relations: ['collection'],
    });
    return entities.map((entity) => this.createRssFeed(entity));
  }

  async create(feed: RSSFeed): Promise<RSSFeed> {
    const rssFeedEntity = this.createRssFeedEntity(feed);
    const entity = this.feedRepository.create(rssFeedEntity);
    const result = await this.feedRepository.save(entity);

    return this.createRssFeed(result);
  }

  async update(feed: RSSFeed): Promise<RSSFeed> {
    if (!feed.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour du flux RSS';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    const rssFeedEntity = this.createRssFeedEntity(feed);
    await this.feedRepository.update(rssFeedEntity.id, rssFeedEntity);

    return this.createRssFeed(rssFeedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.feedRepository.delete(id);
  }

  private createRssFeed(entity: RSSFeedEntity) {
    const rssFeed = new RSSFeed(
      entity.id,
      entity.title,
      entity.url,
      entity.description,
    );

    if (undefined !== entity.collection && null !== entity.collection) {
      rssFeed.collection = new Collection(
        entity.collection.id,
        entity.collection.name,
        entity.collection.description,
      );
    }

    return rssFeed;
  }

  private createRssFeedEntity(rssFeed: RSSFeed): RSSFeedEntity {
    const { id, title, url, description, collection } = rssFeed;
    const rssFeedEntity = new RSSFeedEntity();
    const collectionEntity = new CollectionEntity();

    if (undefined !== collection) {
      if (undefined !== collection.id) collectionEntity.id = collection.id;
      collectionEntity.name = collection.name;
      collectionEntity.description = collection.description;
    }

    if (undefined !== id) rssFeedEntity.id = id;
    rssFeedEntity.title = title;
    rssFeedEntity.url = url;
    rssFeedEntity.description = description;
    rssFeedEntity.collection = collectionEntity;

    return rssFeedEntity;
  }
}
