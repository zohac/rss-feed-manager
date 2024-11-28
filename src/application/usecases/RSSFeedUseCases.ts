import Parser from 'rss-parser';

import { RSSFeed } from '../../domain/entities/RSSFeed';
import logger from '../../infrastructure/logger/logger';
import { RSSFeedRepository } from '../../infrastructure/repositories/RSSFeedRepository';
import { CreateRSSFeedDTO, UpdateRSSFeedDTO } from '../dtos/RSSFeedDTO';

import { IUseCase } from '../interfaces/IUseCase';

export class RSSFeedUseCases
  implements IUseCase<RSSFeed, CreateRSSFeedDTO, UpdateRSSFeedDTO>
{
  private readonly repository: RSSFeedRepository;
  private readonly parser: Parser;

  constructor(
    repository: RSSFeedRepository,
  ) {
    this.repository = repository;
    this.parser = new Parser();
  }

  async getAll(): Promise<RSSFeed[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<RSSFeed | null> {
    return await this.repository.getOneById(id);
  }

  async create(feedDto: CreateRSSFeedDTO): Promise<RSSFeed> {
    const { title, url, description } = feedDto;
    const feed = new RSSFeed(
      undefined,
      title,
      url,
      description,
    );

    const newFeed = await this.repository.create(feed);

    return newFeed;
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

    return await this.repository.update(feed);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
