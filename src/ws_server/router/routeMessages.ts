import * as Types from '../types/types';

export const ActionByType = {
  REG: 'reg',
  CREATE_ROOM: 'create_room',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  ADD_SHIPS: 'add_ships',
  ATTACK: 'attack',
  RANDOM_ATTACK: 'randomAttack',
} as const;

export type ActionByType = (typeof ActionByType)[keyof typeof ActionByType];

const isRegRequestData = (data: unknown): data is Types.RegRequestData => {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;
  return typeof d['name'] === 'string' && typeof d['password'] === 'string';
};

const isCreateRoomData = (
  data: unknown,
): data is Types.CreateRoomRequest['data'] => data === '';

const isAddUserToRoomData = (
  data: unknown,
): data is Types.AddUserToRoomRequest['data'] =>
  typeof data === 'object' && data !== null && 'indexRoom' in data;

const isAddShipsData = (data: unknown): data is Types.AddShipsRequest['data'] =>
  typeof data === 'object' &&
  data !== null &&
  'gameId' in data &&
  'ships' in data &&
  'indexPlayer' in data;

const isAttackData = (data: unknown): data is Types.AttackRequest['data'] =>
  typeof data === 'object' &&
  data !== null &&
  'gameId' in data &&
  'x' in data &&
  'y' in data &&
  'indexPlayer' in data;

const isRandomAttackData = (
  data: unknown,
): data is Types.RandomAttackRequest['data'] =>
  typeof data === 'object' &&
  data !== null &&
  'gameId' in data &&
  'indexPlayer' in data;

export const routeMessagesByActionType = (msg: Types.BaseMessage<unknown>) => {
  switch (msg.type) {
    case ActionByType.REG:
      if (isRegRequestData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.RegRequestData> = {
          ...msg,
          data: msg.data,
        };
        handleReg(typedMsg);
      }
      break;

    case ActionByType.CREATE_ROOM:
      if (isCreateRoomData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.CreateRoomRequest['data']> = {
          ...msg,
          data: msg.data,
        };
        handleCreateRoom(typedMsg);
      }
      break;

    case ActionByType.ADD_USER_TO_ROOM:
      if (isAddUserToRoomData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.AddUserToRoomRequest['data']> =
          { ...msg, data: msg.data };
        handleAddUserToRoom(typedMsg);
      }
      break;

    case ActionByType.ADD_SHIPS:
      if (isAddShipsData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.AddShipsRequest['data']> = {
          ...msg,
          data: msg.data,
        };
        handleAddShips(typedMsg);
      }
      break;

    case ActionByType.ATTACK:
      if (isAttackData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.AttackRequest['data']> = {
          ...msg,
          data: msg.data,
        };
        handleAttack(typedMsg);
      }
      break;

    case ActionByType.RANDOM_ATTACK:
      if (isRandomAttackData(msg.data)) {
        const typedMsg: Types.BaseMessage<Types.RandomAttackRequest['data']> = {
          ...msg,
          data: msg.data,
        };
        handleRandomAttack(typedMsg);
      }
      break;

    default:
      console.warn('⚠️ Unknown message type:', msg.type);
  }
};

const handleReg = (msg: Types.BaseMessage<Types.RegRequestData>) => {
  console.log('👤 Handling registration:', msg.data);
};

const handleCreateRoom = (
  msg: Types.BaseMessage<Types.CreateRoomRequest['data']>,
) => {
  console.log('🏠 Handling create room:', msg.data);
};

const handleAddUserToRoom = (
  msg: Types.BaseMessage<Types.AddUserToRoomRequest['data']>,
) => {
  console.log('➕ Handling add user to room:', msg.data);
};

const handleAddShips = (
  msg: Types.BaseMessage<Types.AddShipsRequest['data']>,
) => {
  console.log('🚢 Handling add ships:', msg.data);
};

const handleAttack = (msg: Types.BaseMessage<Types.AttackRequest['data']>) => {
  console.log('💥 Handling attack:', msg.data);
};

const handleRandomAttack = (
  msg: Types.BaseMessage<Types.RandomAttackRequest['data']>,
) => {
  console.log('🎲 Handling random attack:', msg.data);
};
