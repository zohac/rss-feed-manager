// src/presentation/factories/ActionDTOFactory.ts

import { plainToInstance } from 'class-transformer';

import {
  CreateActionDTO,
  UpdateActionDTO,
} from '../../application/dtos/ActionDTO';
import {
  CreateAssignToCollectionActionDTO,
  UpdateAssignToCollectionActionDTO,
} from '../../application/dtos/AssignToCollectionActionDTO';
import { ActionType } from '../../domain/entities/Action';

// On importe les DTO depuis la couche application

export class ActionDTOFactory {
  /**
   * Cette méthode reçoit le body brut d'une requête HTTP.
   * En fonction de 'body.type', elle instancie et renvoie
   * la classe DTO correspondante.
   */
  static create(body: any): CreateActionDTO {
    switch (body.type) {
      case ActionType.ASSIGN_TO_COLLECTION:
        return plainToInstance(CreateAssignToCollectionActionDTO, body);

      default:
        throw new Error(`Type d'action inconnu : ${body.type}`);
    }
  }

  /**
   * Cette méthode reçoit le body brut d'une requête HTTP.
   * En fonction de 'body.type', elle instancie et renvoie
   * la classe DTO correspondante.
   */
  static update(body: any): UpdateActionDTO {
    switch (body.type) {
      case ActionType.ASSIGN_TO_COLLECTION:
        return plainToInstance(UpdateAssignToCollectionActionDTO, body);

      default:
        throw new Error(`Type d'action inconnu : ${body.type}`);
    }
  }
}
