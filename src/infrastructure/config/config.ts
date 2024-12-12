// src/infrastructure/config/config.ts
import path from 'path';

import dotenv from 'dotenv';

// Déterminer l'environnement actuel (default à 'development')
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Charger le fichier .env correspondant à l'environnement
const envFile = path.resolve(__dirname, `../../../.env.${NODE_ENV}`);
dotenv.config({ path: envFile });

// Environnements
export const DEVELOPMENT = NODE_ENV === 'development';
export const TEST = NODE_ENV === 'test';
export const PRODUCTION = NODE_ENV === 'production';

// Configuration du serveur
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost';
export const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

enum databaseType { SQLITE = 'sqlite' }

// Configuration de la base de données
export const DATABASE = () => {
  if ('sqlite' === process.env.DATABASE_TYPE) {
    return {
      type: process.env.DATABASE_TYPE as databaseType,
      database: (process.env.DATABASE_PATH ?? './rssfeeds.sqlite'),
      synchronize: TEST || DEVELOPMENT, // Toujours synchroniser en test
      logging: DEVELOPMENT && !TEST, // Activer le logging en développement mais pas en test
      entities: [path.resolve(__dirname, '../entities/*.ts')],
    }
  }

  throw new Error('Base de donnée inconnu pour la configuration, corriger vote fichier .env')
};

// Default AI Prompt
export const DEFAULT_ANALYSIS_PROMPT = `You are an AI content analyzer. Analyze the following article and respond with 'true' if it's about artificial intelligence, machine learning, or related technologies, and 'false' otherwise. Only respond with true or false. ### Title: {{title}} --- Content: {{description}} ### Only respond with true or false, it's very important.`;

// OLLAMA Configuration
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';

export const config = {
  environment: {
    development: DEVELOPMENT,
    test: TEST,
    production: PRODUCTION,
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
    baseUrl: OLLAMA_BASE_URL,
  },
  ai: {
    defaultAnalysisPrompt: DEFAULT_ANALYSIS_PROMPT,
  },
};
