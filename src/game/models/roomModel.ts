import { randomUUID } from 'node:crypto';
import { PlayerModel } from './playerModel';

export class RoomModel {
  public roomId: string = randomUUID();
  public roomUsers: PlayerModel[] = [];
  public isGameStarted: boolean = false;

  constructor(initialPlayer?: PlayerModel) {
    if (initialPlayer) this.roomUsers.push(initialPlayer);
  }

  addPlayer(player: PlayerModel) {
    if (this.roomUsers.length >= 2) throw new Error('Room is full');
    this.roomUsers.push(player);
  }

  removePlayer(playerId: string) {
    this.roomUsers = this.roomUsers.filter((p) => p.idPlayer !== playerId);
  }
}
