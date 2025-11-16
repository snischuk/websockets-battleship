import { RoomModel } from '../models/roomModel';
import type { PlayerModel } from '../models/playerModel';
export class RoomService {
  private rooms: RoomModel[] = [];

  removePlayerFromAllRooms(player: PlayerModel) {
    this.rooms.forEach((room) => {
      room.roomUsers = room.roomUsers.filter(
        (u) => u.idPlayer !== player.idPlayer,
      );
    });

    this.rooms = this.rooms.filter((room) => room.roomUsers.length > 0);
  }

  async createRoom(player: PlayerModel): Promise<RoomModel> {
    this.removePlayerFromAllRooms(player);

    const room = new RoomModel(player);
    this.rooms.push(room);
    return room;
  }

  async addUserToRoom(player: PlayerModel, roomId: string): Promise<RoomModel> {
    this.removePlayerFromAllRooms(player);

    const room = this.rooms.find((r) => r.roomId === roomId);
    if (!room) throw new Error(`Room with id ${roomId} not found`);

    room.addPlayer(player);
    return room;
  }

  getRooms() {
    return this.rooms;
  }
}
