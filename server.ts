import { createServer } from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import { port, address, httpPort } from '@/config/env';
import { extractUsdValue } from '@/server-modules/getUSDValue/fetch';
import schedule from 'node-schedule';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
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

  
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [1, 2, 3, 4, 5]; // 1 = Monday, 2 = Tuesday, 5 = Friday
  rule.hour = 10; // 10:00 AM
  rule.minute = 0;
  
  schedule.scheduleJob(rule, () => {
    extractUsdValue();
  });

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
