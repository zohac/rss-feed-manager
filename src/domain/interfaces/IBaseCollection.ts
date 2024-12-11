// src/domain/interfaces/IBaseCollection.ts

import { IEntity } from './IEntity';

export interface IBaseCollection extends IEntity {
  id: number | undefined;
  name: string;
  description?: string;
}
