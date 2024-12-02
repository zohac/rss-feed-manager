// src/infrastructure/mappers/AIConfigurationMapper.ts

import { AIConfiguration } from '../../domain/entities/AIConfiguration';
import { AIConfigurationEntity } from '../entities/AIConfigurationEntity';

export class AIConfigurationMapper {
  static toDomain(entity: AIConfigurationEntity): AIConfiguration {
    return new AIConfiguration(
      entity.id,
      entity.model,
      entity.prompt,
      entity.stream,
      entity.temperature,
    );
  }

  static toEntity(domain: AIConfiguration): AIConfigurationEntity {
    const entity = new AIConfigurationEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.model = domain.model;
    entity.prompt = domain.prompt;
    entity.stream = domain.stream;
    entity.temperature = domain.temperature;

    return entity;
  }
}
