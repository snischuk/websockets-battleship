import type { RawData } from 'ws';
// import type WebSocket from 'ws';
import type { WebSocket } from 'ws';

import type { BaseRequest } from '../types/types';
import { routeMessagesByActionType } from '../router/routeMessages';
import { parseMessage } from '../helpers/parseJSONString';

export const handleMessage = <T = unknown>(
  wsRawMessage: RawData,
  socket: WebSocket,
): BaseRequest<T> | undefined => {
  const parsedMessage = parseMessage<T>(wsRawMessage);
  if (!parsedMessage) return undefined;

  console.log('⬅️ Received command:', parsedMessage);

  routeMessagesByActionType(parsedMessage, socket);

  return parsedMessage;
};
