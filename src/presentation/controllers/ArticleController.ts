// src/controllers/ArticleController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import {
  CreateArticleDTO,
  UpdateArticleDTO,
} from '../../application/dtos/ArticleDTO';
import { ArticleUseCases } from '../../application/usecases/ArticleUseCases';
import { ArticleSourceType } from '../../domain/entities/Article';

export class ArticleController {
  private readonly useCases: ArticleUseCases;

  constructor(useCases: ArticleUseCases) {
    this.useCases = useCases;
  }

  // Récupérer les articles d'un flux RSS
  getArticlesByFeedId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const feedId = Number(req.params.feedId);
      const articles = await this.useCases.getArticlesByFeedId(feedId);
      res.json(articles);
    } catch (error) {
      next(error);
    }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await this.useCases.getAll();
      res.json(articles);
    } catch (error) {
      next(error);
    }
  };

  getArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const articles = await this.useCases.getOneById(id);

      res.json(articles);
    } catch (error) {
      next(error);
    }
  };

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateArticleDTO, {
        publicationDate: new Date(),
        sourceType: ArticleSourceType.MANUAL,
        ...req.body,
      });
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const newArticle = await this.useCases.create(dto);
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  };

  // Mettre à jour un article (isRead, isFavorite, etc.)
  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto = plainToInstance(UpdateArticleDTO, { id, ...req.body });
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedArticle = await this.useCases.update(dto);
      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  };

  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.useCases.delete(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
