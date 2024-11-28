// src/routes/feeds.ts
import { Router } from 'express';

import { RSSFeedController } from '../controllers/RSSFeedController';

export const feedsRouter = (feedController: RSSFeedController): Router => {
  const router = Router();

  router.get('/', feedController.getAllFeeds);
  router.get('/:id', feedController.getFeedById);
  router.post('/', feedController.createFeed);
  router.put('/:id', feedController.updateFeed);
  router.delete('/:id', feedController.deleteFeed);

  return router;
};
