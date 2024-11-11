import '@/envConfig';
import { createServer } from 'https';
import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import { connectDB } from '@/modules/handlerDB/connect';
import { fetchTrafficDataFromDB, getTrafficData } from '@/modules/handlerDB/fetch';
import { scheduleExecution } from '@/modules/schedule/task';
import { initialMd5, hasFileChanged } from '@/modules/check/md5';

const port: number = Number(process.env.PORT) || 443;
const httpPort: number = 80;
const address: string = process.env.SERVER || '192.168.1.3';

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
  initialMd5().catch((error) => console.error('Error initializing MD5 hash:', error));
  scheduleExecution();

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpsServer, path: '/api/traffic-updates' });
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    // Send initial data to new clients
    try {
      const initialData = getTrafficData();
      ws.send(JSON.stringify(initialData));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Broadcast updated data to all connected clients if file has changed
  setInterval(async () => {
    try {
      const hasChanged = await hasFileChanged();
      if (hasChanged) {
        const updatedData = getTrafficData();
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(updatedData));
          }
        });
      }
    } catch (error) {
      console.error('Error during periodic file check or data broadcast:', error);
    }
  }, 60000); // Check every minute

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
