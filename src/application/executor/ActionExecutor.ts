// src/application/executor/ActionExecutor.ts

import { Action, ActionType } from '../../domain/entities/Action';
import { Article } from '../../domain/entities/Article';
import { AssignToCollectionAction } from '../../domain/entities/AssignToCollectionAction';
import { IActionCommand } from '../../domain/interfaces/IActionCommand';
import { AssignToCollectionCommand } from '../commands/AssignToCollectionCommand';
import { ArticleUseCases } from '../usecases/ArticleUseCases';

// Importez d'autres commandes si nécessaire

export class ActionExecutor {
  constructor(private readonly articleUseCases: ArticleUseCases) {}

  async executeActions(actions: Action[], article: Article): Promise<void> {
    let command: IActionCommand;

    for (const action of actions) {
      switch (action.type) {
        case ActionType.ASSIGN_TO_COLLECTION:
          command = await this.getAssignToCollectionCommand(action, article);
          break;
        // Gérez d'autres types d'actions
        default:
          throw new Error(`Type d'action inconnu: ${action.type}`);
      }
      await command.execute();
    }
  }

  private async getAssignToCollectionCommand(
    action: AssignToCollectionAction,
    article: Article,
  ): Promise<AssignToCollectionCommand> {
    if (undefined !== action.parameter.collection) {
      return new AssignToCollectionCommand(
        article,
        action.parameter.collection,
        this.articleUseCases,
      );
    }

    throw new Error("Aucune collection n'est assignée à l'action");
  }
}
