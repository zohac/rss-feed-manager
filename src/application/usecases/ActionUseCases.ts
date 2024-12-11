// src/usecases/AgentAIUseCases.ts

import { Action, ActionType } from '../../domain/entities/Action';
import { AIAnalysis } from '../../domain/entities/AIAnalysis';
import { ArticleCollection } from '../../domain/entities/ArticleCollection';
import { AssignToCollectionAction } from '../../domain/entities/AssignToCollectionAction';
import { IRepository } from '../../domain/interfaces/IRepository';
import { IUseCase } from '../../domain/interfaces/IUseCase';
import logger from '../../infrastructure/logger/logger';
import { CreateActionDTO, UpdateActionDTO } from '../dtos/ActionDTO';
import {
  CreateAssignToCollectionActionDTO,
  UpdateAssignToCollectionActionDTO,
} from '../dtos/AssignToCollectionActionDTO';
import { NotFoundException } from '../exception/NotFoundException';
import { ActionExecutor } from '../executor/ActionExecutor';

import { AIAnalysisUseCase } from './AIAnalysisUseCase';

export class ActionUseCases
  implements IUseCase<Action, CreateActionDTO, UpdateActionDTO>
{
  constructor(
    private readonly actionExecutor: ActionExecutor,
    private readonly actionRepository: IRepository<Action>,
    private readonly aiAnalysisUseCase: AIAnalysisUseCase,
    private readonly articleCollectionRepository: IRepository<ArticleCollection>,
  ) {}

  async getAll(): Promise<Action[]> {
    return await this.actionRepository.getAll();
  }

  async getOneById(id: number): Promise<Action | null> {
    return await this.actionRepository.getOneById(id);
  }

  async create(dto: CreateActionDTO): Promise<Action> {
    let entity: Action;

    switch (dto.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignDTO = dto as CreateAssignToCollectionActionDTO;
        entity = new AssignToCollectionAction(
          undefined,
          assignDTO.name,
          assignDTO.type,
          {
            collection: undefined,
          },
        );

        const collection = await this.articleCollectionRepository.getOneById(
          assignDTO.collectionId,
        );
        if (collection) entity.parameter.collection = collection;

        break;
      }

      default:
        throw new Error(`Type d'action inconnu: ${dto.type}`);
    }

    return await this.actionRepository.create(entity);
  }

  async update(dto: UpdateActionDTO): Promise<Action> {
    const domain = await this.actionRepository.getOneById(dto.id);
    if (!domain) {
      throw new NotFoundException(
        "Une erreur est survenu lors de la mise à jour à jour de l'action.",
      );
    }

    switch (dto.type) {
      case ActionType.ASSIGN_TO_COLLECTION: {
        const assignDTO = dto as UpdateAssignToCollectionActionDTO;

        domain.id = dto.id;
        if (undefined !== dto.name) domain.name = dto.name;
        domain.type = dto.type;

        const collection = await this.articleCollectionRepository.getOneById(
          assignDTO.collectionId,
        );
        if (collection) domain.parameter.collection = collection;

        break;
      }

      default:
        throw new Error(`Type d'action inconnu: ${dto.type}`);
    }

    return await this.actionRepository.update(domain);
  }

  async delete(id: number): Promise<void> {
    return await this.actionRepository.delete(id);
  }

  async executeAllActions(): Promise<void> {
    logger.info("Début d'exécution des actions de toutes les analyses.");

    const allAnalysis: AIAnalysis[] =
      await this.aiAnalysisUseCase.getAnalysisWithoutActionExecuted();

    for (const analysis of allAnalysis) {
      if (
        undefined !== analysis.agent &&
        undefined !== analysis.agent.actions &&
        undefined !== analysis.article
      ) {
        logger.info(
          `Action sur l'analyse commencé. ID analyse : ${analysis.id}`,
        );

        await this.actionExecutor.executeActions(
          analysis.agent.actions,
          analysis.article,
        );

        analysis.isActionExecuted = true;

        await this.aiAnalysisUseCase.update(analysis);
        logger.info(
          `Action sur l'analyse terminée. ID analyse : ${analysis.id}`,
        );
      }
    }

    logger.info("Fin d'exécution des actions de toutes les analyses.");
  }
}
