// src/domain/entities/AIConfiguration.ts

import { IEntity } from '../../application/interfaces/IEntity';

export class AIConfiguration implements IEntity {
  constructor(
    public id: number | undefined,
    public model: string,
    public prompt: string,
    public stream: boolean,
    public temperature?: number,
  ) {}
}
