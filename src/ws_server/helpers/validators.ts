import * as Types from '../types/types';

export const isRegRequestData = (
  data: unknown,
): data is Types.RegRequestData => {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;
  return typeof d['name'] === 'string' && typeof d['password'] === 'string';
};

export const isCreateRoomData = (
  data: unknown,
): data is Types.CreateRoomRequest['data'] => data === '';

export const isAddUserToRoomData = (
  data: unknown,
): data is Types.AddUserToRoomRequest['data'] =>
  typeof data === 'object' && data !== null && 'indexRoom' in data;
