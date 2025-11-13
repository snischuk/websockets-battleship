import type { WebSocketServer } from 'ws';

export const handleClose = (
  clientIP: string | undefined,
  clientPort: number | undefined,
  wsServer: WebSocketServer,
) => {
  console.log(`🔴 Client disconnected: ${clientIP}:${clientPort}`);
  console.log(`Total connected clients: ${wsServer.clients.size}`);

  // TODO: mb should remove player or to clear the room or smth else
};
