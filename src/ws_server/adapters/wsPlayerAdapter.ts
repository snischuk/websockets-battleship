import type { WebSocket } from 'ws';
import { PlayerController } from '../../game/controllers/playerController';
import { PlayerModel } from '../../game/models/playerModel';
import { RegRequest } from '../types/types';
import { ActionByType } from '../constants/constants';
import { randomUUID } from 'node:crypto';
import { isRegRequestData } from '../helpers/schemaValidator';
import { WSRoomAdapter } from './wsRoomAdapter';

export class WSPlayerAdapter {
  private ws: WebSocket;

  static wsToPlayerMap = new Map<WebSocket, PlayerModel>();
  static playerIdToWSMap = new Map<string, WebSocket>();

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  async handleRegistration(msg: RegRequest) {
    if (!isRegRequestData(msg.data)) {
      return WSPlayerAdapter.sendMessage(
        this.ws,
        ActionByType.REG,
        { error: true, errorText: 'Invalid registration data' },
        msg.id,
      );
    }

    const { name, password } = msg.data;
    const playerId = randomUUID();

    const player = new PlayerModel({
      idPlayer: playerId,
      name,
      password,
      points: 0,
    });

    WSPlayerAdapter.wsToPlayerMap.set(this.ws, player);
    WSPlayerAdapter.playerIdToWSMap.set(playerId, this.ws);

    PlayerController.handleRegistration(player);

    WSPlayerAdapter.sendMessage(
      this.ws,
      ActionByType.REG,
      {
        name: player.name,
        index: player.idPlayer,
        error: false,
        errorText: '',
      },
      msg.id,
    );

    WSRoomAdapter.broadcastUpdateRoom();

    // Можно раскомментировать для обновления таблицы победителей
    // WSPlayerAdapter.broadcastToAll(ActionByType.UPDATE_WINNERS, PlayerController.getWinners());
  }

  static getWSByPlayerId(id: string): WebSocket | undefined {
    return this.playerIdToWSMap.get(id);
  }

  static broadcastToAll(type: string, data: unknown) {
    for (const ws of WSPlayerAdapter.wsToPlayerMap.keys()) {
      WSPlayerAdapter.sendMessage(ws, type, data, 0);
    }
  }

  static sendMessage(ws: WebSocket, type: string, data: unknown, id: number) {
    const message = { type, data: JSON.stringify(data), id };
    console.log(`➡️ Server sent command:`, message);
    ws.send(JSON.stringify(message));
  }
}
