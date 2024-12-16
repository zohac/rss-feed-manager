// tests/e2e/ArticleController.e2e.test.ts
import request from 'supertest';
import { Repository } from 'typeorm';

import app, { configureApp } from '../../src/app';
import { UpdateActionDTO } from '../../src/application/dtos/ActionDTO';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
} from '../../src/application/dtos/ArticleDTO';
import { ArticleSourceType } from '../../src/domain/entities/Article';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { ArticleEntity } from '../../src/infrastructure/entities/ArticleEntity';
import { createArticlesFixtures } from '../fixtures/ArticlesFixtures';

describe('ArticleController E2E Tests', () => {
  let repository: Repository<ArticleEntity>;

  beforeAll(async () => {
    await configureApp();
    repository = TestDataSource.getRepository(ArticleEntity);
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM article_entity');
  });

  describe('GET /api/articles', () => {
    it('should return all Articles', async () => {
      await createArticlesFixtures(repository);
      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', "Titre de l'article 1");
      expect(response.body[1]).toHaveProperty('title', "Titre de l'article 2");
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('should return a article by ID', async () => {
      const [action] = await createArticlesFixtures(repository);

      const response = await request(app).get(`/api/articles/${action.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', "Titre de l'article 1");
    });

    it('should return 404 if article not found', async () => {
      await createArticlesFixtures(repository);

      const response = await request(app).get('/api/articles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Article non trouvé');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/articles/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
      expect(response.body).toHaveProperty('error', 'Invalid value');
    });
  });

  describe('POST /api/articles', () => {
    it('should create a new article', async () => {
      const newArticleDTO = {
        title: 'New article',
        link: 'http://fake.article.com/new',
        description: 'Une description pour le nouvel article.',
        content: 'Un contenu plus long pour le nouvel article.',
        isRead: false,
        isFavorite: false,
        isArchived: false,
        isSaved: false,
      };

      const response = await request(app)
        .post('/api/articles')
        .send(newArticleDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New article');

      // Vérifier dans la base de données
      const article = await repository.findOneBy({ id: response.body.id });
      expect(article).toBeDefined();
      expect(article?.title).toBe('New article');
    });

    it('should return 400 for validation errors', async () => {
      const invalidArticle = {
        title: '',
        link: 'http://fake.article.com/new',
        description: 'Une description pour le nouvel article.',
        content: 'Un contenu plus long pour le nouvel article.',
        isRead: false,
        isFavorite: false,
        isArchived: false,
        isSaved: false,
      };

      const response = await request(app)
        .post('/api/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('should update an existing article', async () => {
      const [article] = await createArticlesFixtures(repository);

      const updateAction: UpdateArticleDTO = {
        id: article.id,
        title: 'Updated Article',
      };

      const response = await request(app)
        .put(`/api/articles/${article.id}`)
        .send(updateAction);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', article.id);
      expect(response.body).toHaveProperty('title', 'Updated Article');
    });

    it('should return 400 for validation errors', async () => {
      const [article] = await createArticlesFixtures(repository);

      const updateAction = {
        id: article.id,
        isRead: 'false',
      };

      const response = await request(app)
        .put(`/api/articles/${article.id}`)
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if article to update is not found', async () => {
      await createArticlesFixtures(repository);

      const updateAction = {
        id: 999,
        name: 'Updated Action',
      };

      const response = await request(app)
        .put('/api/articles/999')
        .send(updateAction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an existing article', async () => {
      const [article] = await createArticlesFixtures(repository);

      const response = await request(app).delete(`/api/articles/${article.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const rssFeed = await repository.findOneBy({ id: article.id });
      expect(rssFeed).toBeNull();
    });

    it('should return 404 if article to delete is not found', async () => {
      const response = await request(app).delete('/api/articles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/articles/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });
});
