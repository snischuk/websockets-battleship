import { PlayerModel } from './playerModel';

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export class GameModel {
  gameId: string;
  player1: PlayerModel;
  player2: PlayerModel;
  ships: Map<string, Ship[]> = new Map();
  currentTurnPlayerId: string | null | undefined = null;

  constructor(gameId: string, player1: PlayerModel, player2: PlayerModel) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
  }

  setShips(playerId: string, ships: Ship[]) {
    this.ships.set(playerId, ships);
  }

  hasBothPlayersReady(): boolean {
    return (
      this.ships.has(this.player1.idPlayer) &&
      this.ships.has(this.player2.idPlayer)
    );
  }
}
