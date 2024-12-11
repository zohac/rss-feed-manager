// src/domain/entities/AssignToCollectionAction.ts

import { ActionType, IBaseAction } from './Action';
import { ArticleCollection } from './ArticleCollection';

export class AssignToCollectionAction implements IBaseAction {
  constructor(
    public id: number | undefined,
    public name: string,
    public type: ActionType.ASSIGN_TO_COLLECTION,
    public parameter: {
      collection: ArticleCollection | undefined;
    },
  ) {}
}
