import type { WebSocket } from 'ws';
import type { BaseRequest } from '../types/types';
import { PlayerModel } from '../../game/models/playerModel';
import { RoomController } from '../../game/controllers/roomController';
import { isCreateRoomData, isAddUserToRoomData } from '../helpers/validators';
import { RoomModel } from '../../game/models/roomModel';

export class WSRoomAdapter {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleCreateRoom(msg: BaseRequest<unknown>) {
    if (!isCreateRoomData(msg.data)) {
      this.sendError('create_room', 'Invalid create room data', msg.id);
      return;
    }

    try {
      const room = await RoomController.createRoom(this.ws);

      this.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) {
        this.sendCreateGame(room);
      }
    } catch (err: unknown) {
      this.sendError(
        'create_room',
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }

  async handleAddUserToRoom(msg: BaseRequest<unknown>) {
    if (!isAddUserToRoomData(msg.data)) {
      this.sendError(
        'add_user_to_room',
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

      this.broadcastUpdateRoom();

      if (room.roomUsers.length === 2) {
        this.sendCreateGame(room);
      }
    } catch (err: unknown) {
      this.sendError(
        'add_user_to_room',
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
        type: 'update_room',
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
        type: 'create_game',
        data: JSON.stringify({ idGame, idPlayer: p.id }),
        id: 0,
      };
      console.log('➡️ Sending create_game to ws:', response);
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
