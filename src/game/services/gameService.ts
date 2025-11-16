import { GameModel, Ship } from '../models/gameModel';
import { PlayerModel } from '../models/playerModel';
import { randomUUID } from 'node:crypto';

export class GameService {
  private games = new Map<string, GameModel>();

  createGame(player1: PlayerModel, player2: PlayerModel): GameModel {
    const gameId = randomUUID();
    const game = new GameModel(gameId, player1, player2);
    this.games.set(gameId, game);
    return game;
  }

  getGame(gameId: string): GameModel | undefined {
    return this.games.get(gameId);
  }

  savePlayerShips(gameId: string, playerId: string, ships: Ship[]): GameModel {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');

    game.setShips(playerId, ships);
    return game;
  }

  startGame(gameId: string): GameModel {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');

    if (!game.hasBothPlayersReady()) {
      throw new Error(
        'Both players must place their ships before starting the game',
      );
    }

    if (!game.currentTurnPlayerId) {
      const playerIds = [game.player1.idPlayer, game.player2.idPlayer];
      const randomIndex = Math.floor(Math.random() * playerIds.length);
      game.currentTurnPlayerId = playerIds[randomIndex];
    }

    return game;
  }
}
