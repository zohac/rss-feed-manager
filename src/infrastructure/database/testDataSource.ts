// src/infrastructure/database/testDataSource.ts
import { DataSource } from 'typeorm';

import { config } from '../config/config';

const database = config.database();

export const TestDataSource = new DataSource({
  type: database.type,
  database: database.database, // Utilise ':memory:' si TEST est true
  dropSchema: true,
  entities: database.entities,
  synchronize: database.synchronize,
  logging: database.logging,
});
