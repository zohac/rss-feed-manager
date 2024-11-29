// src/routes/index.ts
import { Router } from 'express';

import { ArticleController } from '../controllers/ArticleController';
import { CollectionController } from '../controllers/CollectionController';
import { RSSFeedController } from '../controllers/RSSFeedController';

import { articlesRouter } from './articles';
import { collectionsRouter } from './collections';
import { feedsRouter } from './feeds';

export const createRouter = (
  feedController: RSSFeedController,
  collectionController: CollectionController,
  articlesController: ArticleController,
): Router => {
  const router = Router();

  // Attacher les routeurs individuels au routeur principal
  router.use('/feeds', feedsRouter(feedController));
  router.use('/collections', collectionsRouter(collectionController));
  router.use('/articles', articlesRouter(articlesController));
  return router;
};
