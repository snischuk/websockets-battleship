import { randomUUID } from 'node:crypto';
import { GameModel } from './gameModel';
import { PlayerModel } from './playerModel';

export class RoomModel {
  public roomId: string = randomUUID();
  public roomUsers: PlayerModel[] = [];
  public isGameStarted: boolean = false;
  public game?: GameModel;

  constructor(initialPlayer?: PlayerModel) {
    if (initialPlayer) this.roomUsers.push(initialPlayer);
  }

  addPlayer(player: PlayerModel) {
    if (this.roomUsers.length >= 2) throw new Error('Room is full');
    this.roomUsers.push(player);
  }

  removePlayer(playerId: string) {
    this.roomUsers = this.roomUsers.filter((p) => p.id !== playerId);
  }

  startGame() {
    if (this.roomUsers.length < 2)
      throw new Error('Cannot start game with less than 2 players');
    this.isGameStarted = true;
    this.game = new GameModel(this.roomId, this.roomUsers);
  }
}
