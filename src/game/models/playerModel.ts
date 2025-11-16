import { randomUUID } from 'node:crypto';
import { ShipModel } from './shipModel';

export interface PlayerProps {
  name: string;
  password: string;
  idPlayer?: string;
  points?: number;
}

export class PlayerModel {
  public ships: ShipModel[] = [];
  public name: string;
  public password: string;
  public idPlayer: string;
  public points: number;

  constructor({
    name,
    password,
    idPlayer = randomUUID(),
    points = 0,
  }: PlayerProps) {
    this.name = name;
    this.password = password;
    this.idPlayer = idPlayer;
    this.points = points;
  }
}
