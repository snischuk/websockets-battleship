import { GameModel } from '../models/gameModel';
import { PlayerModel } from '../models/playerModel';
import { Ship } from '../models/gameModel';
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

  handleAttack(
    gameId: string,
    playerId: string,
    x: number,
    y: number,
  ): {
    position: { x: number; y: number };
    status: 'miss' | 'shot' | 'killed';
    currentPlayer: string;
    surroundingCells: { x: number; y: number }[];
    winnerId: string | null;
  } {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');

    const attackResult = game.attack(playerId, x, y);

    return {
      position: { x, y },
      status: attackResult.result,
      currentPlayer: attackResult.shooterId,
      surroundingCells: attackResult.surroundingCells,
      winnerId: game.getWinner(),
    };
  }

  handleRandomAttack(
    gameId: string,
    playerId: string,
  ): {
    position: { x: number; y: number };
    status: 'miss' | 'shot' | 'killed';
    currentPlayer: string;
    surroundingCells: { x: number; y: number }[];
    winnerId: string | null;
  } {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return this.handleAttack(gameId, playerId, x, y);
  }
}
