// src/domain/entities/ArticleCollection.ts;
import { IBaseCollection } from '../interfaces/IBaseCollection';

import { Article } from './Article';

export class ArticleCollection implements IBaseCollection {
  constructor(
    public id: number | undefined,
    public name: string,
    public description?: string,
    public articles?: Article[],
  ) {}
}
