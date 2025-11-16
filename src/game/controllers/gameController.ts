import { GameService } from '../services/gameService';
import { PlayerModel } from '../models/playerModel';
import { Ship } from '../models/gameModel';

export class GameController {
  private static gameService = new GameService();

  static handleCreateGame(player1: PlayerModel, player2: PlayerModel) {
    return this.gameService.createGame(player1, player2);
  }

  static saveShips(gameId: string, playerId: string, ships: Ship[]) {
    return this.gameService.savePlayerShips(gameId, playerId, ships);
  }

  static getGame(gameId: string) {
    return this.gameService.getGame(gameId);
  }

  static handleStartGame(gameId: string) {
    return this.gameService.startGame(gameId);
  }
}
