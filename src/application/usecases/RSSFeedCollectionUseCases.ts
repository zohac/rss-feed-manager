// src/application/usecases/RSSFeedCollectionUseCases.ts

import { RSSFeedCollection } from '../../domain/entities/RSSFeedCollection';
import logger from '../../infrastructure/logger/logger';
import { RssFeedCollectionRepository } from '../../infrastructure/repositories/RssFeedCollectionRepository';
import {
  CreateRssFeedCollectionDTO,
  UpdateRssFeedCollectionDTO,
} from '../dtos/RSSFeedCollectionDTO';
import { IUseCase } from '../interfaces/IUseCase';

export class RSSFeedCollectionUseCases
  implements
    IUseCase<
      RSSFeedCollection,
      CreateRssFeedCollectionDTO,
      UpdateRssFeedCollectionDTO
    >
{
  private readonly repository: RssFeedCollectionRepository;

  constructor(repository: RssFeedCollectionRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<RSSFeedCollection[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RSSFeedCollection | null> {
    return await this.repository.getOneById(id);
  }

  async create(
    collectionDto: CreateRssFeedCollectionDTO,
  ): Promise<RSSFeedCollection> {
    const collection = new RSSFeedCollection(
      undefined,
      collectionDto.name,
      collectionDto.description,
    );

    return await this.repository.create(collection);
  }

  async update(
    collectionDto: UpdateRssFeedCollectionDTO,
  ): Promise<RSSFeedCollection> {
    const { id, name, description } = collectionDto;
    const collection = await this.repository.getOneById(id);

    if (!collection) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour de la collection.';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (undefined !== name) {
      collection.name = name;
    }

    if (undefined !== description && null !== description) {
      collection.description = description;
    }

    return this.repository.update(collection);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
