// src/presentation/controllers/RSSFeedController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import {
  CreateRSSFeedDTO,
  UpdateRSSFeedDTO,
} from '../../application/dtos/RSSFeedDTO';
import { RSSFeedUseCases } from '../../application/usecases/RSSFeedUseCases';
import { NumberUtils } from '../../utils/NumberUtils';

export class RSSFeedController {
  constructor(private readonly useCases: RSSFeedUseCases) {}

  getAllFeeds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feeds = await this.useCases.getAll();
      res.json(feeds);
    } catch (error) {
      next(error);
    }
  };

  getFeedById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const feed = await this.useCases.getOneById(Number(id));
      if (feed) {
        return res.json(feed);
      }

      return res.status(404).json({ message: 'Flux non trouvé' });
    } catch (error) {
      next(error);
    }
  };

  createFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateRSSFeedDTO, req.body);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const newFeed = await this.useCases.create(dto);
      res.status(201).json(newFeed);
    } catch (error) {
      next(error);
    }
  };

  updateFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const dto = plainToInstance(UpdateRSSFeedDTO, { id, ...req.body });
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedFeed = await this.useCases.update(dto);
      res.status(200).json(updatedFeed);
    } catch (error) {
      next(error);
    }
  };

  deleteFeed = async (req: Request, res: Response, next: NextFunction) => {
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
