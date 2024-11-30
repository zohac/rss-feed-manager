// src/infrastructure/entities/AIConfigurationEntity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AIConfigurationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  model!: string;

  @Column()
  prompt!: string;

  @Column()
  stream!: boolean;

  @Column({ nullable: true })
  temperature?: number;
}
