// src/infrastructure/mappers/AIAgentMapper.ts

import { Action } from '../../domain/entities/Action';
import {
  AIAgent,
  AIAgentProvider,
  AIAgentRole,
} from '../../domain/entities/AIAgent';
import { ActionEntity } from '../entities/ActionEntity';
import { AIAgentEntity } from '../entities/AIAgentEntity';

import { ActionMapper } from './ActionMapper';
import { AIConfigurationMapper } from './AIConfigurationMapper';

export class AIAgentMapper {
  static toDomain(entity: AIAgentEntity): AIAgent {
    const actions: Action[] = [];
    if (undefined !== entity.actions && entity.actions.length > 0) {
      for (const action of entity.actions) {
        actions.push(ActionMapper.toDomain(action));
      }
    }

    return new AIAgent(
      entity.id,
      entity.name,
      entity.description,
      entity.provider as AIAgentProvider,
      entity.role as AIAgentRole,
      AIConfigurationMapper.toDomain(entity.configuration),
      actions,
    );
  }

  static toEntity(domain: AIAgent): AIAgentEntity {
    const actions: ActionEntity[] = [];
    if (undefined !== domain.actions) {
      for (const action of domain.actions) {
        actions.push(ActionMapper.toEntity(action));
      }
    }

    const entity = new AIAgentEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.provider = domain.provider;
    entity.role = domain.role;
    entity.configuration = AIConfigurationMapper.toEntity(domain.configuration);
    entity.actions = actions;

    return entity;
  }
}
