// src/infrastructure/Repositories/RSSFeedCollectionRepository.ts
import { Repository } from 'typeorm';

import { RSSFeedCollection } from '../../domain/entities/RSSFeedCollection';
import { IRepository } from '../../domain/interfaces/IRepository';
import { RSSFeedCollectionEntity } from '../entities/RSSFeedCollectionEntity';
import logger from '../logger/logger';
import { RSSFeedCollectionMapper } from '../mappers/RSSFeedCollectionMapper';

export class RssFeedCollectionRepository
  implements IRepository<RSSFeedCollection>
{
  constructor(private readonly collectionRepository: Repository<RSSFeedCollectionEntity>) {}

  async getAll(): Promise<RSSFeedCollection[]> {
    const entities = await this.collectionRepository.find({
      relations: ['feeds'],
    });
    return entities.map((entity) => RSSFeedCollectionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<RSSFeedCollection | null> {
    const entity = await this.collectionRepository.findOne({
      where: { id },
      relations: ['feeds'],
    });
    if (!entity) return null;

    return RSSFeedCollectionMapper.toDomain(entity);
  }

  async create(collection: RSSFeedCollection): Promise<RSSFeedCollection> {
    const collectionEntity = RSSFeedCollectionMapper.toEntity(collection);
    const entity = this.collectionRepository.create(collectionEntity);
    const result = await this.collectionRepository.save(entity);

    return RSSFeedCollectionMapper.toDomain(result);
  }

  async update(collection: RSSFeedCollection): Promise<RSSFeedCollection> {
    if (!collection.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour de la collection';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const collectionEntity = RSSFeedCollectionMapper.toEntity(collection);
    await this.collectionRepository.save(collectionEntity);

    const entity = await this.getOneById(collectionEntity.id);
    if (!entity) {
      const errorMessage =
        'Une erreur est survenu lors de la récupération de la collection';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    await this.collectionRepository.delete(id);
  }
}
