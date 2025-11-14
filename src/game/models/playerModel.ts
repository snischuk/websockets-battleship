import { randomUUID } from 'node:crypto';
import { ShipModel } from './shipModel';

export class PlayerModel {
  public ships: ShipModel[] = [];

  constructor(
    public name: string,
    public password: string,
    public id: string = randomUUID(),
    public points: number = 0,
  ) {}
}
