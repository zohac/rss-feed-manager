// src/application/dtos/ArticleDTO.ts
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AIAgentProvider, AIAgentRole } from '../../domain/entities/AIAgent';

import {
  CreateAIConfigurationDTO,
  UpdateAIConfigurationDTO,
} from './AIConfigurationDTO';

export class CreateAIAgentDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum(AIAgentProvider)
  provider!: AIAgentProvider;

  @IsNotEmpty()
  @IsEnum(AIAgentRole)
  role!: AIAgentRole;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAIConfigurationDTO)
  configuration!: CreateAIConfigurationDTO;
}

export class UpdateAIAgentDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AIAgentProvider)
  provider?: AIAgentProvider;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AIAgentRole)
  role?: AIAgentRole;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateAIConfigurationDTO)
  configuration!: UpdateAIConfigurationDTO;
}
