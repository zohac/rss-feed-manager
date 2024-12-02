// src/infrastructure/integrations/OllamaService.ts

import { IAIService } from '../../application/interfaces/IAIService';
import { AIAgent } from '../../domain/entities/AIAgent';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { Article } from '../../domain/entities/Article';
import { StringUtils } from '../../utils/stringUtils';
import logger from '../logger/logger';

export class OllamaService implements IAIService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async analyzeArticle(agent: AIAgent, article: Article): Promise<AIAnalysis> {
    try {
      const prompt = StringUtils.replacePlaceholders(
        agent.configuration.prompt,
        {
          title: article.title ?? '',
          description: article.description ?? '',
        },
      );

      const body = JSON.stringify({
        model: agent.configuration.model,
        prompt: prompt,
        stream: agent.configuration.stream ?? false,
        options: {
          temperature: agent.configuration.temperature ?? 0.7,
        },
      });

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        logger.error(`Ollama responded with status ${response.status}`);
        throw new Error(`Ollama responded with status ${response.status}`);
      }

      const data = await response.json();
      const result = data.response.toLowerCase().trim();

      let isRelevant: boolean = false;
      if (result === 'true') {
        isRelevant = true;
      }
      // Créez et retournez une instance de AiAnalysis
      return new AIAnalysis(undefined, isRelevant, new Date(), article, agent);
    } catch (error) {
      logger.error(
        `Erreur lors de l'appel à Ollama pour l'agent "${agent.name}":`,
        error,
      );
      throw error;
    }
  }

  async generateContent(agent: AIAgent, article: Article): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          // ...
        },
        body: JSON.stringify({
          model: agent.configuration.model || 'text-davinci-003',
          prompt: agent.configuration.prompt.replace(
            '{text}',
            article.description ?? '',
          ),
          max_tokens: 500,
        }),
      });

      // Traitement du résultat pour extraire le contenu généré
      const result = await response.json();
      return result.choices[0].text;
    } catch (error) {
      logger.error(
        `Erreur lors de la génération de contenu avec ChatGPT pour l'agent "${agent.name}":`,
        error,
      );
      throw error;
    }
  }
}
