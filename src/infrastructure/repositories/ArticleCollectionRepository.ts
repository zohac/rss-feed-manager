// src/infrastructure/Repositories/ArticleCollectionRepository.ts
import { Repository } from 'typeorm';

import { ArticleCollection } from '../../domain/entities/ArticleCollection';
import { IRepository } from '../../domain/interfaces/IRepository';
import { AppDataSource } from '../database/dataSource';
import { ArticleCollectionEntity } from '../entities/ArticleCollectionEntity';
import logger from '../logger/logger';
import { ArticleCollectionMapper } from '../mappers/ArticleCollectionMapper';

export class ArticleCollectionRepository
  implements IRepository<ArticleCollection>
{
  private readonly collectionRepository: Repository<ArticleCollectionEntity>;

  constructor() {
    this.collectionRepository = AppDataSource.getRepository(
      ArticleCollectionEntity,
    );
  }

  async getAll(): Promise<ArticleCollection[]> {
    const entities = await this.collectionRepository.find({
      relations: ['articles'],
    });
    return entities.map((entity) => ArticleCollectionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<ArticleCollection | null> {
    const entity = await this.collectionRepository.findOne({
      where: { id },
      relations: ['articles'],
    });
    if (!entity) return null;

    return ArticleCollectionMapper.toDomain(entity);
  }

  async create(collection: ArticleCollection): Promise<ArticleCollection> {
    const collectionEntity = ArticleCollectionMapper.toEntity(collection);
    const entity = this.collectionRepository.create(collectionEntity);
    const result = await this.collectionRepository.save(entity);

    return ArticleCollectionMapper.toDomain(result);
  }

  async update(collection: ArticleCollection): Promise<ArticleCollection> {
    if (!collection.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour de la collection';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const collectionEntity = ArticleCollectionMapper.toEntity(collection);
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
