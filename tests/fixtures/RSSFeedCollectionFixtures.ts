import { Repository } from 'typeorm';

import { RSSFeedCollectionEntity } from '../../src/infrastructure/entities/RSSFeedCollectionEntity';

export const createRSSFeedCollectionFixture = async (
  repository: Repository<RSSFeedCollectionEntity>,
) => {
  const rssFeedCollection = [
    { name: 'Collection 1' },
    { name: 'Collection 2', description: 'Une collection de flux rss' },
  ];
  return await repository.save(
    rssFeedCollection.map((data) => repository.create(data)),
  );
};
