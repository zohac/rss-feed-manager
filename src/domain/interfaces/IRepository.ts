// /src/domain/interfaces/IRepository.ts

import { IEntity } from './IEntity';

export interface IRepository<T extends IEntity> {
  getOneById(id: number): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}
