// src/domain/entities/Action.ts

import { IEntity } from '../interfaces/IEntity';

import { AssignToCollectionAction } from './AssignToCollectionAction';

export enum ActionType {
  ASSIGN_TO_COLLECTION = 'ASSIGN_TO_COLLECTION',
}

export interface IBaseAction extends IEntity {
  id: number | undefined;
  name: string;
  type: ActionType;
}

export type Action = AssignToCollectionAction;
