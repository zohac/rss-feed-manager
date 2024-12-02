// src/presentation/routes/articles.ts
import { Router } from 'express';

import { AIAnalysisController } from '../controllers/AIAnalysisController';

export const analysisRouter = (
  analysisController: AIAnalysisController,
): Router => {
  const router = Router();

  // Routes pour les analyses
  router.post(
    '/agent/:agentId/article/:articleId',
    analysisController.startOneArticleAnalysis,
  );
  router.post('/agent/:agentId', analysisController.startAnalysisByAgent);
  router.post('/agent/:agentId', analysisController.startAnalysis);
  router.get('/', analysisController.getAllAnalysis);
  router.get('/:id', analysisController.getOneAnalysis);
  // router.put('/:id', analysisController.updateAgent);
  // router.delete('/:id', analysisController.deleteAgent);

  return router;
};
