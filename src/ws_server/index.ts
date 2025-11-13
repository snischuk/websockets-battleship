import { WebSocketServer } from 'ws';
import { httpServer } from '../http_server';
import { handleConnection } from './handlers/handleConnection';

export const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', (socket, incomingMessage) =>
  handleConnection(socket, incomingMessage, wsServer),
);
