import type { WebSocket } from 'ws';
import { RoomController } from '../../game/controllers/roomController';
import { RoomModel } from '../../game/models/roomModel';
import { ShipModel } from '../../game/models/shipModel';
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
      const room = RoomController.roomService
        .getRooms()
        .find((r) => r.roomId === gameId);
      if (!room) throw new Error('Room not found');

      const player = room.roomUsers.find((p) => p.idPlayer === indexPlayer);
      if (!player) throw new Error('Player not in room');

      player.ships = ships.map(
        (s) =>
          new ShipModel(
            { x: s.position.x, y: s.position.y },
            s.direction,
            s.length,
            s.type,
          ),
      );

      const allReady = room.roomUsers.every((p) => p.ships.length > 0);
      if (allReady) this.sendStartGame(room);
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
    room.roomUsers.forEach((player) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;

      WSPlayerAdapter.sendMessage(
        ws,
        ActionByType.CREATE_GAME,
        { idGame: room.roomId, idPlayer: player.idPlayer },
        0,
      );
    });
  }

  private sendStartGame(room: RoomModel) {
    const firstPlayerIndex = room.roomUsers[0]?.idPlayer;
    if (!firstPlayerIndex) return;

    room.roomUsers.forEach((player) => {
      const ws = WSPlayerAdapter.getWSByPlayerId(player.idPlayer);
      if (!ws) return;

      WSPlayerAdapter.sendMessage(
        ws,
        ActionByType.START_GAME,
        { ships: player.ships, currentPlayerIndex: firstPlayerIndex },
        0,
      );

      WSPlayerAdapter.sendMessage(
        ws,
        ActionByType.TURN,
        { currentPlayer: firstPlayerIndex },
        0,
      );
    });
  }

  private sendError(type: string, errorText: string, id: number) {
    if (!this.ws) return;
    WSPlayerAdapter.sendMessage(this.ws, type, { error: true, errorText }, id);
  }
}
