// src/application/interfaces/IAIServiceFactory.ts

import { AIAgentProvider } from '../../domain/entities/AIAgent';

import { IAIService } from './IAIService';

export interface IAIServiceFactory {
  create(provider: AIAgentProvider): IAIService;
}
