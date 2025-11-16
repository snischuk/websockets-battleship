import { RoomService } from '../services/roomService';
import type { RoomModel } from '../models/roomModel';
import { PlayerModel } from '../models/playerModel';

export class RoomController {
  private static _roomService = new RoomService();

  static get roomService() {
    return this._roomService;
  }

  static async handleCreateRoom(player: PlayerModel): Promise<RoomModel> {
    return this._roomService.createRoom(player);
  }

  static async handleAddUserToRoom(
    player: PlayerModel,
    roomId: string,
  ): Promise<RoomModel> {
    return this._roomService.addUserToRoom(player, roomId);
  }
}
