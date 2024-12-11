// src/presentation/routes/actions.ts
import { Router } from 'express';

import { ActionController } from '../controllers/ActionController';

export const actionRouter = (controller: ActionController): Router => {
  const router = Router();

  // Routes pour les articles
  router.get('/', controller.getAllActions);
  router.get('/:id', controller.getOneAction);
  router.post('/', controller.createAction);
  router.put('/:id', controller.updateAction);
  router.delete('/:id', controller.deleteAction);

  router.post('/execute/all', controller.executeAllAction);

  return router;
};
