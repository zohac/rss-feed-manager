// src/infrastructure/mappers/ActionMapper.ts

import { NotFoundException } from '../../application/exception/NotFoundException';
import { Action, ActionType } from '../../domain/entities/Action';
import { AssignToCollectionAction } from '../../domain/entities/AssignToCollectionAction';
import { ActionEntity } from '../entities/ActionEntity';
import { AssignToCollectionActionEntity } from '../entities/AssignToCollectionActionEntity';

import { ArticleCollectionMapper } from './ArticleCollectionMapper';

export class ActionMapper {
  static toDomain(entity: ActionEntity): Action {
    switch (entity.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignEntity = entity as AssignToCollectionActionEntity;

        const assignToCollectionAction = new AssignToCollectionAction(
          assignEntity.id,
          assignEntity.name,
          ActionType.ASSIGN_TO_COLLECTION,
          {
            collection: undefined,
          },
        );

        if (assignEntity.collection) {
          assignToCollectionAction.parameter.collection =
            ArticleCollectionMapper.toDomain(assignEntity.collection);
        }

        return assignToCollectionAction;
      }

      default:
        throw new NotFoundException(`Type d'action inconnu : ${entity.type}`);
    }
  }

  // Méthode pour convertir du domaine vers l'entité
  static toEntity(action: Action): ActionEntity {
    switch (action.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignAction = action as AssignToCollectionAction;
        const assignEntity = new AssignToCollectionActionEntity();

        if (undefined !== assignAction.id) assignEntity.id = assignAction.id;
        assignEntity.name = assignAction.name;
        assignEntity.type = assignAction.type;

        if (undefined !== assignAction.parameter.collection) {
          assignEntity.collection = ArticleCollectionMapper.toEntity(
            assignAction.parameter.collection,
          );
        }

        return assignEntity;
      }

      default:
        throw new NotFoundException(`Type d'action inconnu : ${action.type}`);
    }
  }
}
