// src/domain/interfaces/IAIServiceFactory.ts

import { AIAgentProvider } from '../entities/AIAgent';

import { IAIService } from './IAIService';

export interface IAIServiceFactory {
  create(provider: AIAgentProvider): IAIService;
}
