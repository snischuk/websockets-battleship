import type { RawData } from 'ws';
import { rawDataToString } from '../helpers/helpers';
import * as Types from '../types/types';
import { routeMessagesByActionType } from '../router/routeMessages';

export const handleMessage = <T = unknown>(
  wsRawMessage: RawData,
): Types.BaseMessage<T> | undefined => {
  const messageJSON = rawDataToString(wsRawMessage);

  try {
    const parsedMessage: Types.BaseMessage<T> = JSON.parse(messageJSON);

    if (typeof parsedMessage.data === 'string') {
      parsedMessage.data = JSON.parse(parsedMessage.data);
    }

    console.log('📩 Parsed message:', parsedMessage);

    routeMessagesByActionType(parsedMessage);
  } catch (err) {
    console.error('⚠️ Failed to parse message JSON:', err);
    return undefined;
  }
};
