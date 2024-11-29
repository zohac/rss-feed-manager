// src/routes/articles.ts
import { Router } from 'express';

import { ArticleController } from '../controllers/ArticleController';

export const articlesRouter = (
  articleController: ArticleController,
): Router => {
  const router = Router();

  // Routes pour les articles
  router.get('/', articleController.getArticles);
  router.get('/:id', articleController.getArticle);
  router.post('/', articleController.createArticle);
  router.put('/:id', articleController.updateArticle);
  router.delete('/:id', articleController.deleteArticle);

  // Route pour obtenir les articles d'un flux spécifique
  router.get('/feeds/:feedId', articleController.getArticlesByFeedId);

  return router;
};
