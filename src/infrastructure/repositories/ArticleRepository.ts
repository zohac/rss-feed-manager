// src/infrastructure/articleRepositorysitories/ArticleRepository.ts
import { LessThan, Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { AppDataSource } from '../database/dataSource';
import { ArticleEntity } from '../entities/ArticleEntity';
import logger from '../logger/logger';
import { ArticleMapper } from '../mappers/ArticleMapper';

export class ArticleRepository implements IRepository<Article> {
  private readonly articleRepository: Repository<ArticleEntity>;

  constructor() {
    this.articleRepository = AppDataSource.getRepository(ArticleEntity);
  }

  async create(article: Article): Promise<Article> {
    const articleEntity = ArticleMapper.toEntity(article);
    const entity = this.articleRepository.create(articleEntity);
    const result = await this.articleRepository.save(entity);

    return ArticleMapper.toDomain(result);
  }

  async getAll(): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      relations: ['feed', 'analysis', 'collection'],
    });
    return this.mapArticles(entities);
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.articleRepository.findOne({
      where: { id },
      relations: ['feed', 'analysis', 'collection'],
    });
    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
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

    return ArticleMapper.toDomain(entity);
  }

  async getUnanalyzedArticlesByAgent(agentId: number): Promise<Article[]> {
    const entities = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.analysis', 'analysis')
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

    const articleEntity = ArticleMapper.toEntity(article);
    await this.articleRepository.update(articleEntity.id, articleEntity);
    const entity = await this.getOneById(articleEntity.id);
    if (!entity) {
      const errorMessage = "Erreur lor de la mise à jour de l'article";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return entity;
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

  private mapArticles(entities: ArticleEntity[]): Article[] {
    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }
}
