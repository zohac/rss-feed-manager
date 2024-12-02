// src/infrastructure/factories/AIServiceFactory.ts

import { IAIService } from '../../application/interfaces/IAIService';
import { IAIServiceFactory } from '../../application/interfaces/IServiceFactory';
import { AIAgentProvider } from '../../domain/entities/AIAgent';
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
