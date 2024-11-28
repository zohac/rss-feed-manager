// src/routes/collections.ts
import { Router } from 'express';

import { CollectionController } from '../controllers/CollectionController';

export const collectionsRouter = (
  collectionController: CollectionController,
): Router => {
  const router = Router();

  // Routes pour les collections
  router.get('/', collectionController.getAllCollections);
  router.get('/:id', collectionController.getCollectionById);
  router.post('/', collectionController.createCollection);
  router.put('/:id', collectionController.updateCollection);
  router.delete('/:id', collectionController.deleteCollection);

  return router;
};
