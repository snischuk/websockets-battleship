import type { WebSocket } from 'ws';
import { RoomController } from '../../game/controllers/roomController';
import { RoomModel } from '../../game/models/roomModel';

import {
  AddShipsRequest,
  AddUserToRoomRequest,
  CreateRoomRequest,
} from '../types/types';
import { ActionByType } from '../constants/constants';
import {
  isCreateRoomData,
  isAddUserToRoomData,
  isAddShipsRequestData,
} from '../helpers/schemaValidator';
import { WSPlayerAdapter } from './wsPlayerAdapter';
import { GameController } from '../../game/controllers/gameController';

export class WSRoomAdapter {
  private ws?: WebSocket;

  constructor(ws?: WebSocket) {
    this.ws = ws;
  }

  async handleCreateRoom(msg: CreateRoomRequest) {
    if (!isCreateRoomData(msg.data))
      return this.sendError(ActionByType.CREATE_ROOM, 'Invalid data', msg.id);
    if (!this.ws)
      return this.sendError(ActionByType.CREATE_ROOM, 'WS not ready', msg.id);

    const player = WSPlayerAdapter.wsToPlayerMap.get(this.ws);
    if (!player)
      return this.sendError(
        ActionByType.CREATE_ROOM,
        'Player not registered',
        msg.id,
      );

    try {
      const room = await RoomController.handleCreateRoom(player);
      WSRoomAdapter.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) this.sendCreateGame(room);
    } catch (err: unknown) {
      this.sendError(ActionByType.CREATE_ROOM, (err as Error).message, msg.id);
    }
  }

  async handleAddUserToRoom(msg: AddUserToRoomRequest) {
    if (!isAddUserToRoomData(msg.data))
      return this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        'Invalid data',
        msg.id,
      );
    if (!this.ws)
      return this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        'WS not ready',
        msg.id,
      );

    const player = WSPlayerAdapter.wsToPlayerMap.get(this.ws);
    if (!player)
      return this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        'Player not registered',
        msg.id,
      );

    try {
      const room = await RoomController.handleAddUserToRoom(
        player,
        String(msg.data.indexRoom),
      );

      WSRoomAdapter.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) this.sendCreateGame(room);
    } catch (err: unknown) {
      this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        (err as Error).message,
        msg.id,
      );
    }
  }

  async handleAddShips(msg: AddShipsRequest) {
    if (!isAddShipsRequestData(msg.data)) {
      return this.sendError(ActionByType.ADD_SHIPS, 'Invalid ships', msg.id);
    }

    const { gameId, ships, indexPlayer } = msg.data;

    try {
      const game = GameController.getGame(String(gameId));
      if (!game) throw new Error('Game not found');

      const player = [game.player1, game.player2].find(
        (p) => p.idPlayer === indexPlayer,
      );
      if (!player) throw new Error('Player not in game');

      GameController.saveShips(String(gameId), String(indexPlayer), ships);

      if (game.hasBothPlayersReady()) {
        const currentPlayer = GameController.handleStartGame(
          String(gameId),
        ).currentTurnPlayerId;

        [game.player1, game.player2].forEach((p) => {
          const ws = WSPlayerAdapter.getWSByPlayerId(p.idPlayer);
          if (!ws) return;

          WSPlayerAdapter.sendMessage(
            ws,
            ActionByType.START_GAME,
            {
              ships: p.ships,
              currentPlayerIndex: currentPlayer,
            },
            0,
          );

          WSPlayerAdapter.sendMessage(
            ws,
            ActionByType.TURN,
            { currentPlayer: currentPlayer },
            0,
          );
        });
      }
    } catch (err: unknown) {
      this.sendError(ActionByType.ADD_SHIPS, (err as Error).message, msg.id);
    }
  }

  static broadcastUpdateRoom() {
    const rooms = RoomController.roomService
      .getRooms()
      .filter((r) => r.roomUsers.length === 1)
      .map((r) => ({
        roomId: r.roomId,
        roomUsers: r.roomUsers.map((p) => ({
          name: p.name,
          index: p.idPlayer,
        })),
      }));

    WSPlayerAdapter.broadcastToAll(ActionByType.UPDATE_ROOM, rooms);
  }

  private sendCreateGame(room: RoomModel) {
    const player1 = room.roomUsers[0];
    const player2 = room.roomUsers[1];

    if (!player1 || !player2) return;

    const game = GameController.handleCreateGame(player1, player2, room.roomId);

    room.roomUsers.forEach((player) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;

      WSPlayerAdapter.sendMessage(
        ws,
        ActionByType.CREATE_GAME,
        { idGame: game.gameId, idPlayer: player.idPlayer },
        0,
      );
    });
  }

  private sendError(type: string, errorText: string, id: number) {
    if (!this.ws) return;
    WSPlayerAdapter.sendMessage(this.ws, type, { error: true, errorText }, id);
  }
}
