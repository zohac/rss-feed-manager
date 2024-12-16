// tests/e2e/RSSFeedController.e2e.test.ts
import request from 'supertest';
import { Repository } from 'typeorm';

import app, { configureApp } from '../../src/app';
import { CreateRSSFeedDTO } from '../../src/application/dtos/RSSFeedDTO';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { RSSFeedCollectionEntity } from '../../src/infrastructure/entities/RSSFeedCollectionEntity';
import { RSSFeedEntity } from '../../src/infrastructure/entities/RSSFeedEntity';
import { createRSSFeedCollectionFixture } from '../fixtures/RSSFeedCollectionFixtures';
import { createRSSFeedFixture } from '../fixtures/RSSFeedFixtures';

describe('RSSFeedController E2E Tests', () => {
  let repository: Repository<RSSFeedEntity>;
  let rssFeedCollectionRepository: Repository<RSSFeedCollectionEntity>;

  beforeAll(async () => {
    await configureApp();
    repository = TestDataSource.getRepository(RSSFeedEntity);
    rssFeedCollectionRepository = TestDataSource.getRepository(
      RSSFeedCollectionEntity,
    );
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM rss_feed_entity');
  });

  describe('GET /api/feeds', () => {
    it('should return all RSS feeds', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      await createRSSFeedFixture(repository);

      const response = await request(app).get('/api/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Feed 1');
      expect(response.body[1]).toHaveProperty('title', 'Feed 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/feeds/:id', () => {
    it('should return a feed by ID', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      const [feeds] = await createRSSFeedFixture(repository);

      const response = await request(app).get(`/api/feeds/${feeds.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Feed 1');
    });

    it('should return 404 if feed not found', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      await createRSSFeedFixture(repository);

      const response = await request(app).get('/api/feeds/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Flux non trouvé' });
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/feeds/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
      expect(response.body).toHaveProperty('error', 'Invalid value');
    });
  });

  describe('POST /api/feeds', () => {
    it('should create a new feed', async () => {
      const newFeedDTO: CreateRSSFeedDTO = {
        title: 'New Feed',
        url: 'http://example.com/newfeed',
        description: 'New feed description',
        collectionId: 1,
      };

      const response = await request(app).post('/api/feeds').send(newFeedDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Feed');

      // Vérifier dans la base de données
      const feed = await repository.findOneBy({ id: response.body.id });
      expect(feed).toBeDefined();
      expect(feed?.title).toBe('New Feed');
    });

    it('should return 400 for validation errors', async () => {
      const invalidFeed = {
        title: '', // Title is required and should not be empty
        url: 'invalid-url',
      };

      const response = await request(app).post('/api/feeds').send(invalidFeed);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/feeds/:id', () => {
    it('should update an existing feed', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      const [feed] = await createRSSFeedFixture(repository);

      const updateFeed = {
        title: 'Updated Feed',
        url: feed.url,
        description: 'Une super description mis à jour',
        collectionId: 1,
      };

      const response = await request(app)
        .put(`/api/feeds/${feed.id}`)
        .send(updateFeed);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', feed.id);
      expect(response.body).toHaveProperty('title', 'Updated Feed');
      expect(response.body).toHaveProperty('url', feed.url);
      expect(response.body).toHaveProperty(
        'description',
        'Une super description mis à jour',
      );
    });

    it('should return 400 for validation errors', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      const [feed] = await createRSSFeedFixture(repository);

      const updateFeed = {
        title: 'Updated Feed',
        url: 'invalid-url',
        description: 'Une super description mis à jour',
        collectionId: 1,
      };

      const response = await request(app)
        .put(`/api/feeds/${feed.id}`)
        .send(updateFeed);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if feed to update is not found', async () => {
      await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
      await createRSSFeedFixture(repository);

      const updateFeed = {
        title: 'Updated Feed',
      };

      const response = await request(app)
        .put('/api/feeds/999')
        .send(updateFeed);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    describe('DELETE /feeds/:id', () => {
      it('should delete an existing feed', async () => {
        await createRSSFeedCollectionFixture(rssFeedCollectionRepository);
        const [feed] = await createRSSFeedFixture(repository);

        const response = await request(app).delete(`/api/feeds/${feed.id}`);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});

        const rssFeed = await repository.findOneBy({ id: feed.id });
        expect(rssFeed).toBeNull();
      });

      it('should return 404 if feed to delete is not found', async () => {
        const response = await request(app).delete('/api/feeds/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Resource not found');
      });

      it('should return 400 for invalid ID', async () => {
        const response = await request(app).delete('/api/feeds/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bad Request');
      });
    });
  });
});
