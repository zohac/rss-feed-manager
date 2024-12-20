// src/application/dtos/CollectionDTO.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRssFeedCollectionDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRssFeedCollectionDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
