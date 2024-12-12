// src/infrastructure/repositories/ActionRepository.ts

import { Repository } from 'typeorm';

import { Action } from '../../domain/entities/Action';
import { IRepository } from '../../domain/interfaces/IRepository';
import { ActionEntity } from '../entities/ActionEntity';
import logger from '../logger/logger';
import { ActionMapper } from '../mappers/ActionMapper';

export class ActionRepository implements IRepository<Action> {

  constructor(private readonly repository: Repository<ActionEntity>) {}

  async getAll(): Promise<Action[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ActionMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<Action | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    return ActionMapper.toDomain(entity);
  }

  async create(domain: Action): Promise<Action> {
    const actionEntity = ActionMapper.toEntity(domain);
    const entity = this.repository.create(actionEntity);
    const result = await this.repository.save(entity);

    return ActionMapper.toDomain(result);
  }

  async update(domain: Action): Promise<Action> {
    if (!domain.id) {
      const errorMessage =
        "Une erreur est survenu lors de la mise à jour à jour de l'action";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    const actionEntity = ActionMapper.toEntity(domain);
    await this.repository.update(actionEntity.id, actionEntity);
    const entity = await this.getOneById(domain.id);
    if (!entity) {
      const errorMessage = "Erreur lor de la mise à jour de l'action";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return entity;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
