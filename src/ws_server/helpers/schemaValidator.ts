import { ActionByType } from '../constants/constants';
import * as Types from '../types/types';
import { isObject } from './isObject';

const isArrayOf = <T>(
  arr: unknown,
  checkItem: (item: unknown) => item is T,
): arr is T[] => Array.isArray(arr) && arr.every(checkItem);

const hasKey = <K extends string>(
  obj: Record<string, unknown>,
  key: K,
): obj is Record<K, unknown> => Object.hasOwn(obj, key);

export const isWSRequest = (msg: unknown): msg is Types.WSRequest => {
  if (!isObject(msg)) return false;
  if (!hasKey(msg, 'type')) return false;
  if (!hasKey(msg, 'data')) return false;
  if (!hasKey(msg, 'id')) return false;
  if (msg.id !== 0) return false;

  return (
    msg.type === ActionByType.REG ||
    msg.type === ActionByType.CREATE_ROOM ||
    msg.type === ActionByType.ADD_USER_TO_ROOM ||
    msg.type === ActionByType.ADD_SHIPS ||
    msg.type === ActionByType.ATTACK ||
    msg.type === ActionByType.RANDOM_ATTACK
  );
};

export const isShip = (value: unknown): value is Types.Ship => {
  if (!isObject(value)) return false;
  if (!hasKey(value, 'position') || !isObject(value.position)) return false;
  if (
    typeof value.position.x !== 'number' ||
    typeof value.position.y !== 'number'
  )
    return false;
  if (!hasKey(value, 'direction') || typeof value.direction !== 'boolean')
    return false;
  if (!hasKey(value, 'length') || typeof value.length !== 'number')
    return false;
  if (!hasKey(value, 'type') || typeof value.type !== 'string') return false;
  if (!['small', 'medium', 'large', 'huge'].includes(value.type)) return false;
  return true;
};

export const isRegRequestData = (
  data: unknown,
): data is Types.RegRequestData => {
  if (!isObject(data)) return false;
  if (!hasKey(data, 'name') || typeof data.name !== 'string') return false;
  if (!hasKey(data, 'password') || typeof data.password !== 'string')
    return false;
  return true;
};

export const isCreateRoomData = (
  data: unknown,
): data is Types.CreateRoomRequest['data'] => data === '';

export const isAddUserToRoomData = (
  data: unknown,
): data is Types.AddUserToRoomRequest['data'] => {
  if (!isObject(data)) return false;
  if (!hasKey(data, 'indexRoom')) return false;
  if (typeof data.indexRoom !== 'string' && typeof data.indexRoom !== 'number')
    return false;
  return true;
};

export const isAddShipsRequestData = (
  data: unknown,
): data is Types.AddShipsRequest['data'] => {
  if (!isObject(data)) return false;
  if (!hasKey(data, 'gameId')) return false;
  if (typeof data.gameId !== 'string' && typeof data.gameId !== 'number')
    return false;
  if (!hasKey(data, 'ships') || !isArrayOf(data.ships, isShip)) return false;
  if (!hasKey(data, 'indexPlayer')) return false;
  if (
    typeof data.indexPlayer !== 'string' &&
    typeof data.indexPlayer !== 'number'
  )
    return false;
  return true;
};

export const isRegResponseData = (
  data: unknown,
): data is Types.RegResponseData => {
  if (!isObject(data)) return false;
  if (
    !hasKey(data, 'name') ||
    (data.name !== null && typeof data.name !== 'string')
  )
    return false;
  if (
    !hasKey(data, 'index') ||
    (data.index !== null &&
      typeof data.index !== 'string' &&
      typeof data.index !== 'number')
  )
    return false;
  if (!hasKey(data, 'error') || typeof data.error !== 'boolean') return false;
  if (!hasKey(data, 'errorText') || typeof data.errorText !== 'string')
    return false;
  return true;
};

export const isStartGameResponseData = (
  data: unknown,
): data is Types.StartGameResponse['data'] => {
  if (!isObject(data)) return false;
  if (!hasKey(data, 'ships') || !isArrayOf(data.ships, isShip)) return false;
  if (!hasKey(data, 'currentPlayerIndex')) return false;
  if (
    typeof data.currentPlayerIndex !== 'string' &&
    typeof data.currentPlayerIndex !== 'number'
  )
    return false;
  return true;
};

export const isUpdateWinnersResponseData = (
  data: unknown,
): data is Types.UpdateWinnersResponse['data'] => {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      isObject(item) &&
      hasKey(item, 'name') &&
      typeof item.name === 'string' &&
      hasKey(item, 'wins') &&
      typeof item.wins === 'number',
  );
};

export const isUpdateRoomResponseData = (
  data: unknown,
): data is Types.UpdateRoomResponse['data'] => {
  if (!Array.isArray(data)) return false;
  return data.every(
    (room) =>
      isObject(room) &&
      hasKey(room, 'roomId') &&
      (typeof room.roomId === 'string' || typeof room.roomId === 'number') &&
      hasKey(room, 'roomUsers') &&
      Array.isArray(room.roomUsers) &&
      room.roomUsers.every(
        (user) =>
          isObject(user) &&
          hasKey(user, 'name') &&
          typeof user.name === 'string' &&
          hasKey(user, 'index') &&
          (typeof user.index === 'string' || typeof user.index === 'number'),
      ),
  );
};
