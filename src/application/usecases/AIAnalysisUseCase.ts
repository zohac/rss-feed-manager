import { AIAgent, AIAgentRole } from '../../domain/entities/AIAgent';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { Article } from '../../domain/entities/Article';
import logger from '../../infrastructure/logger/logger';
import { AIAgentRepository } from '../../infrastructure/repositories/AIAgentRepository';
import { AIAnalysisRepository } from '../../infrastructure/repositories/AIAnalysisRepository';
import { ArticleRepository } from '../../infrastructure/repositories/ArticleRepository';
import { IAIServiceFactory } from '../interfaces/IServiceFactory';

export class AIAnalysisUseCase {
  constructor(
    private readonly aiServiceFactory: IAIServiceFactory,
    private readonly aiAnalysisRepository: AIAnalysisRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly agentRepository: AIAgentRepository,
  ) {}

  async analysisOneArticleWithAgent(
    agentId: number,
    articleId: number,
  ): Promise<AIAnalysis> {
    const article = await this.articleRepository.getOneById(articleId);
    const agent = await this.agentRepository.getOneById(agentId);
    if (!article || !agent) {
      const errorMessage = "Une erreur est survenu lors de l'analyse.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info("Début de l'analyse d'un article.");
    const analysis = await this.analysis(agent, article);
    logger.info("Fin  de l'analyse d'un article.");

    return await this.create(analysis);
  }

  async analysisAllByOneAgent(agentId: number): Promise<AIAnalysis[]> {
    const agent = await this.agentRepository.getOneById(agentId);
    if (!agent) {
      const errorMessage = `Une erreur est survenu lors de la récupération de l'agent pour l'analyse. AgentID : ${agentId}.`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info(
      `Début de l'analyse de tous les articles par l'agent : ${agent.name}.`,
    );
    const analysis: AIAnalysis[] = [];
    if (undefined !== agent.id) {
      const articles =
        await this.articleRepository.getUnanalyzedArticlesByAgent(agent.id);

      if (articles.length === 0)
        logger.info(
          `Aucun nouvel article a analyser pour l'agent : ${agent.name}.`,
        );

      for (const article of articles) {
        const analyze = await this.analysis(agent, article);
        const result = await this.create(analyze);
        analysis.push(result);
      }
    }
    logger.info(`Fin  de l'analyse des articles par l'agent : ${agent.name}.`);

    return analysis;
  }

  async analysisAll(): Promise<AIAnalysis[]> {
    const agents = await this.agentRepository.getAll();
    let results: AIAnalysis[] = [];
    for (const agent of agents) {
      if (undefined !== agent.id) {
        results = await this.analysisAllByOneAgent(agent.id);
      }
    }

    return results;
  }

  async analysis(agent: AIAgent, article: Article): Promise<AIAnalysis> {
    const aiService = this.aiServiceFactory.create(agent.provider);

    if (agent.role === AIAgentRole.ANALYSIS && aiService.analyzeArticle) {
      const analysis = await aiService.analyzeArticle(agent, article);
      logger.info(
        `Article "${article.title}" analysé par l'agent "${agent.name}" avec le fournisseur "${agent.provider}".`,
      );

      return analysis;
    }

    const errorMessage = "Une erreur est survenu lors de l'analyse.";
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  getAll(): Promise<AIAnalysis[]> {
    return this.aiAnalysisRepository.getAll();
  }

  getOneById(id: number): Promise<AIAnalysis | null> {
    return this.aiAnalysisRepository.getOneById(id);
  }

  async create(analysis: AIAnalysis): Promise<AIAnalysis> {
    return await this.aiAnalysisRepository.create(analysis);
  }

  // update(data: any): Promise<AIAnalysis> {
  //   return Promise.resolve(undefined);
  // }
  //
  // delete(id: number): Promise<void> {
  //   return Promise.resolve(undefined);
  // }
}