import type { WebSocket } from 'ws';
import { GameController } from '../../game/controllers/gameController';
import { GameModel } from '../../game/models/gameModel';
import {
  AddShipsRequest,
  AttackRequest,
  RandomAttackRequest,
} from '../types/types';
import {
  isAddShipsRequestData,
  isAttackData,
  isRandomAttackData,
} from '../helpers/schemaValidator';
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

      if (game.hasBothPlayersReady()) {
        this.broadcastStartGame(game);
        this.broadcastTurn(game);
      }
    } catch (err: unknown) {
      this.sendError(
        ActionByType.ADD_SHIPS,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  async handleAttack(msg: AttackRequest) {
    if (!isAttackData(msg.data)) {
      this.sendError(ActionByType.ATTACK, 'Invalid attack data', msg.id);
      return;
    }

    const { gameId, x, y, indexPlayer } = msg.data;
    const game = GameController.getGame(String(gameId));
    if (!game) {
      this.sendError(ActionByType.ATTACK, 'Game not found', msg.id);
      return;
    }

    if (game.currentTurnPlayerId !== indexPlayer) {
      this.sendError(ActionByType.ATTACK, 'Not your turn', msg.id);
      return;
    }

    try {
      const attackMessages = GameController.handleAttack(
        String(gameId),
        String(indexPlayer),
        x,
        y,
      );

      attackMessages.forEach((msgData) => {
        WSPlayerAdapter.broadcastToAll(ActionByType.ATTACK, msgData);
      });

      this.broadcastTurn(game);
    } catch (err: unknown) {
      this.sendError(ActionByType.ATTACK, (err as Error).message, msg.id);
    }
  }

  async handleRandomAttack(msg: RandomAttackRequest) {
    if (!isRandomAttackData(msg.data)) {
      this.sendError(
        ActionByType.RANDOM_ATTACK,
        'Invalid random attack data',
        msg.id,
      );
      return;
    }

    const { gameId, indexPlayer } = msg.data;
    const game = GameController.getGame(String(gameId));
    if (!game) {
      this.sendError(ActionByType.RANDOM_ATTACK, 'Game not found', msg.id);
      return;
    }

    try {
      const attackMessages = GameController.handleRandomAttack(
        String(gameId),
        String(indexPlayer),
      );

      attackMessages.forEach((msgData) => {
        WSPlayerAdapter.broadcastToAll(ActionByType.ATTACK, msgData);
      });

      this.broadcastTurn(game);
    } catch (err: unknown) {
      this.sendError(
        ActionByType.RANDOM_ATTACK,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  private broadcastStartGame(game: GameModel) {
    [game.player1, game.player2].forEach((player) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;

      this.sendMessage(
        ws,
        ActionByType.START_GAME,
        {
          ships: player.ships,
          currentPlayerIndex: player.idPlayer,
        },
        0,
      );
    });
  }

  private broadcastTurn(game: GameModel) {
    const data = { currentPlayer: game.currentTurnPlayerId };
    [game.player1, game.player2].forEach((player) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;
      this.sendMessage(ws, 'turn', data, 0);
    });
  }

  private sendError(type: string, errorText: string, id: number) {
    this.sendMessage(this.ws, type, { error: true, errorText }, id);
  }

  private sendMessage(ws: WebSocket, type: string, data: unknown, id: number) {
    ws.send(JSON.stringify({ type, data: JSON.stringify(data), id }));
  }
}
