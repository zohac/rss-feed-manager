// src/application/dtos/ArticleDTO.ts
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateArticleDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ValidateIf((o) => o.sourceType === 'rss')
  @IsNotEmpty({ message: 'Le lien est requis lorsque sourceType est "rss".' })
  @IsString()
  link?: string;

  @IsNotEmpty()
  @IsDate()
  publicationDate!: Date;

  @IsNotEmpty()
  @IsBoolean()
  isRead!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isFavorite!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isArchived!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isSaved!: boolean;

  @IsOptional()
  @IsNumber()
  rssFeedId?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  collectionId?: number;
}

export class UpdateArticleDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsDate()
  publicationDate?: Date;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  isSaved?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @ValidateIf((o) => o.collectionId !== null)
  @IsInt()
  @Min(1)
  collectionId?: number | null;
}
