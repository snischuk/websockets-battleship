import type { WebSocket } from 'ws';
import { WSPlayerAdapter } from '../adapters/wsPlayerAdapter';
import { WSRoomAdapter } from '../adapters/wsRoomAdapter';
import type { WSRequest } from '../types/types';
import { ActionByType } from '../constants/constants';
import { WSGameAdapter } from '../adapters/wsGameAdapter';

export const routeMessagesByActionType = (msg: WSRequest, ws: WebSocket) => {
  const wsPlayerAdapter = new WSPlayerAdapter(ws);
  const wsRoomAdapter = new WSRoomAdapter(ws);
  const wsGameAdapter = new WSGameAdapter(ws);

  switch (msg.type) {
    case ActionByType.REG:
      wsPlayerAdapter.handleRegistration(msg);
      break;

    case ActionByType.CREATE_ROOM:
      wsRoomAdapter.handleCreateRoom(msg);
      break;

    case ActionByType.ADD_USER_TO_ROOM:
      wsRoomAdapter.handleAddUserToRoom(msg);
      break;

    case ActionByType.ADD_SHIPS:
      wsRoomAdapter.handleAddShips(msg);
      break;

    case ActionByType.ATTACK:
      wsGameAdapter.handleAttack(msg);

      break;

    case ActionByType.RANDOM_ATTACK:
      wsGameAdapter.handleRandomAttack(msg);

      break;

    default:
      console.warn('⚠️ Unknown message type');
  }
};
