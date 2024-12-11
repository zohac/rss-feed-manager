// src/application/dtos/ActionDTO.ts

import { IsInt, Min } from 'class-validator';

import { CreateActionDTO, UpdateActionDTO } from './ActionDTO';

export class CreateAssignToCollectionActionDTO extends CreateActionDTO {
  @IsInt()
  @Min(1)
  collectionId!: number;
}

export class UpdateAssignToCollectionActionDTO extends UpdateActionDTO {
  @IsInt()
  @Min(1)
  collectionId!: number;
}
