import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createServer } from 'node:http';

export const httpServer = createServer(async (req, res) => {
  try {
    const __dirname = resolve();
    const url = req.url ?? '/';

    const filePath =
      url === '/'
        ? join(__dirname, 'front', 'index.html')
        : join(__dirname, 'front', url);

    const data = await readFile(filePath);

    res.writeHead(200);
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'File not found', details: err }));
  }
});
