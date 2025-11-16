import { PlayerModel } from './playerModel';
import { Ship, ShipModel } from './shipModel';

export class GameModel {
  gameId: string;
  roomId: string;
  player1: PlayerModel;
  player2: PlayerModel;
  currentTurnPlayerId: string | null | undefined = null;

  constructor(
    gameId: string,
    player1: PlayerModel,
    player2: PlayerModel,
    roomId: string,
  ) {
    this.gameId = gameId;
    this.roomId = roomId;
    this.player1 = player1;
    this.player2 = player2;
  }

  setShips(playerId: string, ships: Ship[]) {
    const player = this.getPlayer(playerId);
    if (!player) return;

    player.serverShips = ships.map((s) => new ShipModel(s));
    player.ships = ships.map((s) => ({ ...s }));
  }

  hasBothPlayersReady(): boolean {
    return (
      this.player1.serverShips.length > 0 && this.player2.serverShips.length > 0
    );
  }

  getPlayer(playerId: string) {
    if (playerId === this.player1.idPlayer) return this.player1;
    if (playerId === this.player2.idPlayer) return this.player2;
    return null;
  }

  attack(playerId: string, x: number, y: number) {
    const opponentId =
      playerId === this.player1.idPlayer
        ? this.player2.idPlayer
        : this.player1.idPlayer;
    const opponentShips = this.getPlayer(opponentId)?.serverShips ?? [];

    let status: 'miss' | 'shot' | 'killed' = 'miss';
    let sunkShip: ShipModel | null = null;

    for (const ship of opponentShips) {
      if (ship.registerHit(x, y)) {
        status = ship.isSunk ? 'killed' : 'shot';
        if (status === 'killed') sunkShip = ship;
        break;
      }
    }

    const nextPlayerId = status === 'miss' ? opponentId : playerId;
    this.currentTurnPlayerId = nextPlayerId;

    let surroundingCells: { x: number; y: number }[] = [];
    if (sunkShip) {
      const coords = sunkShip.getCoordinates();
      for (const c of coords) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = c.x + dx;
            const ny = c.y + dy;
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
              if (!coords.some((coord) => coord.x === nx && coord.y === ny)) {
                surroundingCells.push({ x: nx, y: ny });
              }
            }
          }
        }
      }
    }

    return {
      result: status,
      shooterId: playerId,
      nextPlayerId,
      surroundingCells,
    };
  }

  randomAttack(playerId: string) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return this.attack(playerId, x, y);
  }
}

export { Ship };
