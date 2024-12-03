// src/routes/index.ts
import { Router } from 'express';

import { AIAgentController } from '../controllers/AIAgentController';
import { AIAnalysisController } from '../controllers/AIAnalysisController';
import { ArticleCollectionController } from '../controllers/ArticleCollectionController';
import { ArticleController } from '../controllers/ArticleController';
import { RSSFeedCollectionController } from '../controllers/RSSFeedCollectionController';
import { RSSFeedController } from '../controllers/RSSFeedController';

import { agentRouter } from './agent';
import { analysisRouter } from './analysis';
import { articleCollectionsRouter } from './articleCollections';
import { articlesRouter } from './articles';
import { feedsRouter } from './feeds';
import { rssFeedCollectionsRouter } from './rssFeedCollections';

export const createRouter = (
  feedController: RSSFeedController,
  rssFeedCollectionController: RSSFeedCollectionController,
  articleCollectionController: ArticleCollectionController,
  articlesController: ArticleController,
  agentController: AIAgentController,
  analysisController: AIAnalysisController,
): Router => {
  const router = Router();

  // Attacher les routeurs individuels au routeur principal
  router.use('/feeds', feedsRouter(feedController));
  router.use(
    '/collections',
    rssFeedCollectionsRouter(rssFeedCollectionController),
  );
  router.use(
    '/collections',
    articleCollectionsRouter(articleCollectionController),
  );
  router.use('/articles', articlesRouter(articlesController));
  router.use('/agents', agentRouter(agentController));
  router.use('/analysis', analysisRouter(analysisController));

  return router;
};
