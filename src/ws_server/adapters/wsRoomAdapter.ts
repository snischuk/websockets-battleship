import type { WebSocket } from 'ws';
import { PlayerModel } from '../../game/models/playerModel';
import { RoomController } from '../../game/controllers/roomController';
import {
  isCreateRoomData,
  isAddUserToRoomData,
  isAddShipsRequestData,
} from '../helpers/schemaValidator';
import { RoomModel } from '../../game/models/roomModel';
import { ShipModel } from '../../game/models/shipModel';
import {
  AddShipsRequest,
  AddUserToRoomRequest,
  CreateRoomRequest,
} from '../types/types';
import { ActionByType } from '../constants/constants';

export class WSRoomAdapter {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleCreateRoom(msg: CreateRoomRequest) {
    console.log('🏠 handleCreateRoom called with msg:', msg);

    if (!isCreateRoomData(msg.data)) {
      this.sendError(
        ActionByType.CREATE_ROOM,
        'Invalid create room data',
        msg.id,
      );
      return;
    }

    try {
      const room = await RoomController.createRoom(this.ws);

      console.log('✅ Room created:', room);
      this.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) {
        this.sendCreateGame(room);
      }
    } catch (err: unknown) {
      this.sendError(
        ActionByType.CREATE_ROOM,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  async handleAddUserToRoom(msg: AddUserToRoomRequest) {
    console.log('➕ handleAddUserToRoom called with msg:', msg);

    if (!isAddUserToRoomData(msg.data)) {
      this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        'Invalid add user to room data',
        msg.id,
      );
      return;
    }

    try {
      const room = await RoomController.addUserToRoom(
        this.ws,
        msg.data.indexRoom,
      );

      console.log('✅ User added to room:', room);
      this.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) {
        this.sendCreateGame(room);
      }
    } catch (err: unknown) {
      this.sendError(
        ActionByType.ADD_USER_TO_ROOM,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  async handleAddShips(msg: AddShipsRequest) {
    console.log('🚢 handleAddShips called with msg:', msg);

    if (!isAddShipsRequestData(msg.data)) {
      console.log('❌ isAddShipsData failed for msg.data:', msg.data);
      this.sendError('add_ships', 'Invalid add ships data', msg.id);
      return;
    }

    const { gameId, ships, indexPlayer } = msg.data;

    try {
      const room = RoomController.roomService
        .getRooms()
        .find((r) => r.roomId === gameId);
      if (!room) throw new Error(`Room/game ${gameId} not found`);

      const player = room.roomUsers.find((p) => p.id === indexPlayer);
      if (!player) throw new Error(`Player ${indexPlayer} not in room`);

      player.ships = ships.map(
        (s) =>
          new ShipModel(
            { x: s.position.x, y: s.position.y },
            s.direction,
            s.length,
            s.type,
          ),
      );

      console.log(`✅ Ships added for player ${player.name}:`, ships);

      const isAllShipsPlaced = room.roomUsers.every(
        (p) => p.ships && p.ships.length > 0,
      );
      if (isAllShipsPlaced) {
        console.log(
          '▶️ All ships placed, starting game for room:',
          room.roomId,
        );
        this.sendStartGame(room);
      }
    } catch (err: unknown) {
      this.sendError(
        ActionByType.ADD_SHIPS,
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  private broadcastUpdateRoom() {
    const rooms = RoomController.roomService.getRooms().map((r) => ({
      roomId: r.roomId,
      roomUsers: r.roomUsers.map((p) => ({ name: p.name, index: p.id })),
    }));

    console.log('🔄 Broadcasting update_room:', rooms);

    RoomController.roomService.getAllWS().forEach((ws) => {
      const response = {
        type: ActionByType.UPDATE_ROOM,
        data: JSON.stringify(rooms),
        id: 0,
      };
      console.log('➡️ Sending to ws:', response);
      ws.send(JSON.stringify(response));
    });
  }

  private sendCreateGame(room: RoomModel) {
    const idGame = room.roomId;
    room.roomUsers.forEach((p: PlayerModel) => {
      const ws = RoomController.roomService.getWSByPlayer(p);
      if (!ws) return;

      const response = {
        type: ActionByType.CREATE_GAME,
        data: JSON.stringify({ idGame, idPlayer: p.id }),
        id: 0,
      };
      console.log('➡️ Sending create_game to ws:', response);
      ws.send(JSON.stringify(response));
    });
  }

  private sendStartGame(room: RoomModel) {
    room.roomUsers.forEach((p: PlayerModel) => {
      const ws = RoomController.roomService.getWSByPlayer(p);
      if (!ws) return;

      const response = {
        type: ActionByType.START_GAME,
        data: JSON.stringify({ gameId: room.roomId }),
        id: 0,
      };
      console.log('▶️ Sending start_game to ws:', response);
      ws.send(JSON.stringify(response));
    });
  }

  private sendError(type: string, errorText: string, id: number) {
    const response = {
      type,
      data: JSON.stringify({ error: true, errorText }),
      id,
    };
    console.log('❌ Sending error:', response);
    this.ws.send(JSON.stringify(response));
  }
}
