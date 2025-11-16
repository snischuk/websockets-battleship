import type { WebSocket } from 'ws';
import { GameController } from '../../game/controllers/gameController';
import { PlayerModel } from '../../game/models/playerModel';
import { GameModel } from '../../game/models/gameModel';
import { AddShipsRequest } from '../types/types';
import { isAddShipsRequestData } from '../helpers/schemaValidator';
import { ActionByType } from '../constants/constants';
import { WSPlayerAdapter } from './wsPlayerAdapter';

export class WSGameAdapter {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleAddShips(msg: AddShipsRequest) {
    if (!isAddShipsRequestData(msg.data)) {
      this.sendError(ActionByType.ADD_SHIPS, 'Invalid add ships data', msg.id);
      return;
    }

    const { gameId, ships, indexPlayer: playerId } = msg.data;

    try {
      const game: GameModel = GameController.saveShips(
        String(gameId),
        String(playerId),
        ships,
      );

      if (game.hasBothPlayersReady()) this.broadcastStartGame(game);
    } catch (err: unknown) {
      this.sendError(
        ActionByType.ADD_SHIPS,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  private broadcastStartGame(game: GameModel) {
    const sendToPlayer = (player: PlayerModel) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;

      this.sendMessage(
        ws,
        ActionByType.START_GAME,
        {
          ships: game.ships.get(player.idPlayer),
          currentPlayerIndex: game.currentTurnPlayerId,
        },
        0,
      );
    };

    sendToPlayer(game.player1);
    sendToPlayer(game.player2);
  }

  private sendError(type: string, errorText: string, id: number) {
    this.sendMessage(this.ws, type, { error: true, errorText }, id);
  }

  private sendMessage(ws: WebSocket, type: string, data: unknown, id: number) {
    ws.send(JSON.stringify({ type, data: JSON.stringify(data), id }));
  }
}
