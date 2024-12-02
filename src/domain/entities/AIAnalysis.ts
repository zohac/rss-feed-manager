// src/domain/entities/AiAnalysis.ts

import { IEntity } from '../../application/interfaces/IEntity';

import { AIAgent } from './AIAgent';
import { Article } from './Article';

export class AIAnalysis implements IEntity {
  constructor(
    public id: number | undefined,
    public isRelevant: boolean, // Indique si l'article correspond aux critères de l'agent
    public analysisDate: Date,
    public article?: Article,
    public agent?: AIAgent,
  ) {}
}
