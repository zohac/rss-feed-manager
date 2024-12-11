// src/application/dtos/ActionDTO.ts

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ActionType } from '../../domain/entities/Action';

export class CreateActionDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(ActionType)
  type!: ActionType;
}

export class UpdateActionDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(ActionType)
  type!: ActionType;
}
