import type { WebSocket } from 'ws';
import { WSPlayerAdapter } from '../adapters/wsPlayerAdapter';
import { WSRoomAdapter } from '../adapters/wsRoomAdapter';
import type { WSRequest } from '../types/types';
import { ActionByType } from '../constants/constants';

// const isRegRequestData = (data: unknown): data is Types.RegRequestData => {
//   if (typeof data !== 'object' || data === null) return false;

//   const d = data as Record<string, unknown>;
//   return typeof d['name'] === 'string' && typeof d['password'] === 'string';
// };

// const isCreateRoomData = (
//   data: unknown,
// ): data is Types.CreateRoomRequest['data'] => data === '';

// const isAddUserToRoomData = (
//   data: unknown,
// ): data is Types.AddUserToRoomRequest['data'] =>
//   typeof data === 'object' && data !== null && 'indexRoom' in data;

// const isAddShipsData = (data: unknown): data is Types.AddShipsRequest['data'] =>
//   typeof data === 'object' &&
//   data !== null &&
//   'gameId' in data &&
//   'ships' in data &&
//   'indexPlayer' in data;

// const isAttackData = (data: unknown): data is Types.AttackRequest['data'] =>
//   typeof data === 'object' &&
//   data !== null &&
//   'gameId' in data &&
//   'x' in data &&
//   'y' in data &&
//   'indexPlayer' in data;

// const isRandomAttackData = (
//   data: unknown,
// ): data is Types.RandomAttackRequest['data'] =>
//   typeof data === 'object' &&
//   data !== null &&
//   'gameId' in data &&
//   'indexPlayer' in data;

export const routeMessagesByActionType = (msg: WSRequest, ws: WebSocket) => {
  const wsPlayerAdapter = new WSPlayerAdapter(ws);
  const wsRoomAdapter = new WSRoomAdapter(ws);

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
      // if (isAttackData(msg.data)) {
      //   const typedMsg: Types.BaseRequest<Types.AttackRequest['data']> = {
      //     ...msg,
      //     data: msg.data,
      //   };
      //   handleAttack(typedMsg);
      // }
      break;

    case ActionByType.RANDOM_ATTACK:
      // if (isRandomAttackData(msg.data)) {
      //   const typedMsg: Types.BaseRequest<Types.RandomAttackRequest['data']> = {
      //     ...msg,
      //     data: msg.data,
      //   };
      //   handleRandomAttack(typedMsg);
      // }
      break;

    default:
      console.warn('⚠️ Unknown message type');
  }
};

// const handleReg = (msg: Types.BaseRequest<Types.RegRequestData>) => {
//   console.log('👤 Handling registration:', msg.data);
// };

// const handleCreateRoom = (
//   msg: Types.BaseRequest<Types.CreateRoomRequest['data']>,
// ) => {
//   console.log('🏠 Handling create room:', msg.data);
// };

// const handleAddUserToRoom = (
//   msg: Types.BaseRequest<Types.AddUserToRoomRequest['data']>,
// ) => {
//   console.log('➕ Handling add user to room:', msg.data);
// };

// const handleAddShips = (
//   msg: Types.BaseRequest<Types.AddShipsRequest['data']>,
// ) => {
//   console.log('🚢 Handling add ships:', msg.data);
// };

// const handleAttack = (msg: Types.BaseRequest<Types.AttackRequest['data']>) => {
//   console.log('💥 Handling attack:', msg.data);
// };

// const handleRandomAttack = (
//   msg: Types.BaseRequest<Types.RandomAttackRequest['data']>,
// ) => {
//   console.log('🎲 Handling random attack:', msg.data);
// };
