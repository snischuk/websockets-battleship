import type { RawData } from 'ws';
import type { BaseRequest } from '../types/types';
import { convertRawDataToString } from './convertWSRawDataToString';

const deepParse = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) return value;

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return deepParse(parsed);
      } catch {
        return value;
      }
    }

    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;

    const num = Number(trimmed);
    if (!Number.isNaN(num)) return num;

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepParse);
  } else if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = deepParse((value as Record<string, unknown>)[key]);
      }
    }
    return result;
  }

  return value;
};

export const parseMessage = <T = unknown>(
  wsRawMessage: RawData,
): BaseRequest<T> | undefined => {
  try {
    const messageString = convertRawDataToString(wsRawMessage);
    const parsedMessage = JSON.parse(messageString) as BaseRequest<unknown>;

    parsedMessage.data = deepParse(parsedMessage.data);

    return parsedMessage as BaseRequest<T>;
  } catch (err) {
    console.error('⚠️ Failed to parse message:', err);
    return undefined;
  }
};
