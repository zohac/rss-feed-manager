// src/usecases/ArticleUseCases.ts

import { Article, ArticleSourceType } from '../../domain/entities/Article';
import logger from '../../infrastructure/logger/logger';
import { ArticleCollectionRepository } from '../../infrastructure/repositories/ArticleCollectionRepository';
import { ArticleRepository } from '../../infrastructure/repositories/ArticleRepository';
import { CreateArticleDTO, UpdateArticleDTO } from '../dtos/ArticleDTO';
import { IUseCase } from '../interfaces/IUseCase';

export class ArticleUseCases
  implements IUseCase<Article, CreateArticleDTO, UpdateArticleDTO>
{
  private readonly articleRepository: ArticleRepository;
  private readonly collectionRepository: ArticleCollectionRepository;

  constructor(
    articleRepository: ArticleRepository,
    collectionRepository: ArticleCollectionRepository,
  ) {
    this.articleRepository = articleRepository;
    this.collectionRepository = collectionRepository;
  }

  async create(articleDTO: CreateArticleDTO): Promise<Article> {
    let existingArticle: Article | null = null;

    if (undefined !== articleDTO.link) {
      existingArticle = await this.articleRepository.getOneByLink(
        articleDTO.link,
      );
      if (existingArticle) {
        return existingArticle;
      }
    }

    const article = new Article(
      undefined,
      articleDTO.title,
      articleDTO.publicationDate,
      articleDTO.isRead,
      articleDTO.isFavorite,
      articleDTO.isArchived,
      articleDTO.isSaved,
      undefined,
      ArticleSourceType.MANUAL,
      undefined,
      articleDTO.description,
      articleDTO.content,
    );

    if (undefined !== articleDTO.collectionId) {
      const collection = await this.collectionRepository.getOneById(
        articleDTO.collectionId,
      );

      if (null !== collection) {
        article.collection = collection;
      }
    }

    return await this.articleRepository.create(article);
  }

  async getOneById(id: number): Promise<Article | null> {
    return await this.articleRepository.getOneById(id);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    return await this.articleRepository.getArticlesByFeedId(feedId);
  }

  async getAll(): Promise<Article[]> {
    return await this.articleRepository.getAll();
  }

  async update(articleDto: UpdateArticleDTO): Promise<Article> {
    const article = await this.articleRepository.getOneById(articleDto.id);

    if (!article) {
      const errorMessage =
        "Une erreur est survenu lors de la mise à jour à jour de l'article";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Contrôler les modifications en fonction du sourceType
    this.updateManualArticle(article, articleDto);

    // Propriétés communes
    if (undefined !== articleDto.isRead) article.isRead = articleDto.isRead;
    if (undefined !== articleDto.isFavorite)
      article.isFavorite = articleDto.isFavorite;
    if (undefined !== articleDto.isArchived)
      article.isArchived = articleDto.isArchived;
    if (undefined !== articleDto.isSaved) article.isSaved = articleDto.isSaved;
    if (articleDto.tags !== undefined) article.tag = articleDto.tags;

    if (articleDto.collectionId !== undefined) {
      if (articleDto.collectionId !== null) {
        // Si collectionId est défini et n'est pas null, on récupère la collection
        const collection = await this.collectionRepository.getOneById(
          articleDto.collectionId,
        );
        if (!collection) {
          const errorMessage = "La collection spécifiée n'existe pas";
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }
        article.collection = collection;
      } else {
        // Si collectionId est null, on retire la collection de l'article
        article.collection = null;
      }
    }

    return await this.articleRepository.update(article);
  }

  private updateManualArticle(article: Article, articleDto: UpdateArticleDTO) {
    if (article.sourceType === 'manual') {
      // Permettre la modification de toutes les propriétés
      if (articleDto.title !== undefined) article.title = articleDto.title;
      if (articleDto.link !== undefined) article.link = articleDto.link;
      if (articleDto.publicationDate !== undefined)
        article.publicationDate = articleDto.publicationDate;
      if (articleDto.description !== undefined)
        article.description = articleDto.description;
      if (articleDto.content !== undefined)
        article.content = articleDto.content;
    }
  }

  async delete(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }

  async deleteOldRSSArticles(olderThan: Date): Promise<void> {
    await this.articleRepository.deleteOldRSSArticles(olderThan);
  }
}
