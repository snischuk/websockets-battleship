import type { WebSocket } from 'ws';
import type { BaseRequest } from '../types/types';
import { PlayerController } from '../../game/controllers/playerController';
import { PlayerModel } from '../../game/models/playerModel';
import { RoomController } from '../../game/controllers/roomController';
import { isRegRequestData } from '../helpers/validators';

export class WSPlayerAdapter {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleRegistration(msg: BaseRequest<unknown>) {
    console.log('🟢 handleRegistration msg:', msg);

    if (!isRegRequestData(msg.data)) {
      this.sendError('reg', 'Invalid registration data', msg.id);
      return;
    }

    try {
      const player = await PlayerController.handleRegistration(msg.data);
      console.log('🟢 Registered player:', player);

      RoomController.bindPlayerToWS(this.ws, player);

      this.broadcastUpdateRoom();

      // ответ клиенту
      this.sendRegistrationSuccess(player, msg.id);
    } catch (err: unknown) {
      console.error('❌ handleRegistration error:', err);
      this.sendError(
        'reg',
        err instanceof Error ? err.message : 'Unknown error',
        msg.id,
      );
    }
  }
  private sendRegistrationSuccess(player: PlayerModel, id: number) {
    const response = {
      type: 'reg',
      data: JSON.stringify({
        name: player.name,
        index: player.id,
        error: false,
        errorText: '',
      }),
      id,
    };
    console.log('➡️ Sending registration success:', response);
    this.ws.send(JSON.stringify(response));
  }

  private sendError(type: string, errorText: string, id: number) {
    const response = {
      type,
      data: JSON.stringify({
        error: true,
        errorText,
      }),
      id,
    };
    console.log('❌ Sending error:', response);
    this.ws.send(JSON.stringify(response));
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
}
