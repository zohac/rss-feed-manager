// src/domain/entities/AIAgent.ts

import { IEntity } from '../../application/interfaces/IEntity';

import { AIConfiguration } from './AIConfiguration';

export enum AIAgentRole {
  ANALYSIS = 'analysis',
  EDITORIAL = 'editorial',
}

export enum AIAgentProvider {
  OLLAMA = 'ollama',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
}

export class AIAgent implements IEntity {
  constructor(
    public id: number | undefined,
    public name: string,
    public description: string,
    public provider: AIAgentProvider, // Type de fournisseur IA
    public role: AIAgentRole, // Rôle de l'agent
    public configuration: AIConfiguration, // Configuration spécifique (prompt, paramètres)
  ) {}
}
