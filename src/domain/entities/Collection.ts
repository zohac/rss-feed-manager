// src/entities/Collection.ts
import { IEntity } from '../../application/interfaces/IEntity';

import { RSSFeed } from './RSSFeed';

export class Collection implements IEntity {
  constructor(
    public id: number | undefined,
    public name: string,
    public description?: string,
    public feeds?: RSSFeed[],
  ) {}
}
