// /src/domain/interfaces/IAIAnalyseRepository.ts

import { AIAnalysis } from '../entities/AIAnalysis';

import { IRepository } from './IRepository';

export interface IAIAnalysisRepository extends IRepository<AIAnalysis> {
  getAnalysisWithoutActionExecuted(): Promise<AIAnalysis[]>;
}
