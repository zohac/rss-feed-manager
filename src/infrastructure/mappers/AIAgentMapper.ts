// src/infrastructure/mappers/AIAgentMapper.ts

import {
  AIAgent,
  AIAgentProvider,
  AIAgentRole,
} from '../../domain/entities/AIAgent';
import { AIAgentEntity } from '../entities/AIAgentEntity';

import { AIConfigurationMapper } from './AIConfigurationMapper';

export class AIAgentMapper {
  static toDomain(entity: AIAgentEntity): AIAgent {
    return new AIAgent(
      entity.id,
      entity.name,
      entity.description,
      entity.provider as AIAgentProvider,
      entity.role as AIAgentRole,
      AIConfigurationMapper.toDomain(entity.configuration),
    );
  }

  static toEntity(domain: AIAgent): AIAgentEntity {
    const entity = new AIAgentEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.provider = domain.provider;
    entity.role = domain.role;
    entity.configuration = AIConfigurationMapper.toEntity(domain.configuration);

    return entity;
  }
}
