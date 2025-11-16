import type { RawData } from 'ws';
import type { WSRequest } from '../types/types';
import { convertRawDataToString } from './convertWSRawDataToString';
import { isObject } from './isObject';
import { isWSRequest } from './schemaValidator';

const deepParse = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return value;

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return deepParse(JSON.parse(trimmed));
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
  }

  if (isObject(value)) {
    const result: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        result[key] = deepParse(value[key]);
      }
    }
    return result;
  }

  return value;
};

export const parseMessage = (wsRawMessage: RawData): WSRequest | undefined => {
  try {
    const messageString = convertRawDataToString(wsRawMessage);
    const raw = JSON.parse(messageString);

    const normalized = deepParse(raw);

    if (!isWSRequest(normalized)) {
      console.warn('⚠️ WS message is not a valid WSRequest:', normalized);
      return undefined;
    }

    return normalized;
  } catch (err) {
    console.error('⚠️ Failed to parse WS message:', err);
    return undefined;
  }
};
