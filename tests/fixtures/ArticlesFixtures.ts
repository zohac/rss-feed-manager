import { Repository } from 'typeorm';

import { Article, ArticleSourceType } from '../../src/domain/entities/Article';
import { ArticleEntity } from '../../src/infrastructure/entities/ArticleEntity';
import { ArticleMapper } from '../../src/infrastructure/mappers/ArticleMapper';

export const createArticlesFixtures = async (
  repository: Repository<ArticleEntity>,
) => {
  const articlesEntities: ArticleEntity[] = [];
  const articles: Article[] = [
    {
      id: undefined,
      title: "Titre de l'article 1",
      link: 'http://fake.article.com/1',
      description: "Une description pour l'article 1.",
      content: "Un contenu plus long pour l'article 1.",
      publicationDate: new Date(),
      isRead: false,
      isFavorite: false,
      isArchived: false,
      isSaved: false,
      sourceType: ArticleSourceType.MANUAL,
      feed: undefined,
    },
    {
      id: undefined,
      title: "Titre de l'article 2",
      link: 'http://fake.article.com/2',
      description: "Une description pour l'article 2.",
      content: "Un contenu plus long pour l'article 2.",
      publicationDate: new Date(),
      isRead: false,
      isFavorite: false,
      isArchived: false,
      isSaved: false,
      sourceType: ArticleSourceType.MANUAL,
      feed: undefined,
    },
  ];

  for (const article of articles) {
    articlesEntities.push(ArticleMapper.toEntity(article));
  }

  return await repository.save(
    articlesEntities.map((data) => repository.create(data)),
  );
};
