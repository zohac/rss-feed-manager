// src/domain/entities/RSSFeed.ts
import { IEntity } from '../../application/interfaces/IEntity';

import { Collection } from './Collection';

export class RSSFeed implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public url: string,
    public description?: string,
    public collection?: Collection,
  ) {}
}
