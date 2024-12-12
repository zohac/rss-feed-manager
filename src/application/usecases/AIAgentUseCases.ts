// src/usecases/AgentAIUseCases.ts

import { AIAgent } from '../../domain/entities/AIAgent';
import { AIConfiguration } from '../../domain/entities/AIConfiguration';
import { Article } from '../../domain/entities/Article';
import { IArticleRepository } from '../../domain/interfaces/IArticleRepository';
import { IUseCase } from '../../domain/interfaces/IUseCase';
import { AIAgentRepository } from '../../infrastructure/repositories/AIAgentRepository';
import { ArticleRepository } from '../../infrastructure/repositories/ArticleRepository';
import { CreateAIAgentDTO, UpdateAIAgentDTO } from '../dtos/AIAgentDTO';
import { NotFoundException } from '../exception/NotFoundException';

export class AIAgentUseCases
  implements IUseCase<AIAgent, CreateAIAgentDTO, UpdateAIAgentDTO>
{
  private readonly aiAgentRepository: AIAgentRepository;
  private readonly articleRepository: IArticleRepository;

  constructor(
    aiAgentRepository: AIAgentRepository,
    articleRepository: ArticleRepository,
  ) {
    this.aiAgentRepository = aiAgentRepository;
    this.articleRepository = articleRepository;
  }

  async getAll(): Promise<AIAgent[]> {
    return await this.aiAgentRepository.getAll();
  }

  async getOneById(id: number): Promise<AIAgent | null> {
    return await this.aiAgentRepository.getOneById(id);
  }

  async create(aiAgentDTO: CreateAIAgentDTO): Promise<AIAgent> {
    const configuration = new AIConfiguration(
      undefined,
      aiAgentDTO.configuration.model,
      aiAgentDTO.configuration.prompt,
      aiAgentDTO.configuration.stream,
      aiAgentDTO.configuration.temperature,
    );

    const aiAgent = new AIAgent(
      undefined,
      aiAgentDTO.name,
      aiAgentDTO.description,
      aiAgentDTO.provider,
      aiAgentDTO.role,
      configuration,
    );

    return await this.aiAgentRepository.create(aiAgent);
  }

  async update(aiAgentDTO: UpdateAIAgentDTO): Promise<AIAgent> {
    const aiAgent = await this.aiAgentRepository.getOneById(aiAgentDTO.id);
    if (!aiAgent) {
      throw new NotFoundException(
        "Un problème est survenu lors de la mise à jour de l'agent IA.",
      );
    }

    if (undefined !== aiAgentDTO?.name) {
      aiAgent.name = aiAgentDTO.name;
    }

    if (undefined !== aiAgentDTO?.description) {
      aiAgent.description = aiAgentDTO.description;
    }

    if (undefined !== aiAgentDTO?.provider) {
      aiAgent.provider = aiAgentDTO.provider;
    }

    if (undefined !== aiAgentDTO?.role) {
      aiAgent.role = aiAgentDTO.role;
    }

    if (undefined !== aiAgentDTO?.configuration) {
      if (undefined !== aiAgentDTO.configuration.model)
        aiAgent.configuration.model = aiAgentDTO.configuration.model;

      if (undefined !== aiAgentDTO.configuration.prompt)
        aiAgent.configuration.prompt = aiAgentDTO.configuration.prompt;

      if (undefined !== aiAgentDTO.configuration.stream)
        aiAgent.configuration.stream = aiAgentDTO.configuration.stream;

      if (undefined !== aiAgentDTO.configuration.temperature)
        aiAgent.configuration.temperature =
          aiAgentDTO.configuration.temperature;
    }

    return await this.aiAgentRepository.update(aiAgent);
  }

  async delete(id: number): Promise<void> {
    await this.aiAgentRepository.delete(id);
  }

  private async getUnanalyzedArticlesByAgent(
    number: number,
  ): Promise<Article[]> {
    return this.articleRepository.getUnanalyzedArticlesByAgent(number);
  }
}
