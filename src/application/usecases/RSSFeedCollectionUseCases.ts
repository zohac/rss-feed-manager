// src/application/usecases/RSSFeedCollectionUseCases.ts

import { RSSFeedCollection } from '../../domain/entities/RSSFeedCollection';
import { IRepository } from '../../domain/interfaces/IRepository';
import { IUseCase } from '../../domain/interfaces/IUseCase';
import {
  CreateRssFeedCollectionDTO,
  UpdateRssFeedCollectionDTO,
} from '../dtos/RSSFeedCollectionDTO';
import { NotFoundException } from '../exception/NotFoundException';

export class RSSFeedCollectionUseCases
  implements
    IUseCase<
      RSSFeedCollection,
      CreateRssFeedCollectionDTO,
      UpdateRssFeedCollectionDTO
    >
{
  constructor(private readonly repository: IRepository<RSSFeedCollection>) {}

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
      throw new NotFoundException(
        'Une erreur est survenu lors de la mise à jour à jour de la collection.',
      );
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
