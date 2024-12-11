// src/index.ts
import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { ActionExecutor } from './application/executor/ActionExecutor';
import { ActionUseCases } from './application/usecases/ActionUseCases';
import { AIAgentUseCases } from './application/usecases/AIAgentUseCases';
import { AIAnalysisUseCase } from './application/usecases/AIAnalysisUseCase';
import { ArticleCollectionUseCases } from './application/usecases/ArticleCollectionUseCases';
import { ArticleUseCases } from './application/usecases/ArticleUseCases';
import { ParseFeedUseCase } from './application/usecases/ParseFeedUseCase';
import { RSSFeedCollectionUseCases } from './application/usecases/RSSFeedCollectionUseCases';
import { RSSFeedUseCases } from './application/usecases/RSSFeedUseCases';
import { config } from './infrastructure/config/config';
import { AppDataSource } from './infrastructure/database/dataSource';
import { AIServiceFactory } from './infrastructure/factories/AIServiceFactory';
import logger from './infrastructure/logger/logger';
import { ActionRepository } from './infrastructure/repositories/ActionRepository';
import { AIAgentRepository } from './infrastructure/repositories/AIAgentRepository';
import { AIAnalysisRepository } from './infrastructure/repositories/AIAnalysisRepository';
import { ArticleCollectionRepository } from './infrastructure/repositories/ArticleCollectionRepository';
import { ArticleRepository } from './infrastructure/repositories/ArticleRepository';
import { RssFeedCollectionRepository } from './infrastructure/repositories/RssFeedCollectionRepository';
import { RSSFeedRepository } from './infrastructure/repositories/RSSFeedRepository';
import { CronService } from './infrastructure/services/CronService';
import { ActionController } from './presentation/controllers/ActionController';
import { AIAgentController } from './presentation/controllers/AIAgentController';
import { AIAnalysisController } from './presentation/controllers/AIAnalysisController';
import { ArticleCollectionController } from './presentation/controllers/ArticleCollectionController';
import { ArticleController } from './presentation/controllers/ArticleController';
import { RSSFeedCollectionController } from './presentation/controllers/RSSFeedCollectionController';
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
    const collectionRepository = new RssFeedCollectionRepository();
    const articleCollectionRepository = new ArticleCollectionRepository();
    const articleRepository = new ArticleRepository();
    const agentRepository = new AIAgentRepository();
    const analysisRepository = new AIAnalysisRepository();
    const actionRepository = new ActionRepository();

    // Instancier les Factory
    const aiServiceFactory = new AIServiceFactory();

    // Instancier les cas d'utilisation
    const parseFeedUseCase = new ParseFeedUseCase(articleRepository);
    const feedUseCases = new RSSFeedUseCases(
      feedRepository,
      collectionRepository,
      parseFeedUseCase,
    );
    const rssFeedCollectionUseCases = new RSSFeedCollectionUseCases(
      collectionRepository,
    );
    const articleCollectionUseCases = new ArticleCollectionUseCases(
      articleCollectionRepository,
    );
    const articleUseCases = new ArticleUseCases(
      articleRepository,
      articleCollectionRepository,
    );
    const agentUseCases = new AIAgentUseCases(
      agentRepository,
      articleRepository,
    );
    const analysisUseCases = new AIAnalysisUseCase(
      aiServiceFactory,
      analysisRepository,
      articleRepository,
      agentRepository,
    );

    const actionExecutor = new ActionExecutor(articleUseCases);
    const actionUseCases = new ActionUseCases(
      actionExecutor,
      actionRepository,
      analysisUseCases,
      articleCollectionRepository,
    );

    // Instancier les contrôleurs
    const feedController = new RSSFeedController(feedUseCases);
    const rssFeedCollectionController = new RSSFeedCollectionController(
      rssFeedCollectionUseCases,
    );
    const articleCollectionController = new ArticleCollectionController(
      articleCollectionUseCases,
    );
    const articleController = new ArticleController(articleUseCases);
    const agentController = new AIAgentController(agentUseCases);
    const analysisController = new AIAnalysisController(analysisUseCases);
    const actionController = new ActionController(actionUseCases);

    // Créer et utiliser les routes
    const router = createRouter(
      feedController,
      rssFeedCollectionController,
      articleCollectionController,
      articleController,
      agentController,
      analysisController,
      actionController,
    );
    app.use('/api', router);

    // Démarrer le service CRON
    const cronService = new CronService(
      feedUseCases,
      parseFeedUseCase,
      articleUseCases,
      analysisUseCases,
      actionUseCases,
    );
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
