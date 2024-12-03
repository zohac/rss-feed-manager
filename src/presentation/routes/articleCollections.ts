// src/presentation/routes/articleCollections.ts
import { Router } from 'express';

import { ArticleCollectionController } from '../controllers/ArticleCollectionController';

export const articleCollectionsRouter = (
  collectionController: ArticleCollectionController,
): Router => {
  const router = Router();

  // Routes pour les collections
  router.get('/articles/', collectionController.getAllCollections);
  router.get('/articles/:id', collectionController.getCollectionById);
  router.post('/articles/', collectionController.createCollection);
  router.put('/articles/:id', collectionController.updateCollection);
  router.delete('/articles/:id', collectionController.deleteCollection);

  return router;
};
