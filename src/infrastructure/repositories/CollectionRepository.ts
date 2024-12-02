// src/infrastructure/collectionRepositorysitories/CollectionRepository.ts
import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { Collection } from '../../domain/entities/Collection';
import { AppDataSource } from '../database/dataSource';
import { CollectionEntity } from '../entities/CollectionEntity';
import logger from '../logger/logger';
import { CollectionMapper } from '../mappers/CollectionMapper';

export class CollectionRepository implements IRepository<Collection> {
  private readonly collectionRepository: Repository<CollectionEntity>;

  constructor() {
    this.collectionRepository = AppDataSource.getRepository(CollectionEntity);
  }

  async getAll(): Promise<Collection[]> {
    const entities = await this.collectionRepository.find({
      relations: ['feeds'],
    });
    return entities.map((entity) => CollectionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Collection | null> {
    const entity = await this.collectionRepository.findOne({
      where: { id },
      relations: ['feeds'],
    });
    if (!entity) return null;

    return CollectionMapper.toDomain(entity);
  }

  async create(collection: Collection): Promise<Collection> {
    const collectionEntity = CollectionMapper.toEntity(collection);
    const entity = this.collectionRepository.create(collectionEntity);
    const result = await this.collectionRepository.save(entity);

    return CollectionMapper.toDomain(result);
  }

  async update(collection: Collection): Promise<Collection> {
    if (!collection.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour de la collection';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const collectionEntity = CollectionMapper.toEntity(collection);
    await this.collectionRepository.update(
      collectionEntity.id,
      collectionEntity,
    );

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
