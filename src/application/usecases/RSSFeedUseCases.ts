// src/application/usecases/RSSFeedUseCases.ts

import { RSSFeed } from '../../domain/entities/RSSFeed';
import logger from '../../infrastructure/logger/logger';
import { RssFeedCollectionRepository } from '../../infrastructure/repositories/RssFeedCollectionRepository';
import { RSSFeedRepository } from '../../infrastructure/repositories/RSSFeedRepository';
import { CreateRSSFeedDTO, UpdateRSSFeedDTO } from '../dtos/RSSFeedDTO';
import { IUseCase } from '../interfaces/IUseCase';

import { ParseFeedUseCase } from './ParseFeedUseCase';

export class RSSFeedUseCases
  implements IUseCase<RSSFeed, CreateRSSFeedDTO, UpdateRSSFeedDTO>
{
  private readonly repository: RSSFeedRepository;
  private readonly collectionRepository: RssFeedCollectionRepository;
  private readonly parseFeedUseCase: ParseFeedUseCase;

  constructor(
    repository: RSSFeedRepository,
    collectionRepository: RssFeedCollectionRepository,
    parseFeedUseCase: ParseFeedUseCase,
  ) {
    this.repository = repository;
    this.collectionRepository = collectionRepository;
    this.parseFeedUseCase = parseFeedUseCase;
  }

  async getAll(): Promise<RSSFeed[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RSSFeed | null> {
    return await this.repository.getOneById(id);
  }

  async create(feedDto: CreateRSSFeedDTO): Promise<RSSFeed> {
    const { title, url, description, collectionId } = feedDto;
    const feed = new RSSFeed(undefined, title, url, description);

    if (undefined !== collectionId) {
      const collection =
        await this.collectionRepository.getOneById(collectionId);

      if (null !== collection) {
        feed.collection = collection;
      }
    }

    const feedCreated = await this.repository.create(feed);

    await this.parseFeedUseCase.execute(feedCreated);

    return feedCreated;
  }

  async update(feedDto: UpdateRSSFeedDTO): Promise<RSSFeed> {
    const { id, title, url, description, collectionId } = feedDto;
    const feed = await this.repository.getOneById(id);

    if (!feed) {
      const errorMessage =
        'Une erreur est survenu lors de la mise à jour à jour du flux RSS';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (title !== undefined) {
      feed.title = title;
    }

    if (url !== undefined) {
      feed.url = url;
    }

    if (description !== undefined) {
      feed.description = description;
    }

    if (undefined === collectionId) {
      feed.collection = undefined;
    } else {
      const collection =
        await this.collectionRepository.getOneById(collectionId);

      if (null === collection) {
        const errorMessage = `La collection avec l'id : ${collectionId} n'existe pas`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      feed.collection = collection;
    }

    return await this.repository.update(feed);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
