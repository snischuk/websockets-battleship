import { RegRequestData } from '../types/types';
export const isRegRequestData = (data: unknown): data is RegRequestData => {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;
  return typeof d['name'] === 'string' && typeof d['password'] === 'string';
};
