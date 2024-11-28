// /src/application/interfaces/IUseCase.ts

export interface IUseCase<T, U, V> {
  getOneById(id: number): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(data: U): Promise<T>;
  update(data: V): Promise<T>;
  delete(id: number): Promise<void>;
}
