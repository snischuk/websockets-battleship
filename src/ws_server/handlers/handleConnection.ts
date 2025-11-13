import type { IncomingMessage } from 'node:http';
import type { WebSocketServer } from 'ws';
// import type WebSocket from 'ws';
import type { WebSocket } from 'ws';

import { handleClose } from './handleClose';
import { handleMessage } from './handleMessage';

export const handleConnection = (
  socket: WebSocket,
  incomingMessage: IncomingMessage,
  wsServer: WebSocketServer,
) => {
  const clientIP = incomingMessage.socket.remoteAddress;
  const clientPort = incomingMessage.socket.remotePort;

  console.log(`🟢 New client connected: ${clientIP}:${clientPort}`);
  console.log(`Total connected clients: ${wsServer.clients.size}`);

  socket.on('message', (message) => handleMessage(message, socket));
  socket.on('close', () => handleClose(clientIP, clientPort, wsServer));
};
