// import type { WebSocket } from 'ws';
// import { RoomModel } from '../models/roomModel';
// import { PlayerModel } from '../models/playerModel';

// export class RoomService {
//   private rooms: RoomModel[] = [];
//   private wsToPlayerMap = new Map<WebSocket, PlayerModel>();

//   bindPlayerToWS(ws: WebSocket, player: PlayerModel) {
//     this.wsToPlayerMap.set(ws, player);
//   }

//   getWSByPlayer(player: PlayerModel): WebSocket | undefined {
//     for (const [ws, p] of this.wsToPlayerMap) {
//       if (p.id === player.id) return ws;
//     }
//     return undefined;
//   }

//   getAllWS(): WebSocket[] {
//     return Array.from(this.wsToPlayerMap.keys());
//   }

//   isInRoom(playerId: string): boolean {
//     return this.rooms.some(r => r.roomUsers.some(p => p.id === playerId));
//   }

//   async createRoom(ws: WebSocket): Promise<RoomModel> {
//     const player = this.getPlayerFromWS(ws);

//     if (this.isInRoom(player.id)) {
//       throw new Error('Player is already in a room');
//     }

//     const room = new RoomModel(player);
//     this.rooms.push(room);

//     return room;
//   }

//   async addUserToRoom(ws: WebSocket, indexRoom: string | number): Promise<RoomModel> {
//     const roomId = String(indexRoom);
//     const room = this.rooms.find((r) => r.roomId === roomId);

//     if (!room) {
//       throw new Error(`Room with id ${indexRoom} not found`);
//     }

//     const player = this.getPlayerFromWS(ws);

//     if (this.isInRoom(player.id)) {
//       throw new Error('Player is already in a room');
//     }

//     room.addPlayer(player);
//     return room;
//   }

//   private getPlayerFromWS(ws: WebSocket): PlayerModel {
//     if (this.wsToPlayerMap.has(ws)) {
//       return this.wsToPlayerMap.get(ws)!;
//     }

//     const player = new PlayerModel(
//       'Player-' + Math.floor(Math.random() * 10000),
//       'password'
//     );

//     this.wsToPlayerMap.set(ws, player);
//     return player;
//   }

//   getRooms(): RoomModel[] {
//     return this.rooms;
//   }
// }

import type { WebSocket } from 'ws';
import { RoomModel } from '../models/roomModel';
import { PlayerModel } from '../models/playerModel';

export class RoomService {
  private rooms: RoomModel[] = [];
  private wsToPlayerMap = new Map<WebSocket, PlayerModel>();

  bindPlayerToWS(ws: WebSocket, player: PlayerModel) {
    this.wsToPlayerMap.set(ws, player);
  }

  getWSByPlayer(player: PlayerModel): WebSocket | undefined {
    for (const [ws, p] of this.wsToPlayerMap) {
      if (p.id === player.id) return ws;
    }
    return undefined;
  }

  getAllWS(): WebSocket[] {
    return Array.from(this.wsToPlayerMap.keys());
  }

  async createRoom(ws: WebSocket): Promise<RoomModel> {
    const player = this.getPlayerFromWS(ws);

    if (this.isInRoom(player)) {
      throw new Error('Player is already in a room');
    }

    const room = new RoomModel(player);
    this.rooms.push(room);
    return room;
  }

  async addUserToRoom(
    ws: WebSocket,
    indexRoom: string | number,
  ): Promise<RoomModel> {
    const roomId = String(indexRoom);
    const room = this.rooms.find((r) => r.roomId === roomId);

    if (!room) throw new Error(`Room with id ${indexRoom} not found`);

    const player = this.getPlayerFromWS(ws);

    if (room.roomUsers.some((p) => p.id === player.id)) {
      throw new Error('Player already in the room');
    }

    room.addPlayer(player);
    return room;
  }

  private getPlayerFromWS(ws: WebSocket): PlayerModel {
    if (!this.wsToPlayerMap.has(ws)) {
      throw new Error('Player not registered. Please register first.');
    }
    return this.wsToPlayerMap.get(ws)!;
  }

  private isInRoom(player: PlayerModel): boolean {
    return this.rooms.some((room) =>
      room.roomUsers.some((p) => p.id === player.id),
    );
  }

  getRooms(): RoomModel[] {
    return this.rooms;
  }
}
