import type { WebSocket } from 'ws';
import type { RoomModel } from '../models/roomModel';
import { RoomService } from '../services/roomService';
import { PlayerModel } from '../models/playerModel';

export class RoomController {
  private static _roomService = new RoomService();

  static get roomService() {
    return this._roomService;
  }

  static bindPlayerToWS(ws: WebSocket, player: PlayerModel) {
    this._roomService.bindPlayerToWS(ws, player);
  }

  static async createRoom(ws: WebSocket): Promise<RoomModel> {
    console.log('🏠 RoomController: creating new room');
    try {
      const room = await this._roomService.createRoom(ws);
      console.log('🏠 RoomController: room created', room.roomId);
      return room;
    } catch (err) {
      console.error('❌ RoomController: error creating room', err);
      throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  static async addUserToRoom(
    ws: WebSocket,
    indexRoom: number | string,
  ): Promise<RoomModel> {
    console.log(`➕ RoomController: adding user to room ${indexRoom}`);
    try {
      const room = await this._roomService.addUserToRoom(ws, indexRoom);
      console.log(`➕ RoomController: user added to room ${room.roomId}`);
      return room;
    } catch (err) {
      console.error('❌ RoomController: error adding user to room', err);
      throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
  }
}
