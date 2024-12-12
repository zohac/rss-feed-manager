// src/index.ts
import app, { configureApp } from './app';
import { config } from './infrastructure/config/config';
import logger from './infrastructure/logger/logger';

const startServer = async () => {
  await configureApp();

  const PORT = config.server.port ?? 3000;
  app.listen(PORT, () => {
    logger.info(
      `Serveur démarré sur http://${config.server.hostname}:${config.server.port}`,
    );
  });
};

startServer();
