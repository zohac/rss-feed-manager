// src/services/CronService.ts
import cron from 'node-cron';

import { AIAnalysisUseCase } from '../../application/usecases/AIAnalysisUseCase';
import { ArticleUseCases } from '../../application/usecases/ArticleUseCases';
import { ParseFeedUseCase } from '../../application/usecases/ParseFeedUseCase';
import { RSSFeedUseCases } from '../../application/usecases/RSSFeedUseCases';
import logger from '../logger/logger';

export class CronService {
  private readonly rssFeedUseCases: RSSFeedUseCases;
  private readonly parseFeedUseCase: ParseFeedUseCase;
  private readonly articlesUseCase: ArticleUseCases;
  private readonly analysisUseCase: AIAnalysisUseCase;

  constructor(
    rssFeedUseCases: RSSFeedUseCases,
    parseFeedUseCase: ParseFeedUseCase,
    articlesUseCase: ArticleUseCases,
    analysisUseCase: AIAnalysisUseCase,
  ) {
    this.rssFeedUseCases = rssFeedUseCases;
    this.parseFeedUseCase = parseFeedUseCase;
    this.articlesUseCase = articlesUseCase;
    this.analysisUseCase = analysisUseCase;
  }

  start() {
    // Tâche toutes les 15 minutes pour récupérer les nouveaux articles
    cron.schedule('*/15 * * * *', async () => {
      logger.info(
        'Démarrage de la tâche planifiée pour récupérer les nouveaux articles.',
      );
      try {
        const feeds = await this.rssFeedUseCases.getAll();
        for (const feed of feeds) {
          await this.parseFeedUseCase.execute(feed);
        }
        logger.info('Nouveaux articles récupérés avec succès.');
      } catch (error) {
        logger.error(
          "Erreur lors de l'exécution de la tâche planifiée:",
          error,
        );
      }
    });

    // Tâche quotidienne pour supprimer les anciens articles
    cron.schedule('0 2 * * *', async () => {
      const olderThan = new Date();
      olderThan.setMonth(olderThan.getMonth() - 1);

      logger.info(
        'Exécution de la tâche CRON pour supprimer les anciens articles...',
      );

      try {
        await this.articlesUseCase.deleteOldRSSArticles(olderThan);
        logger.info('Anciens articles supprimés avec succès.');
      } catch (error) {
        logger.error(
          'Erreur lors de la suppression des anciens articles:',
          error,
        );
      }
    });

    // Nouvelle tâche pour analyser les articles avec les agents IA
    cron.schedule('*/60 * * * *', async () => {
      logger.info(
        'Démarrage de la tâche planifiée pour analyser les articles avec les agents IA.',
      );
      try {
        await this.analysisUseCase.analysisAll();
        logger.info(
          'Analyse de la tâche planifiée pour tous des articles par tous les agents IA terminée.',
        );
      } catch (error) {
        logger.error(
          "Erreur lors de l'analyse des articles avec les agents IA:",
          error,
        );
      }
    });
  }
}
