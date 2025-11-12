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
