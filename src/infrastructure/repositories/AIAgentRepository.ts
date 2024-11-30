// src/infrastructure/repositories/AgentAIRepository.ts

import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import {
  AIAgent,
  AIAgentProvider,
  AIAgentRole,
} from '../../domain/entities/AIAgent';
import { AIConfiguration } from '../../domain/entities/AIConfiguration';
import { AppDataSource } from '../database/dataSource';
import { AIAgentEntity } from '../entities/AIAgentEntity';
import { AIConfigurationEntity } from '../entities/AIConfigurationEntity';
import logger from '../logger/logger';

export class AIAgentRepository implements IRepository<AIAgent> {
  private readonly aiAgentRepository: Repository<AIAgentEntity>;

  constructor() {
    this.aiAgentRepository = AppDataSource.getRepository(AIAgentEntity);
  }

  async create(aiAgent: AIAgent): Promise<AIAgent> {
    const aiAgentEntity = this.hydrateAIAgentEntity(aiAgent);
    const entity = this.aiAgentRepository.create(aiAgentEntity);
    const result = await this.aiAgentRepository.save(entity);

    return this.createAIAgent(result);
  }

  async getAll(): Promise<AIAgent[]> {
    const entities = await this.aiAgentRepository.find();
    return entities.map((entity) => this.createAIAgent(entity));
  }

  async getOneById(id: number): Promise<AIAgent | null> {
    const entity = await this.aiAgentRepository.findOneBy({ id });
    if (!entity) return null;

    return this.createAIAgent(entity);
  }

  async update(aiAgent: AIAgent): Promise<AIAgent> {
    if (undefined === aiAgent.id) {
      const errorMessage = "Erreur lor de la mise à jour de l'agent IA.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    await this.aiAgentRepository.update(aiAgent.id, aiAgent);

    return aiAgent;
  }

  async delete(id: number): Promise<void> {
    await this.aiAgentRepository.delete({ id });
  }

  private createAIAgent(entity: AIAgentEntity): AIAgent {
    const configuration = new AIConfiguration(
      entity.configuration.id,
      entity.configuration.model,
      entity.configuration.prompt,
      entity.configuration.stream,
      entity.configuration.temperature,
    );

    return new AIAgent(
      entity.id,
      entity.name,
      entity.description,
      entity.provider as AIAgentProvider,
      entity.role as AIAgentRole,
      configuration,
    );
  }

  private hydrateAIAgentEntity(aiAgent: AIAgent): AIAgentEntity {
    const aiAgentEntity = new AIAgentEntity();

    const aiConfigurationEntity = new AIConfigurationEntity();
    if (undefined !== aiAgent.configuration.id)
      aiConfigurationEntity.id = aiAgent.configuration.id;
    aiConfigurationEntity.model = aiAgent.configuration.model;
    aiConfigurationEntity.prompt = aiAgent.configuration.prompt;
    aiConfigurationEntity.stream = aiAgent.configuration.stream;
    aiConfigurationEntity.temperature = aiAgent.configuration.temperature;

    if (undefined !== aiAgent.id) aiAgentEntity.id = aiAgent.id;
    aiAgentEntity.name = aiAgent.name;
    aiAgentEntity.description = aiAgent.description;
    aiAgentEntity.provider = aiAgent.provider;
    aiAgentEntity.role = aiAgent.role;
    if (undefined !== aiAgent.configuration)
      aiAgentEntity.configuration = aiConfigurationEntity;

    return aiAgentEntity;
  }
}
