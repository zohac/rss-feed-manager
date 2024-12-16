// src/presentation/controllers/ArticleCollectionController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import {
  CreateArticleCollectionDTO,
  UpdateArticleCollectionDTO,
} from '../../application/dtos/ArticleCollectionDTO';
import { ArticleCollectionUseCases } from '../../application/usecases/ArticleCollectionUseCases';
import { NumberUtils } from '../../utils/NumberUtils';

export class ArticleCollectionController {
  constructor(private readonly useCases: ArticleCollectionUseCases) {}

  getAllCollections = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const collections = await this.useCases.getAll();
      res.json(collections);
    } catch (error) {
      next(error);
    }
  };

  getCollectionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const collection = await this.useCases.getOneById(id);
      if (collection) {
        return res.json(collection);
      }

      res.status(404).json({ message: 'Collection non trouvée' });
    } catch (error) {
      next(error);
    }
  };

  createCollection = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = plainToInstance(CreateArticleCollectionDTO, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const newCollection = await this.useCases.create(dto);
      res.status(201).json(newCollection);
    } catch (error) {
      next(error);
    }
  };

  updateCollection = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const dto = plainToInstance(UpdateArticleCollectionDTO, {
        id,
        ...req.body,
      });
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const collectionUpdated = await this.useCases.update(dto);
      res.status(200).json(collectionUpdated);
    } catch (error) {
      next(error);
    }
  };

  deleteCollection = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const collection = await this.useCases.getOneById(id);
      if (!collection) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      await this.useCases.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
