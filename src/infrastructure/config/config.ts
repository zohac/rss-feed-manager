// src/infrastructure/config/config.ts
import path from 'path';

import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environnements
export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PRODUCTION = process.env.NODE_ENV === 'production';

// Configuration du serveur
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

// Configuration de la base de données
export const DATABASE = {
  type: 'sqlite' as const,
  database: process.env.DATABASE_NAME ?? './rssfeeds.sqlite',
  synchronize: true, // Mettre à false en production
  logging: DEVELOPMENT, // Activer le logging en développement
  entities: [path.resolve(__dirname, '../entities/*.ts')],
};

// Exporter toutes les configurations nécessaires
export const config = {
  environment: {
    DEVELOPMENT,
    TEST,
    PRODUCTION,
  },
  server: {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
  },
  database: DATABASE,
  logger: {
    level: 'debug',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  },
};
