// src/infrastructure/entities/ActionEntity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ManyToOne,
} from 'typeorm';

import { AIAgentEntity } from './AIAgentEntity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class ActionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @ManyToOne(() => AIAgentEntity)
  agent?: AIAgentEntity;
}
