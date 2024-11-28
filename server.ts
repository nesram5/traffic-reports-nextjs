import '@/envConfig';
import { createServer } from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import { connectDB } from '@/server-modules/handlerDB/connect';
import { fetchTrafficDataFromDB } from '@/server-modules/handlerDB/fetch';
import { scheduleExecution } from '@/server-modules/schedule/task';

const port: number = Number(process.env.PORT) || 443;
const httpPort: number = 80;
const address: string = process.env.SERVER || 'localhost';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ });
const handle = app.getRequestHandler();
const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

app.prepare().then(() => {
  // Create HTTPS server
  const httpsServer = createServer(options, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port, address, () => {
    console.log(`> HTTPS server listening on https://${address}:${port}`);
  });

  // Establish database connection and fetch initial data
  connectDB().catch((error) => console.error('Error connecting to DB:', error));
  fetchTrafficDataFromDB().catch((error) => console.error('Error fetching initial traffic data:', error));
  scheduleExecution();
  // Create HTTP server for redirection to HTTPS
  const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${address}:${port}${req.url}` });
    res.end();
  });

  httpServer.listen(httpPort, () => {
    console.log(`HTTP server running on http://${address}:${httpPort}, redirecting to HTTPS`);
  });
}).catch((error) => {
  console.error('Error preparing Next.js application:', error);
});
