// src/domain/interfaces/IAIService.ts

import { AIAgent } from '../entities/AIAgent';
import { AIAnalysis } from '../entities/AIAnalysis';
import { Article } from '../entities/Article';

export interface IAIService {
  analyzeArticle(agent: AIAgent, article: Article): Promise<AIAnalysis>;
  generateContent(agent: AIAgent, article: Article): Promise<string>;
}
