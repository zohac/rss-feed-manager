// src/infrastructure/articleRepositorysitories/ArticleRepository.ts
import { LessThan, Repository } from 'typeorm';

import { NotFoundException } from '../../application/exception/NotFoundException';
import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { IArticleRepository } from '../../domain/interfaces/IArticleRepository';
import { ArticleEntity } from '../entities/ArticleEntity';
import { ArticleMapper } from '../mappers/ArticleMapper';

export class ArticleRepository implements IArticleRepository {
  constructor(private readonly articleRepository: Repository<ArticleEntity>) {}

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

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Article | null> {
    const entity = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.feed', 'feed')
      .leftJoinAndSelect('article.analysis', 'analysis')
      .leftJoinAndSelect('article.collection', 'collection')
      .leftJoinAndSelect('analysis.agent', 'agent')
      .leftJoinAndSelect('agent.configuration', 'configuration')
      .leftJoinAndSelect('agent.actions', 'actions')
      .where('article.id = :id', { id })
      .getOne();

    if (!entity) return null;

    return ArticleMapper.toDomain(entity);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      where: { feed: { id: feedId } },
      relations: ['feed'],
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
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

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async update(article: Article): Promise<Article> {
    if (undefined === article.id) {
      throw new NotFoundException("Erreur lor de la mise à jour de l'article");
    }

    const articleEntity = ArticleMapper.toEntity(article);
    await this.articleRepository.update(articleEntity.id, articleEntity);
    const entity = await this.getOneById(articleEntity.id);

    if (!entity) {
      throw new NotFoundException("Erreur lor de la mise à jour de l'article");
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
}
