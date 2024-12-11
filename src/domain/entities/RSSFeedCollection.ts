// src/domain/entities/RssFeedCollection.ts
import { IBaseCollection } from '../interfaces/IBaseCollection';

import { RSSFeed } from './RSSFeed';

export class RSSFeedCollection implements IBaseCollection {
  constructor(
    public id: number | undefined,
    public name: string,
    public description?: string,
    public feeds?: RSSFeed[],
  ) {}
}
