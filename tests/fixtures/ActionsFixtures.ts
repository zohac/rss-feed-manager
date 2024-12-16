import { Repository } from 'typeorm';

import { ActionType } from '../../src/domain/entities/Action';
import { ActionEntity } from '../../src/infrastructure/entities/ActionEntity';

export const createActionsFixture = async (
  repository: Repository<ActionEntity>,
) => {
  const actions = [
    {
      id: undefined,
      name: 'Action 1',
      type: ActionType.ASSIGN_TO_COLLECTION,
      collectionId: 1,
    },
    {
      id: undefined,
      name: 'Action 2',
      type: ActionType.ASSIGN_TO_COLLECTION,
      collectionId: 2,
    },
  ];
  return await repository.save(actions.map((data) => repository.create(data)));
};
