import { Repository } from 'typeorm';

import { ArticleCollectionEntity } from '../../src/infrastructure/entities/ArticleCollectionEntity';

export const createArticleCollectionsFixture = async (
  repository: Repository<ArticleCollectionEntity>,
) => {
  const collections = [
    { name: 'Tech Articles', description: 'Technology-related articles' },
    { name: 'Sports Articles', description: 'Articles about sports' },
  ];
  return await repository.save(
    collections.map((data) => repository.create(data)),
  );
};
