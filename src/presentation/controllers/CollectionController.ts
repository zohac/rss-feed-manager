// src/controllers/CollectionController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import {
  CreateCollectionDTO,
  UpdateCollectionDTO,
} from '../../application/dtos/CollectionDTO';
import { CollectionUseCases } from '../../application/usecases/CollectionUseCases';

export class CollectionController {
  private readonly useCases: CollectionUseCases;

  constructor(useCases: CollectionUseCases) {
    this.useCases = useCases;
  }

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
      const collection = await this.useCases.getOneById(Number(req.params.id));
      if (collection) {
        res.json(collection);
      } else {
        res.status(404).json({ message: 'Collection non trouvée' });
      }
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
      const dto = plainToInstance(CreateCollectionDTO, req.body);
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
      const dto = plainToInstance(UpdateCollectionDTO, { id, ...req.body });
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
      await this.useCases.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
