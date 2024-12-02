// src/infrastructure/repositories/AiAnalysisRepository.ts

import { Repository } from 'typeorm';

import { IRepository } from '../../application/interfaces/IRepository';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { AppDataSource } from '../database/dataSource';
import { AIAnalysisEntity } from '../entities/AIAnalysisEntity';
import logger from '../logger/logger';
import { AIAnalysisMapper } from '../mappers/AIAnalysisMapper';

export class AIAnalysisRepository implements IRepository<AIAnalysis> {
  private readonly aiAnalysisRepository: Repository<AIAnalysisEntity>;

  constructor() {
    this.aiAnalysisRepository = AppDataSource.getRepository(AIAnalysisEntity);
  }

  async getAll(): Promise<AIAnalysis[]> {
    const entities = await this.aiAnalysisRepository.find();
    return entities.map((entity) => AIAnalysisMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<AIAnalysis | null> {
    const entity = await this.aiAnalysisRepository.findOneBy({ id });
    if (!entity) return null;

    return AIAnalysisMapper.toDomain(entity);
  }

  async create(analysis: AIAnalysis): Promise<AIAnalysis> {
    if (undefined === analysis.article) {
      const errorMessage = "Il n'y a pas d'article associé à cette analyse ia";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const aiAgentEntity = AIAnalysisMapper.toEntity(analysis);
    const entity = this.aiAnalysisRepository.create(aiAgentEntity);
    const result = await this.aiAnalysisRepository.save(entity);

    return AIAnalysisMapper.toDomain(result);
  }

  async update(aiAnalysis: AIAnalysis): Promise<AIAnalysis> {
    const analysisEntity = AIAnalysisMapper.toEntity(aiAnalysis);
    if (undefined === aiAnalysis.id) {
      const errorMessage = "Erreur lor de la mise à jour de l'analyse IA.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    await this.aiAnalysisRepository.update(analysisEntity.id, analysisEntity);

    return aiAnalysis;
  }

  async delete(id: number): Promise<void> {
    await this.aiAnalysisRepository.delete({ id });
  }
}
