import type { RawData } from 'ws';
import type { BaseRequest } from '../types/types';
import { convertRawDataToString } from './convertWSRawDataToString';

const isJSONString = (value: unknown): value is string =>
  typeof value === 'string';

export const parseMessage = <T = unknown>(
  wsRawMessage: RawData,
): BaseRequest<T> | undefined => {
  try {
    const messageString = convertRawDataToString(wsRawMessage);
    const parsedMessage: BaseRequest<T | unknown> = JSON.parse(messageString);

    if (isJSONString(parsedMessage.data)) {
      parsedMessage.data = JSON.parse(parsedMessage.data);
    }

    if (typeof parsedMessage.data !== 'object' || parsedMessage.data === null) {
      console.error('⚠️ Message data is invalid or empty:', parsedMessage.data);
      return undefined;
    }

    return parsedMessage as BaseRequest<T>;
  } catch (err) {
    console.error('⚠️ Failed to parse message:', err);

    return undefined;
  }
};
