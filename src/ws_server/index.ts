import { WebSocketServer } from 'ws';
import { httpServer } from '../http_server';

export const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', (socket, req) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;

  console.log(`🟢 New client connected: ${ip}:${port}`);
  console.log(`Total connected clients: ${wsServer.clients.size}`);

  socket.on('message', () => {});

  socket.on('close', () =>
    console.log(`🔴 Client disconnected: ${ip}:${port}`),
  );
});
