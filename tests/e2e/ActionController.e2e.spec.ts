// tests/e2e/RSSFeedController.e2e.test.ts
import request from 'supertest';
import { Repository } from 'typeorm';

import app, { configureApp } from '../../src/app';
import { CreateAssignToCollectionActionDTO } from '../../src/application/dtos/AssignToCollectionActionDTO';
import { ActionType } from '../../src/domain/entities/Action';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { ActionEntity } from '../../src/infrastructure/entities/ActionEntity';
import { ArticleCollectionEntity } from '../../src/infrastructure/entities/ArticleCollectionEntity';
import { createActionsFixture } from '../fixtures/ActionsFixtures';
import { createArticleCollectionsFixture } from '../fixtures/ArticleCollectionsFixtures';

describe('ActionController E2E Tests', () => {
  let repository: Repository<ActionEntity>;
  let articleCollectionRepository: Repository<ArticleCollectionEntity>;

  beforeAll(async () => {
    await configureApp();
    repository = TestDataSource.getRepository(ActionEntity);
    articleCollectionRepository = TestDataSource.getRepository(
      ArticleCollectionEntity,
    );
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM action_entity');
  });

  describe('GET /api/actions', () => {
    it('should return all Action', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      await createActionsFixture(repository);

      const response = await request(app).get('/api/actions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Action 1');
      expect(response.body[1]).toHaveProperty('name', 'Action 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/actions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/actions/:id', () => {
    it('should return a action by ID', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      const [action] = await createActionsFixture(repository);

      const response = await request(app).get(`/api/actions/${action.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Action 1');
    });

    it('should return 404 if action not found', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      await createActionsFixture(repository);

      const response = await request(app).get('/api/actions/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Action non trouvé');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/actions/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
      expect(response.body).toHaveProperty('error', 'Invalid value');
    });
  });

  describe('POST /api/actions', () => {
    it('should create a new action', async () => {
      const newFeedDTO: CreateAssignToCollectionActionDTO = {
        name: 'New Action',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: 2,
      };

      const response = await request(app).post('/api/actions').send(newFeedDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Action');

      // Vérifier dans la base de données
      const action = await repository.findOneBy({ id: response.body.id });
      expect(action).toBeDefined();
      expect(action?.name).toBe('New Action');
    });

    it('should return 400 for validation errors', async () => {
      const invalidAction = {
        name: '', // Name is required and should not be empty
        type: 'invalid-type',
      };

      const response = await request(app)
        .post('/api/actions')
        .send(invalidAction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });

  describe('PUT /api/actions/:id', () => {
    it('should update an existing action', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      const [action] = await createActionsFixture(repository);

      const updateAction = {
        name: 'Updated Action',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: 1,
      };

      const response = await request(app)
        .put(`/api/actions/${action.id}`)
        .send(updateAction);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', action.id);
      expect(response.body).toHaveProperty('name', 'Updated Action');
    });

    it('should return 400 for validation errors', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      const [action] = await createActionsFixture(repository);

      const updateAction = {
        name: '',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: 1,
      };

      const response = await request(app)
        .put(`/api/actions/${action.id}`)
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if action to update is not found', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      await createActionsFixture(repository);

      const updateAction = {
        name: 'Updated Action',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: 1,
      };

      const response = await request(app)
        .put('/api/actions/999')
        .send(updateAction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });
  });

  describe('DELETE /actions/:id', () => {
    it('should delete an existing action', async () => {
      await createArticleCollectionsFixture(articleCollectionRepository);
      const [action] = await createActionsFixture(repository);

      const response = await request(app).delete(`/api/actions/${action.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const rssFeed = await repository.findOneBy({ id: action.id });
      expect(rssFeed).toBeNull();
    });

    it('should return 404 if action to delete is not found', async () => {
      const response = await request(app).delete('/api/actions/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/actions/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });
});
