// src/infrastructure/articleRepositorysitories/ArticleRepository.ts
import { LessThan, Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { Collection } from '../../domain/entities/Collection';
import { RSSFeed } from '../../domain/entities/RSSFeed';
import { AppDataSource } from '../database/dataSource';
import { ArticleEntity } from '../entities/ArticleEntity';
import { CollectionEntity } from '../entities/CollectionEntity';
import { RSSFeedEntity } from '../entities/RSSFeedEntity';
import logger from '../logger/logger';

export class ArticleRepository implements IRepository<Article> {
  private readonly articleRepository: Repository<ArticleEntity>;

  constructor() {
    this.articleRepository = AppDataSource.getRepository(ArticleEntity);
  }

  async create(article: Article): Promise<Article> {
    const articleEntity = this.hydrateArticleEntity(article);
    const entity = this.articleRepository.create(articleEntity);
    const result = await this.articleRepository.save(entity);

    return this.createArticle(result);
  }

  async getAll(): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      relations: ['feed'],
    });
    return this.mapArticles(entities);
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.articleRepository.findOne({
      where: { id },
      relations: ['feed'],
    });
    if (!entity) return null;

    return this.createArticle(entity);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      where: { feed: { id: feedId } },
      relations: ['feed'],
    });
    return this.mapArticles(entities);
  }

  async getOneByLink(link: string): Promise<Article | null> {
    const entity = await this.articleRepository.findOne({
      where: { link },
      relations: ['feed'],
    });
    if (!entity) return null;
    return this.createArticle(entity);
  }

  async getUnanalyzedArticlesByAgent(agentId: number): Promise<Article[]> {
    const entities = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.analyses', 'analysis')
      .leftJoin('analysis.agent', 'agent')
      .where('agent.id IS NULL OR agent.id != :agentId', { agentId })
      .getMany();

    return this.mapArticles(entities);
  }

  async update(article: Article): Promise<Article> {
    if (undefined === article.id) {
      const errorMessage = "Erreur lor de la mise à jour de l'article";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const articleEntity = this.hydrateArticleEntity(article);
    await this.articleRepository.update(articleEntity.id, articleEntity);

    return article;
  }

  async delete(id: number): Promise<void> {
    await this.articleRepository.delete({ id });
  }

  async deleteOldRSSArticles(olderThan: Date): Promise<void> {
    await this.articleRepository.delete({
      publicationDate: LessThan(olderThan),
      sourceType: ArticleSourceType.RSS,
      isSaved: false,
    });
  }

  private mapArticles(entities: ArticleEntity[]) {
    return entities.map((entity) => this.createArticle(entity));
  }

  private createArticle(entity: ArticleEntity) {
    const article = new Article(
      entity.id,
      entity.title,
      entity.publicationDate,
      entity.isRead,
      entity.isFavorite,
      entity.isArchived,
      entity.isSaved,
      undefined,
      entity.sourceType,
      entity.link,
      entity.description,
      entity.content,
    );

    if (null !== entity.feed && undefined !== entity.feed) {
      article.feed = new RSSFeed(
        entity.feed.id,
        entity.feed.title,
        entity.feed.url,
        entity.feed.description,
      );

      if (undefined !== entity.feed.collection) {
        article.feed.collection = new Collection(
          entity.feed.collection.id,
          entity.feed.collection.name,
          entity.feed.collection.description,
        );
      }
    }

    return article;
  }

  private hydrateArticleEntity(article: Article): ArticleEntity {
    const articleEntity = new ArticleEntity();

    if (undefined !== article.id) articleEntity.id = article.id;
    articleEntity.title = article.title;
    articleEntity.link = article.link;
    articleEntity.publicationDate = article.publicationDate;
    articleEntity.isRead = article.isRead;
    articleEntity.isFavorite = article.isFavorite;
    articleEntity.isArchived = article.isArchived;
    articleEntity.isSaved = article.isSaved;
    articleEntity.isArchived = article.isArchived;
    articleEntity.sourceType = article.sourceType;

    if (article.feed) {
      articleEntity.feed = new RSSFeedEntity();
      if (undefined !== article.feed.id)
        articleEntity.feed.id = article.feed.id;
      articleEntity.feed.title = article.feed.title;
      articleEntity.feed.url = article.feed.url;
      articleEntity.feed.description = article.feed.description;

      if (article.feed.collection) {
        articleEntity.feed.collection = new CollectionEntity();
        if (undefined !== article.feed.collection.id)
          articleEntity.feed.collection.id = article.feed.collection.id;
        articleEntity.feed.collection.name = article.feed.collection.name;
        articleEntity.feed.collection.description =
          article.feed.collection.description;
      }
    }

    if (undefined !== article.description)
      articleEntity.description = article.description;
    if (undefined !== article.content) articleEntity.content = article.content;

    return articleEntity;
  }
}
