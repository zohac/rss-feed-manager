// src/usecases/ParseFeedUseCase.ts

import Parser from 'rss-parser';

import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { RSSFeed } from '../../domain/entities/RSSFeed';
import logger from '../../infrastructure/logger/logger';
import { ArticleRepository } from '../../infrastructure/repositories/ArticleRepository';

export class ParseFeedUseCase {
  private readonly articleRepository: ArticleRepository;
  private readonly parser: Parser;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
    this.parser = new Parser();
  }

  async execute(feed: RSSFeed): Promise<void> {
    try {
      const parsedFeed = await this.parser.parseURL(feed.url);
      for (const item of parsedFeed.items) {
        let articleExist: boolean = false;
        if (item.link)
          articleExist = !!(await this.articleRepository.getOneByLink(
            item.link,
          ));

        if (!articleExist) {
          const article = new Article(
            undefined, // id
            item.title ?? 'Sans titre',
            item.pubDate ? new Date(item.pubDate) : new Date(),
            false, // isRead
            false, // isFavorite
            false, // isArchived
            false, // isSaved
            feed, // feed
            ArticleSourceType.RSS,
            undefined, // Analysis
            item.link ?? '',
            item.contentSnippet ?? '',
          );
          await this.articleRepository.create(article);
        }
      }
      logger.info(`Flux traité avec succès : ${feed.title}`);
    } catch (error) {
      logger.error(
        `Erreur lors du parsing du flux RSS "${feed.title}":`,
        error,
      );
    }
  }
}
