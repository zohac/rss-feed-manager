// src/routes/index.ts
import { Router } from 'express';

import { CollectionController } from '../controllers/CollectionController';
import { RSSFeedController } from '../controllers/RSSFeedController';

import { collectionsRouter } from './collections';
import { feedsRouter } from './feeds';

export const createRouter = (
  feedController: RSSFeedController,
  collectionController: CollectionController,
): Router => {
  const router = Router();

  // Attacher les routeurs individuels au routeur principal
  router.use('/feeds', feedsRouter(feedController));
  router.use('/collections', collectionsRouter(collectionController));
  return router;
};
