import { config } from 'dotenv';
config();

import { httpServer } from './http_server/index';

const PORT = process.env.PORT || 3000;

console.log(`Start static http server on the ${PORT} port!`);
httpServer.listen(PORT);
