import { randomUUID } from 'node:crypto';
import { PlayerModel } from './playerModel';

export class RoomModel {
  public roomId: string;
  public roomUsers: PlayerModel[] = [];
  public isGameStarted: boolean = false;

  constructor(initialPlayer?: PlayerModel) {
    this.roomId = randomUUID();
    if (initialPlayer) {
      this.roomUsers.push(initialPlayer);
    }
  }

  addPlayer(player: PlayerModel) {
    if (this.roomUsers.length >= 2) {
      throw new Error('Room is full');
    }
    this.roomUsers.push(player);
  }

  removePlayer(playerId: string) {
    this.roomUsers = this.roomUsers.filter((p) => p.id !== playerId);
  }

  getPlayers(): PlayerModel[] {
    return this.roomUsers;
  }

  startGame() {
    if (this.roomUsers.length < 2) {
      throw new Error('Cannot start game with less than 2 players');
    }
    this.isGameStarted = true;
  }
}
