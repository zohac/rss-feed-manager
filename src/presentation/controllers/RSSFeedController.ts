// src/presentation/controllers/RSSFeedController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import {
  CreateRSSFeedDTO,
  UpdateRSSFeedDTO,
} from '../../application/dtos/RSSFeedDTO';
import { RSSFeedUseCases } from '../../application/usecases/RSSFeedUseCases';

export class RSSFeedController {
  private readonly rssFeedUseCases: RSSFeedUseCases;

  constructor(rssFeedUseCases: RSSFeedUseCases) {
    this.rssFeedUseCases = rssFeedUseCases;
  }

  getAllFeeds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feeds = await this.rssFeedUseCases.getAll();
      res.json(feeds);
    } catch (error) {
      next(error);
    }
  };

  getFeedById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const feed = await this.rssFeedUseCases.getOneById(Number(req.params.id));
      if (feed) {
        res.json(feed);
      } else {
        res.status(404).json({ message: 'Flux non trouvé' });
      }
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

      const newFeed = await this.rssFeedUseCases.create(dto);
      res.status(201).json(newFeed);
    } catch (error) {
      next(error);
    }
  };

  updateFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto = plainToInstance(UpdateRSSFeedDTO, { id, ...req.body });
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedFeed = await this.rssFeedUseCases.update(dto);
      res.status(200).json(updatedFeed);
    } catch (error) {
      next(error);
    }
  };

  deleteFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.rssFeedUseCases.delete(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
