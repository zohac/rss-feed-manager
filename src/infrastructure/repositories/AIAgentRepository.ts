// src/infrastructure/repositories/AgentAIRepository.ts

import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { AIAgent } from '../../domain/entities/AIAgent';
import { AppDataSource } from '../database/dataSource';
import { AIAgentEntity } from '../entities/AIAgentEntity';
import logger from '../logger/logger';
import { AIAgentMapper } from '../mappers/AIAgentMapper';

export class AIAgentRepository implements IRepository<AIAgent> {
  private readonly aiAgentRepository: Repository<AIAgentEntity>;

  constructor() {
    this.aiAgentRepository = AppDataSource.getRepository(AIAgentEntity);
  }

  async create(aiAgent: AIAgent): Promise<AIAgent> {
    const aiAgentEntity = AIAgentMapper.toEntity(aiAgent);
    const entity = this.aiAgentRepository.create(aiAgentEntity);
    const result = await this.aiAgentRepository.save(entity);

    return AIAgentMapper.toDomain(result);
  }

  async getAll(): Promise<AIAgent[]> {
    const entities = await this.aiAgentRepository.find();
    return entities.map((entity) => AIAgentMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<AIAgent | null> {
    const entity = await this.aiAgentRepository.findOneBy({ id });
    if (!entity) return null;

    return AIAgentMapper.toDomain(entity);
  }

  async update(aiAgent: AIAgent): Promise<AIAgent> {
    if (undefined === aiAgent.id) {
      const errorMessage = "Erreur lor de la mise à jour de l'agent IA.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const aiAgentEntity = AIAgentMapper.toEntity(aiAgent);
    const result = await this.aiAgentRepository.save(aiAgentEntity);

    return AIAgentMapper.toDomain(result);
  }

  async delete(id: number): Promise<void> {
    await this.aiAgentRepository.delete({ id });
  }
}
