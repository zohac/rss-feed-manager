// src/routes/collections.ts
import { Router } from 'express';

import { RSSFeedCollectionController } from '../controllers/RSSFeedCollectionController';

export const rssFeedCollectionsRouter = (
  collectionController: RSSFeedCollectionController,
): Router => {
  const router = Router();

  // Routes pour les collections
  router.get('/feeds/', collectionController.getAllCollections);
  router.get('/feeds/:id', collectionController.getCollectionById);
  router.post('/feeds/', collectionController.createCollection);
  router.put('/feeds/:id', collectionController.updateCollection);
  router.delete('/feeds/:id', collectionController.deleteCollection);

  return router;
};
