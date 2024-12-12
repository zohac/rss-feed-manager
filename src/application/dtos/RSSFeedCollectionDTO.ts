// src/application/dtos/CollectionDTO.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateRssFeedCollectionDTO {
  @IsString()
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
