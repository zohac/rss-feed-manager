// src/infrastructure/entities/AIAgentEntity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { ActionEntity } from './ActionEntity';
import { AIConfigurationEntity } from './AIConfigurationEntity';

@Entity()
export class AIAgentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  provider!: string;

  @Column()
  role!: string;

  @OneToOne(() => AIConfigurationEntity, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  configuration!: AIConfigurationEntity;

  @OneToMany(() => ActionEntity, (actionEntity) => actionEntity.agent, {
    cascade: true,
    eager: true,
  })
  actions?: ActionEntity[];
}
