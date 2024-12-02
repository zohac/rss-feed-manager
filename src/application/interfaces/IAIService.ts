// src/application/interfaces/IAIService.ts

import { AIAgent } from '../../domain/entities/AIAgent';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { Article } from '../../domain/entities/Article';

export interface IAIService {
  analyzeArticle(agent: AIAgent, article: Article): Promise<AIAnalysis>;
  generateContent(agent: AIAgent, article: Article): Promise<string>;
}
