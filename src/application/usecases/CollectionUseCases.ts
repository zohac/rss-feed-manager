// src/usecases/CollectionUseCases.ts
import { Collection } from '../../domain/entities/Collection';
import logger from '../../infrastructure/logger/logger';
import { CollectionRepository } from '../../infrastructure/repositories/CollectionRepository';
import {
  CreateCollectionDTO,
  UpdateCollectionDTO,
} from '../dtos/CollectionDTO';
import { IUseCase } from '../interfaces/IUseCase';

export class CollectionUseCases
  implements IUseCase<Collection, CreateCollectionDTO, UpdateCollectionDTO>
{
  private readonly repository: CollectionRepository;

  constructor(repository: CollectionRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Collection[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<Collection | null> {
    return await this.repository.getOneById(id);
  }

  async create(collectionDto: CreateCollectionDTO): Promise<Collection> {
    const collection = new Collection(
      undefined,
      collectionDto.name,
      collectionDto.description,
    );

    return await this.repository.create(collection);
  }

  async update(collectionDto: UpdateCollectionDTO): Promise<Collection> {
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

    if (!description) {
      collection.description = description;
    }

    return this.repository.update(collection);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
