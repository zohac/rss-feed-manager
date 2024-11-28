import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { RSSFeed } from '../../domain/entities/RSSFeed';
import { AppDataSource } from '../database/dataSource';
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
    });
    if (!entity) return null;
    return this.createRssFeed(entity);
  }

  async getAll(): Promise<RSSFeed[]> {
    const entities = await this.feedRepository.find({});
    return entities.map((entity) => this.createRssFeed(entity));
  }

  async create(feed: RSSFeed): Promise<RSSFeed> {
    const rssFeedEntity = this.hydrateRssFeedEntity(feed);
    const entity = this.feedRepository.create(rssFeedEntity);
    const result = await this.feedRepository.save(entity);

    return this.createRssFeed(entity);
  }

  async update(feed: RSSFeed): Promise<RSSFeed> {
    if (!feed.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour du flux RSS';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    await this.feedRepository.update(feed.id, feed);

    return feed;
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

    return rssFeed;
  }

  private hydrateRssFeedEntity(rssFeed: RSSFeed): RSSFeedEntity {
    const { id, title, url, description } = rssFeed;
    const rssFeedEntity = new RSSFeedEntity();

    if (undefined !== id) rssFeedEntity.id = id;
    rssFeedEntity.title = title;
    rssFeedEntity.url = url;
    rssFeedEntity.description = description;

    return rssFeedEntity;
  }
}
