// src/infrastructure/database/datasource.ts

import { DataSource } from 'typeorm';

import { config } from '../config/config';

const database = config.database;

export const AppDataSource = new DataSource({
  type: database.type,
  database: database.database,
  entities: database.entities,
  synchronize: database.synchronize,
});
