// src/routes/index.ts
import { Router } from 'express';

import { AIAgentController } from '../controllers/AIAgentController';
import { ArticleController } from '../controllers/ArticleController';
import { CollectionController } from '../controllers/CollectionController';
import { RSSFeedController } from '../controllers/RSSFeedController';

import { agentRouter } from './agent';
import { articlesRouter } from './articles';
import { collectionsRouter } from './collections';
import { feedsRouter } from './feeds';

export const createRouter = (
  feedController: RSSFeedController,
  collectionController: CollectionController,
  articlesController: ArticleController,
  agentController: AIAgentController,
): Router => {
  const router = Router();

  // Attacher les routeurs individuels au routeur principal
  router.use('/feeds', feedsRouter(feedController));
  router.use('/collections', collectionsRouter(collectionController));
  router.use('/articles', articlesRouter(articlesController));
  router.use('/agents', agentRouter(agentController));

  return router;
};
