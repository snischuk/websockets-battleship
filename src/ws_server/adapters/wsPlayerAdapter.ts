import type { WebSocket } from 'ws';
import type { BaseRequest } from '../types/types';
import { PlayerController } from '../../game/controllers/playerController';
import { isRegRequestData } from '../helpers/validators';

export class WSPlayerAdapter {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleRegistration(msg: BaseRequest<unknown>) {
    let response: { type: string; data: string; id: number };

    if (!isRegRequestData(msg.data)) {
      response = {
        type: 'reg',
        data: JSON.stringify({
          name: null,
          index: null,
          error: true,
          errorText: 'Invalid registration data',
        }),
        id: msg.id,
      };

      console.log('➡️ Sending to user object:', response);
      console.log('➡️ Sending to user string:', JSON.stringify(response));
      this.ws.send(JSON.stringify(response));
      return;
    }

    try {
      const player = await PlayerController.handleRegistration(msg.data);

      response = {
        type: 'reg',
        data: JSON.stringify({
          name: player.name,
          index: player.id,
          error: false,
          errorText: '',
        }),
        id: msg.id,
      };

      console.log('➡️ Sending to user object:', response);
      console.log('➡️ Sending to user string:', JSON.stringify(response));
      this.ws.send(JSON.stringify(response));
    } catch (err: unknown) {
      response = {
        type: 'reg',
        data: JSON.stringify({
          name: msg.data.name ?? null,
          index: null,
          error: true,
          errorText: err instanceof Error ? err.message : 'Unknown error',
        }),
        id: msg.id,
      };

      console.log('➡️ Sending to user object:', response);
      console.log('➡️ Sending to user string:', JSON.stringify(response));
      this.ws.send(JSON.stringify(response));
    }
  }
}
