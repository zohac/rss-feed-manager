// jest.setup.ts
import { TestDataSource } from './src/infrastructure/database/testDataSource';

beforeAll(async () => {
  await TestDataSource.initialize();
});

afterAll(async () => {
  await TestDataSource.destroy();
});
