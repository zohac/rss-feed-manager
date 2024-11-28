// src/services/CronService.ts
import cron from 'node-cron';

import { RSSFeedUseCases } from '../../application/usecases/RSSFeedUseCases';
import logger from '../logger/logger';

export class CronService {
  private readonly rssFeedUseCases: RSSFeedUseCases;

  constructor(
    rssFeedUseCases: RSSFeedUseCases,
  ) {
    this.rssFeedUseCases = rssFeedUseCases;
  }

  start() {
    // // Tâche toutes les 15 minutes pour récupérer les nouveaux articles
    // cron.schedule('*/15 * * * *', async () => {
    //   logger.info(
    //     'Démarrage de la tâche planifiée pour récupérer les nouveaux articles.',
    //   );
    //   try {
    //     const feeds = await this.rssFeedUseCases.getAll();
    //     for (const feed of feeds) {
    //       await this.rssFeedUseCases.parseFeed(feed);
    //     }
    //     logger.info('Nouveaux articles récupérés avec succès.');
    //   } catch (error) {
    //     logger.error(
    //       "Erreur lors de l'exécution de la tâche planifiée:",
    //       error,
    //     );
    //   }
    // });
  }
}
