import { GameModel, Ship } from '../models/gameModel';
import { PlayerModel } from '../models/playerModel';
import { randomUUID } from 'node:crypto';

export class GameService {
  private games = new Map<string, GameModel>();

  createGame(player1: PlayerModel, player2: PlayerModel, roomId: string) {
    const gameId = randomUUID();
    const game = new GameModel(gameId, player1, player2, roomId);
    this.games.set(gameId, game);
    return game;
  }

  getGame(gameId: string) {
    return this.games.get(gameId);
  }

  savePlayerShips(gameId: string, playerId: string, ships: Ship[]) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    game.setShips(playerId, ships);
    return game;
  }

  startGame(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    if (!game.hasBothPlayersReady())
      throw new Error('Both players must place their ships');

    if (!game.currentTurnPlayerId) {
      const playerIds = [game.player1.idPlayer, game.player2.idPlayer];
      game.currentTurnPlayerId = playerIds[Math.floor(Math.random() * 2)];
    }

    return game;
  }

  handleAttack(gameId: string, playerId: string, x: number, y: number) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');

    const attackResult = game.attack(playerId, x, y);

    const messages = [
      {
        position: { x, y },
        status: attackResult.result,
        currentPlayer: attackResult.shooterId,
      },
    ];

    if (attackResult.surroundingCells?.length) {
      attackResult.surroundingCells.forEach((cell) => {
        messages.push({
          position: cell,
          status: 'miss',
          currentPlayer: attackResult.shooterId,
        });
      });
    }

    return messages;
  }

  handleRandomAttack(gameId: string, playerId: string) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');

    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return this.handleAttack(gameId, playerId, x, y);
  }
}
