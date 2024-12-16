// tests/e2e/ArticleCollectionController.e2e.spec.ts
import request from 'supertest';
import { Repository } from 'typeorm';

import app, { configureApp } from '../../src/app';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { ArticleCollectionEntity } from '../../src/infrastructure/entities/ArticleCollectionEntity';
import { createArticleCollectionsFixture } from '../fixtures/ArticleCollectionsFixtures';

describe('ArticleCollectionController E2E Tests', () => {
  let repository: Repository<ArticleCollectionEntity>;

  beforeAll(async () => {
    await configureApp();
    repository = TestDataSource.getRepository(ArticleCollectionEntity);
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM article_collection_entity');
  });

  describe('GET /api/collections/articles', () => {
    it('should return all article collections', async () => {
      await createArticleCollectionsFixture(repository);

      const response = await request(app).get('/api/collections/articles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Tech Articles');
      expect(response.body[1]).toHaveProperty('name', 'Sports Articles');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/collections/articles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/collections/articles/:id', () => {
    it('should return an article collection by ID', async () => {
      const [collection] = await createArticleCollectionsFixture(repository);

      const response = await request(app).get(
        `/api/collections/articles/${collection.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Tech Articles');
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app).get('/api/collections/articles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Collection non trouvée');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get(
        '/api/collections/articles/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });

  describe('POST /api/collections/articles', () => {
    it('should create a new article collection', async () => {
      const newCollection = {
        name: 'New Collection',
        description: 'A description',
      };

      const response = await request(app)
        .post('/api/collections/articles')
        .send(newCollection);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Collection');

      const dbCollection = await repository.findOneBy({ id: response.body.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('New Collection');
    });

    it('should return 400 if validation fails', async () => {
      const invalidCollection = { name: '' }; // Assume name is required

      const response = await request(app)
        .post('/api/collections/articles')
        .send(invalidCollection);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/collections/articles/:id', () => {
    it('should update an existing article collection', async () => {
      const [collection] = await createArticleCollectionsFixture(repository);
      const updatedData = {
        name: 'Updated Collection',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/collections/articles/${collection.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Updated Collection');

      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('Updated Collection');
    });

    it('should return 400 if validation fails', async () => {
      const [collection] = await createArticleCollectionsFixture(repository);
      const invalidData = { name: '' }; // Assume name is required

      const response = await request(app)
        .put(`/api/collections/articles/${collection.id}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 404 if collection does not exist', async () => {
      const updatedData = {
        name: 'Updated Collection',
        description: 'Updated description',
      };

      const response = await request(app)
        .put('/api/collections/articles/999')
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .put('/api/collections/articles/invalid-id')
        .send({ name: 'Updated Collection' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/collections/articles/:id', () => {
    it('should delete an existing article collection', async () => {
      const [collection] = await createArticleCollectionsFixture(repository);

      const response = await request(app).delete(
        `/api/collections/articles/${collection.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeNull();
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app).delete(
        '/api/collections/articles/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).delete(
        '/api/collections/articles/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });
});
