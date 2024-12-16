// src/controllers/AIAgentController.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import {
  CreateAIAgentDTO,
  UpdateAIAgentDTO,
} from '../../application/dtos/AIAgentDTO';
import { NotFoundException } from '../../application/exception/NotFoundException';
import { AIAgentUseCases } from '../../application/usecases/AIAgentUseCases';
import logger from '../../infrastructure/logger/logger';
import { NumberUtils } from '../../utils/NumberUtils';

export class AIAgentController {
  private readonly useCases: AIAgentUseCases;

  constructor(useCases: AIAgentUseCases) {
    this.useCases = useCases;
  }

  getAllAgents = async (req: Request, res: Response) => {
    try {
      const agents = await this.useCases.getAll();
      res.json(agents);
    } catch (error) {
      logger.error('Erreur lors de la récupération des agents IA:', error);
      res.status(500).send('Erreur interne du serveur');
    }
  };

  getOneAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const agent = await this.useCases.getOneById(id);
      if (!agent) {
        throw new NotFoundException('Agent non trouvé');
      }

      res.json(agent);
    } catch (error) {
      next(error);
    }
  };

  createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateAIAgentDTO, req.body);
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
  updateAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const dto = plainToInstance(UpdateAIAgentDTO, { id, ...req.body });
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

  deleteAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      NumberUtils.validateNumber(id);

      const agent = await this.useCases.getOneById(id);
      if (!agent) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      await this.useCases.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
