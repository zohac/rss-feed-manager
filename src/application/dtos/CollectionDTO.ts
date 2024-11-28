// src/application/dtos/CollectionDTO.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateCollectionDTO {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCollectionDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
