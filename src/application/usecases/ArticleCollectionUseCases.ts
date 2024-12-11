// src/application/usecases/ArticleCollectionUseCases.ts
import { ArticleCollection } from '../../domain/entities/ArticleCollection';
import { IRepository } from '../../domain/interfaces/IRepository';
import { IUseCase } from '../../domain/interfaces/IUseCase';
import logger from '../../infrastructure/logger/logger';
import { ArticleCollectionRepository } from '../../infrastructure/repositories/ArticleCollectionRepository';
import {
  CreateArticleCollectionDTO,
  UpdateArticleCollectionDTO,
} from '../dtos/ArticleCollectionDTO';
import { NotFoundException } from '../exception/NotFoundException';

export class ArticleCollectionUseCases
  implements
    IUseCase<
      ArticleCollection,
      CreateArticleCollectionDTO,
      UpdateArticleCollectionDTO
    >
{
  private readonly repository: IRepository<ArticleCollection>;

  constructor(repository: ArticleCollectionRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<ArticleCollection[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<ArticleCollection | null> {
    return await this.repository.getOneById(id);
  }

  async create(
    collectionDto: CreateArticleCollectionDTO,
  ): Promise<ArticleCollection> {
    const collection = new ArticleCollection(
      undefined,
      collectionDto.name,
      collectionDto.description,
    );

    return await this.repository.create(collection);
  }

  async update(
    collectionDto: UpdateArticleCollectionDTO,
  ): Promise<ArticleCollection> {
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

    if (undefined !== description) {
      collection.description = description;
    }

    return this.repository.update(collection);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
