// src/entities/RSSFeed.ts
import { IEntity } from '../../application/interfaces/IEntity';

export class RSSFeed implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public url: string,
    public description?: string,
  ) {}
}
