// src/presentation/controllers/ActionController.ts

import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { NotFoundException } from '../../application/exception/NotFoundException';
import { ActionUseCases } from '../../application/usecases/ActionUseCases';
import logger from '../../infrastructure/logger/logger';
import { NumberUtils } from '../../utils/NumberUtils';
import { ActionDTOFactory } from '../factories/ActionDTOFactory';

export class ActionController {
  constructor(private readonly useCases: ActionUseCases) {}

  getAllActions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const action = await this.useCases.getAll();
      res.json(action);
    } catch (error) {
      logger.error('Erreur lors de la récupération des actions : ', error);
      next(error);
    }
  };

  getOneAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const action = await this.useCases.getOneById(id);
      if (!action) {
        throw new NotFoundException('Action non trouvé');
      }

      res.json(action);
    } catch (error) {
      next(error);
    }
  };

  createAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = ActionDTOFactory.create(req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const action = await this.useCases.create(dto);
      res.status(201).json(action);
    } catch (error) {
      next(error);
    }
  };

  // Mettre à jour une Action
  updateAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const data = { id, ...req.body };

      const dto = ActionDTOFactory.update(data);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedAction = await this.useCases.update(dto);
      res.status(200).json(updatedAction);
    } catch (error) {
      next(error);
    }
  };

  deleteAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const action = await this.useCases.getOneById(id);
      if (!action) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      await this.useCases.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  executeAllAction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.useCases.executeAllActions();
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}
