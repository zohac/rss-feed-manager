// src/index.ts
import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { CollectionUseCases } from './application/usecases/CollectionUseCases';
import { RSSFeedUseCases } from './application/usecases/RSSFeedUseCases';
import { config } from './infrastructure/config/config';
import { AppDataSource } from './infrastructure/database/dataSource';
import logger from './infrastructure/logger/logger';
import { CollectionRepository } from './infrastructure/repositories/CollectionRepository';
import { RSSFeedRepository } from './infrastructure/repositories/RSSFeedRepository';
import { CronService } from './infrastructure/services/CronService';
import { CollectionController } from './presentation/controllers/CollectionController';
import { RSSFeedController } from './presentation/controllers/RSSFeedController';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { routeNotFound } from './presentation/middlewares/routeNotFound';
import { createRouter } from './presentation/routes';
import swaggerDocument from './swagger.json';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin:
      config.server.hostname === 'localhost'
        ? `http://localhost:3001`
        : config.server.hostname,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// Intégrer Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Fonction pour démarrer le serveur après l'initialisation de la base de données
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Connexion à la base de données établie avec succès.');

    // Instancier les dépôts après l'initialisation de DataSource
    const feedRepository = new RSSFeedRepository();
    const collectionRepository = new CollectionRepository();

    // Instancier les cas d'utilisation
    const feedUseCases = new RSSFeedUseCases(
      feedRepository,
      collectionRepository,
    );
    const collectionUseCases = new CollectionUseCases(collectionRepository);

    // Instancier les contrôleurs
    const feedController = new RSSFeedController(feedUseCases);
    const collectionController = new CollectionController(collectionUseCases);

    // Créer et utiliser les routes
    const router = createRouter(feedController, collectionController);
    app.use('/api', router);

    // Démarrer le service CRON
    const cronService = new CronService(feedUseCases);
    cronService.start();
    logger.info('CRON démarré');
    // Utiliser le middleware de gestion des erreurs
    app.use(errorHandler);
    app.use(routeNotFound);

    const PORT = config.server.port ?? 3000;
    app.listen(PORT, () => {
      logger.info(
        `Serveur démarré sur http://${config.server.hostname}:${config.server.port}`,
      );
    });
  } catch (err) {
    logger.error(
      "Erreur lors de l'initialisation de la source de données :",
      err,
    );
    process.exit(1); // Arrêter l'application en cas d'erreur de connexion
  }
};

startServer();
