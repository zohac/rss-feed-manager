// src/controllers/AIAgentController.ts

import { NextFunction, Request, Response } from 'express';

import { AIAnalysisUseCase } from '../../application/usecases/AIAnalysisUseCase';
import logger from '../../infrastructure/logger/logger';

export class AIAnalysisController {
  private readonly useCases: AIAnalysisUseCase;

  constructor(useCases: AIAnalysisUseCase) {
    this.useCases = useCases;
  }

  startOneArticleAnalysis = async (req: Request, res: Response) => {
    try {
      const agentId = Number(req.params.agentId);
      const articleId = Number(req.params.articleId);
      const analysis = await this.useCases.analysisOneArticleWithAgent(
        agentId,
        articleId,
      );
      res.json(analysis);
    } catch (error) {
      logger.error('Erreur lors de la récupération des agents IA:', error);
      res.status(500).send('Erreur interne du serveur');
    }
  };

  startAnalysisByAgent = async (req: Request, res: Response) => {
    try {
      const agentId = Number(req.params.agentId);
      const analysis = await this.useCases.analysisAllByOneAgent(agentId);
      res.json(analysis);
    } catch (error) {
      logger.error('Erreur lors de la récupération des agents IA:', error);
      res.status(500).send('Erreur interne du serveur');
    }
  };

  startAllAnalysis = async (req: Request, res: Response) => {
    try {
      const analysis = await this.useCases.analysisAll();
      res.json(analysis);
    } catch (error) {
      logger.error('Erreur lors de la récupération des agents IA:', error);
      res.status(500).send('Erreur interne du serveur');
    }
  };

  getAllAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analysis = await this.useCases.getAll();
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  };

  getOneAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const articles = await this.useCases.getOneById(id);

      res.json(articles);
    } catch (error) {
      next(error);
    }
  };
}
