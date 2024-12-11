// src/infrastructure/factories/AIServiceFactory.ts

import { AIAgentProvider } from '../../domain/entities/AIAgent';
import { IAIService } from '../../domain/interfaces/IAIService';
import { IAIServiceFactory } from '../../domain/interfaces/IServiceFactory';
import { config } from '../config/config';
import { OllamaService } from '../integrations/OllamaService';

export class AIServiceFactory implements IAIServiceFactory {
  create(provider: AIAgentProvider): IAIService {
    switch (provider) {
      case 'ollama':
        return new OllamaService(config.ollama.baseUrl);
      // Ajoutez d'autres cas pour d'autres fournisseurs
      default:
        throw new Error(`Fournisseur IA non supporté: ${provider}`);
    }
  }
}
