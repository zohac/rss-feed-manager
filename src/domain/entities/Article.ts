// src/domain/entities/Article.ts
import { IEntity } from '../interfaces/IEntity';

import { AIAnalysis } from './AIAnalysis';
import { ArticleCollection } from './ArticleCollection';
import { RSSFeed } from './RSSFeed';

export enum ArticleSourceType {
  MANUAL = 'manual',
  RSS = 'rss',
}

export class Article implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public publicationDate: Date,
    public isRead: boolean,
    public isFavorite: boolean,
    public isArchived: boolean,
    public isSaved: boolean,
    public feed: RSSFeed | undefined,
    public sourceType: ArticleSourceType,
    public analysis?: AIAnalysis[],
    public link?: string,
    public description?: string,
    public content?: string,
    public tag?: string[],
    public collection?: ArticleCollection | null,
  ) {}
}
