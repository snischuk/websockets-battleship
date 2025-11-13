import { randomUUID } from 'node:crypto';

export class PlayerModel {
  constructor(
    public name: string,
    public password: string,
    public id: string = randomUUID(),
    public points: number = 0,
  ) {}
}
