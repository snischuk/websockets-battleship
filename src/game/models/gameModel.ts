import { PlayerModel } from './playerModel';

export class GameModel {
  public currentPlayerIndex: number = 0;
  public isFinished: boolean = false;

  constructor(
    public id: string,
    public players: PlayerModel[],
  ) {}

  attack(playerId: string, x: number, y: number): 'miss' | 'shot' | 'killed' {
    const enemy = this.players.find((p) => p.id !== playerId);
    if (!enemy) throw new Error('Enemy not found');

    for (const ship of enemy.ships) {
      if (ship.occupies(x, y)) {
        ship.hit(x, y);
        return ship.isSunk() ? 'killed' : 'shot';
      }
    }
    return 'miss';
  }

  nextTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  checkWinner(): PlayerModel | null {
    for (const player of this.players) {
      const allSunk = player.ships.every((ship) => ship.isSunk());
      if (allSunk) {
        return this.players.find((p) => p.id !== player.id) || null;
      }
    }
    return null;
  }
}
