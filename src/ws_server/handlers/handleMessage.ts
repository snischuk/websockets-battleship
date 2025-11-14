import type { RawData, WebSocket } from 'ws';
import type { WSRequest } from '../types/types';
import { routeMessagesByActionType } from '../router/routeMessages';
import { parseMessage } from '../helpers/parseJSONString';

export const handleMessage = (
  wsRawMessage: RawData,
  socket: WebSocket,
): WSRequest | undefined => {
  const parsedMessage = parseMessage(wsRawMessage);
  if (!parsedMessage) return undefined;

  console.log('⬅️ Received command:', parsedMessage);

  routeMessagesByActionType(parsedMessage, socket);

  return parsedMessage;
};
