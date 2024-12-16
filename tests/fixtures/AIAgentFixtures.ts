import { Repository } from 'typeorm';

import {
  AIAgentProvider,
  AIAgentRole,
} from '../../src/domain/entities/AIAgent';
import { AIAgentEntity } from '../../src/infrastructure/entities/AIAgentEntity';

export const createAIAgentFixture = async (
  repository: Repository<AIAgentEntity>,
) => {
  const actions = [
    {
      id: undefined,
      name: 'AI Agent 1',
      description: 'Un super Agent',
      provider: AIAgentProvider.OLLAMA,
      role: AIAgentRole.ANALYSIS,
      configuration: {
        model: 'llama3.1',
        prompt: "Un super prompt pour l'agent IA 1.",
        stream: false,
        temperature: 0.7,
      },
    },
    {
      id: undefined,
      name: 'AI Agent 2',
      description: 'Un super Agent',
      provider: AIAgentProvider.OLLAMA,
      role: AIAgentRole.ANALYSIS,
      configuration: {
        model: 'llama2',
        prompt: "Un super prompt pour l'agent IA 2.",
        stream: false,
      },
    },
  ];
  return await repository.save(actions.map((data) => repository.create(data)));
};
