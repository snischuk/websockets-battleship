import { GameService } from '../services/gameService';
import { PlayerModel } from '../models/playerModel';
import { Ship } from '../models/gameModel';

export class GameController {
  private static gameService = new GameService();

  static handleCreateGame(
    player1: PlayerModel,
    player2: PlayerModel,
    roomId: string,
  ) {
    return this.gameService.createGame(player1, player2, roomId);
  }

  static saveShips(gameId: string, playerId: string, ships: Ship[]) {
    return this.gameService.savePlayerShips(gameId, playerId, ships);
  }

  static handleStartGame(gameId: string) {
    return this.gameService.startGame(gameId);
  }

  static handleAttack(gameId: string, playerId: string, x: number, y: number) {
    return this.gameService.handleAttack(gameId, playerId, x, y);
  }

  static handleRandomAttack(gameId: string, playerId: string) {
    return this.gameService.handleRandomAttack(gameId, playerId);
  }

  static getGame(gameId: string) {
    return this.gameService.getGame(gameId);
  }
}
