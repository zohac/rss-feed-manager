// tests/e2e/RSSFeedController.e2e.test.ts
import request from 'supertest';
import { Repository } from 'typeorm';

import app, { configureApp } from '../../src/app';
import { CreateAIAgentDTO } from '../../src/application/dtos/AIAgentDTO';
import {
  AIAgentProvider,
  AIAgentRole,
} from '../../src/domain/entities/AIAgent';
import { TestDataSource } from '../../src/infrastructure/database/testDataSource';
import { AIAgentEntity } from '../../src/infrastructure/entities/AIAgentEntity';
import { createAIAgentFixture } from '../fixtures/AIAgentFixtures';

describe('AIAgentController E2E Tests', () => {
  let repository: Repository<AIAgentEntity>;

  beforeAll(async () => {
    await configureApp();
    repository = TestDataSource.getRepository(AIAgentEntity);
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM ai_agent_entity');
  });

  describe('GET /api/agents', () => {
    it('should return all AI Agent', async () => {
      await createAIAgentFixture(repository);

      const response = await request(app).get('/api/agents');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'AI Agent 1');
      expect(response.body[1]).toHaveProperty('name', 'AI Agent 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app).get('/api/agents');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return a ai agent by ID', async () => {
      const [agent] = await createAIAgentFixture(repository);

      const response = await request(app).get(`/api/agents/${agent.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'AI Agent 1');
    });

    it('should return 404 if ai agent not found', async () => {
      const agents = [];
      agents.push(await createAIAgentFixture(repository));
      console.log(agents);
      const response = await request(app).get('/api/agents/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Agent non trouvé');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/agents/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
      expect(response.body).toHaveProperty('error', 'Invalid value');
    });
  });

  describe('POST /api/agents', () => {
    it('should create a new action', async () => {
      const aiAgentDTO: CreateAIAgentDTO = {
        name: 'New AI Agent',
        description: 'Un super Agent',
        provider: AIAgentProvider.OLLAMA,
        role: AIAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA 1.",
          stream: false,
          temperature: 0.7,
        },
      };

      const response = await request(app).post('/api/agents').send(aiAgentDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New AI Agent');

      // Vérifier dans la base de données
      const agent = await repository.findOneBy({ id: response.body.id });
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('New AI Agent');
    });

    it('should return 400 for validation errors', async () => {
      const invalidAgent = {
        name: '',
        description: '',
        provider: 'invalid provider',
        role: 'invalide role',
        configuration: {
          model: '',
          prompt: '',
          stream: false,
        },
      };

      const response = await request(app)
        .post('/api/agents')
        .send(invalidAgent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should update an existing ai agent', async () => {
      const [agent] = await createAIAgentFixture(repository);

      const updateAgent = {
        name: 'Updated AI Agent',
        description: 'Un super Agent',
        provider: AIAgentProvider.OLLAMA,
        role: AIAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA 1.",
          stream: false,
        },
      };

      const response = await request(app)
        .put(`/api/agents/${agent.id}`)
        .send(updateAgent);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', agent.id);
      expect(response.body).toHaveProperty('name', 'Updated AI Agent');
    });

    it('should return 400 for validation errors', async () => {
      const [agent] = await createAIAgentFixture(repository);

      const updateAgent = {
        name: '',
        description: '',
        provider: 'invalid provider',
        role: 'invalide role',
        configuration: {
          model: '',
          prompt: '',
          stream: false,
        },
      };

      const response = await request(app)
        .put(`/api/agents/${agent.id}`)
        .send(updateAgent);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 if ai agent to update is not found', async () => {
      await createAIAgentFixture(repository);

      const updateAction = {
        name: 'Updated AI Agent',
        description: 'Un super Agent',
        provider: AIAgentProvider.OLLAMA,
        role: AIAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA 1.",
          stream: false,
        },
      };

      const response = await request(app)
        .put('/api/agents/999')
        .send(updateAction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });
  });

  describe('DELETE /agents/:id', () => {
    it('should delete an existing ai agent', async () => {
      const [agent] = await createAIAgentFixture(repository);

      const response = await request(app).delete(`/api/agents/${agent.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const rssFeed = await repository.findOneBy({ id: agent.id });
      expect(rssFeed).toBeNull();
    });

    it('should return 404 if ai agent to delete is not found', async () => {
      const response = await request(app).delete('/api/agents/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/api/agents/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Bad Request');
    });
  });
});
