import { config } from 'dotenv';
config({ quiet: true });

import { httpServer } from './http_server/index';
import { wsServer } from './ws_server/index';

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`HTTP server started on port ${PORT}`);
  console.log(
    `WS server started on the same port. Connected clients: ${wsServer.clients.size}`,
  );
});

process.on('SIGINT', () => {
  console.log('\n💀 SIGINT received. Shutting down servers...');

  wsServer.clients.forEach((client) => {
    try {
      client.close(1001, 'Server shutting down');
    } catch (err) {}
  });

  wsServer.close(() => {
    console.log('WS server closed');
  });

  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
