// src/domain/interfaces/IBaseCollection.ts
import { IEntity } from '../../application/interfaces/IEntity';

export interface IBaseCollection extends IEntity {
  id: number | undefined;
  name: string;
  description?: string;
}
