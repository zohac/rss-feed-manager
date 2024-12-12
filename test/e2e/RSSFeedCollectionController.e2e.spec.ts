// test/e2e/RSSFeedCollectionController.e2e.spec.ts
import request from 'supertest';
import app, { configureApp } from '../../src/app';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { Repository } from 'typeorm';
import { RSSFeedCollectionEntity } from '../../src/infrastructure/entities/RSSFeedCollectionEntity';

describe('RSSFeedCollectionController E2E Tests', () => {
  let repository: Repository<RSSFeedCollectionEntity>;

  beforeAll(async () => {
    // Configurer l'application (sans réinitialiser TestDataSource)
    await configureApp();
    repository = TestDataSource.getRepository(
      RSSFeedCollectionEntity,
    );
  });

  // Pas besoin de afterAll ici, car jest.setup.ts le gère

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await repository.query('DELETE FROM rss_feed_collection_entity');
  });

  describe('GET /api/collections/feeds', () => {
    it('should return all collections', async () => {
      // Ajouter des données de test
      const collections = [
        { name: 'Collection 1' },
        { name: 'Collection 2', description: 'Une collection de flux rss' },
      ];
      await repository.save(collections);

      const response = await request(app).get('/api/collections/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name', 'Collection 1');
      expect(response.body[1]).toHaveProperty('name', 'Collection 2');
      expect(response.body[1]).toHaveProperty('description', 'Une collection de flux rss');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/collections/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/collections/feeds/:id', () => {
    it('should return a collection by ID', async () => {
      const collection = await repository.save({ name: 'Collection 1' });

      const response = await request(app).get(`/api/collections/feeds/${collection.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Collection 1');
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app).get('/api/collections/feeds/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Collection non trouvée');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/collections/feeds/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
      expect(response.body).toHaveProperty('error', 'Invalid value');
    });
  });

  describe('POST /api/collections/feeds', () => {
    it('should create a new collection', async () => {
      const newCollection = { name: 'New Collection' };

      const response = await request(app)
        .post('/api/collections/feeds')
        .send(newCollection);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Collection');

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: response.body.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('New Collection');
    });

    it('should return 400 if validation fails', async () => {
      const invalidCollection = { name: null }; // Supposons que le nom est requis

      const response = await request(app)
        .post('/api/collections/feeds')
        .send(invalidCollection);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/collections/feeds/:id', () => {
    it('should update an existing collection', async () => {
      const collection = await repository.save({ name: 'Old Name' });
      const updatedData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/collections/feeds/${collection.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Updated Name');

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('Updated Name');
    });

    it('should return 400 if validation fails', async () => {
      const collection = await repository.save({ name: 'Old Name' });
      const invalidData = { name: '' }; // Supposons que le nom est requis

      const response = await request(app)
        .put(`/api/collections/feeds/${collection.id}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 404 if collection does not exist', async () => {
      const updatedData = { name: 'Updated Name' };

      const response = await request(app)
        .put('/api/collections/feeds/999')
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .put('/api/collections/feeds/invalid-id')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/collections/feeds/:id', () => {
    it('should delete an existing collection', async () => {
      const collection = await repository.save({ name: 'To Be Deleted' });

      const response = await request(app).delete(`/api/collections/feeds/${collection.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeNull();
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app).delete('/api/collections/feeds/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).delete('/api/collections/feeds/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });
});
