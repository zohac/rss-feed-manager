// src/application/commands/AssignToCollectionCommand.ts

import { Article } from '../../domain/entities/Article';
import { ArticleCollection } from '../../domain/entities/ArticleCollection';
import { IActionCommand } from '../../domain/interfaces/IActionCommand';
import { ArticleUseCases } from '../usecases/ArticleUseCases';

export class AssignToCollectionCommand implements IActionCommand {
  constructor(
    private readonly article: Article,
    private readonly collection: ArticleCollection,
    private readonly articleUseCase: ArticleUseCases,
  ) {}

  async execute(): Promise<void> {
    await this.articleUseCase.assignToCollection(this.article, this.collection);
  }
}
