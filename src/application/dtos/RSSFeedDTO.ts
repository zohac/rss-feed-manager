// src/application/dtos/RSSFeedDTO.ts
import {
  IsString,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateRSSFeedDTO {
  @IsString()
  title!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  collectionId?: number;
}

export class UpdateRSSFeedDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  collectionId?: number;
}
