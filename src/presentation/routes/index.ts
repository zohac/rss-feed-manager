// src/routes/index.ts
import { Router } from 'express';

import { RSSFeedController } from '../controllers/RSSFeedController';

import { feedsRouter } from './feeds';

export const createRouter = (
  feedController: RSSFeedController,
): Router => {
  const router = Router();

  // Attacher les routeurs individuels au routeur principal
  router.use('/feeds', feedsRouter(feedController));
  return router;
};
