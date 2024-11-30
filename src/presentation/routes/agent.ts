// src/presentation/routes/articles.ts
import { Router } from 'express';

import { AIAgentController } from '../controllers/AIAgentController';

export const agentRouter = (agentController: AIAgentController): Router => {
  const router = Router();

  // Routes pour les articles
  router.get('/', agentController.getAllAgents);
  router.get('/:id', agentController.getOneAgent);
  router.post('/', agentController.createAgent);
  router.put('/:id', agentController.updateAgent);
  router.delete('/:id', agentController.deleteAgent);

  return router;
};
