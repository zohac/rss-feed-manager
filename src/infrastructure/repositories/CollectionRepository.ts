// src/infrastructure/collectionRepositorysitories/CollectionRepository.ts
import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { Collection } from '../../domain/entities/Collection';
import { RSSFeed } from '../../domain/entities/RSSFeed';
import { AppDataSource } from '../database/dataSource';
import { CollectionEntity } from '../entities/CollectionEntity';
import logger from '../logger/logger';

export class CollectionRepository implements IRepository<Collection> {
  private readonly collectionRepository: Repository<CollectionEntity>;

  constructor() {
    this.collectionRepository = AppDataSource.getRepository(CollectionEntity);
  }

  async getAll(): Promise<Collection[]> {
    const entities = await this.collectionRepository.find({
      relations: ['feeds'],
    });
    return entities.map((entity) => this.createCollection(entity));
  }

  async getOneById(id: number): Promise<Collection | null> {
    const entity = await this.collectionRepository.findOne({
      where: { id },
      relations: ['feeds'],
    });
    if (!entity) return null;

    return this.createCollection(entity);
  }

  async create(collection: Collection): Promise<Collection> {
    const collectionEntity = this.createCollectionEntity(collection);
    const entity = this.collectionRepository.create(collectionEntity);
    const result = await this.collectionRepository.save(entity);

    return this.createCollection(result);
  }

  async update(collection: Collection): Promise<Collection> {
    if (!collection.id) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour de la collection';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const collectionEntity = this.createCollectionEntity(collection);
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

  private createCollection(collectionEntity: CollectionEntity): Collection {
    const collection = new Collection(
      collectionEntity.id,
      collectionEntity.name,
      collectionEntity.description,
    );

    if (undefined !== collectionEntity.feeds) {
      collection.feeds = collectionEntity.feeds.map(
        (entity) =>
          new RSSFeed(
            entity.id,
            entity.title,
            entity.title,
            entity.description,
          ),
      );
    }

    return collection;
  }

  private createCollectionEntity(collection: Collection): CollectionEntity {
    const collectionEntity = new CollectionEntity();

    if (undefined !== collection.id) collectionEntity.id = collection.id;
    collectionEntity.name = collection.name;
    collectionEntity.description = collection.description;

    return collectionEntity;
  }
}
