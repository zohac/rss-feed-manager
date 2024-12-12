import { Repository } from 'typeorm';

import { RSSFeed } from '../../domain/entities/RSSFeed';
import { IRepository } from '../../domain/interfaces/IRepository';
import { RSSFeedEntity } from '../entities/RSSFeedEntity';
import logger from '../logger/logger';
import { RSSFeedMapper } from '../mappers/RSSFeedMapper';

export class RSSFeedRepository implements IRepository<RSSFeed> {
    constructor(private readonly feedRepository: Repository<RSSFeedEntity>) {}

  async getOneById(id: number): Promise<RSSFeed | null> {
    const entity = await this.feedRepository.findOne({
      where: { id },
      relations: ['collection'],
    });
    if (!entity) return null;

    return RSSFeedMapper.toDomain(entity);
  }

  async getAll(): Promise<RSSFeed[]> {
    const entities = await this.feedRepository.find({
      relations: ['collection'],
    });
    return entities.map((entity) => RSSFeedMapper.toDomain(entity));
  }

  async create(feed: RSSFeed): Promise<RSSFeed> {
    const rssFeedEntity = RSSFeedMapper.toPartialEntity(feed);
    const entity = this.feedRepository.create(rssFeedEntity);
    const result = await this.feedRepository.save(entity);

    return RSSFeedMapper.toDomain(result);
  }

  async update(feed: RSSFeed): Promise<RSSFeed> {
    if (!feed.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour du flux RSS';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    const rssFeedEntity = RSSFeedMapper.toPartialEntity(feed);
    await this.feedRepository.update(rssFeedEntity.id, rssFeedEntity);

    return RSSFeedMapper.toDomain(rssFeedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.feedRepository.delete(id);
  }
}
