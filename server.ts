import '@/envConfig';
import {createServer} from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import { connectDB } from './modules/handlerDB/connect';
import { fetchTrafficDataFromDB } from './modules/handlerDB/fetch';
import { scheduleExecution } from './modules/schedule/task';

const port: number = Number(process.env.PORT) || 443;
const httpPort: number = 80;
const address: string = process.env.SERVER || '192.168.1.3';

const dev = process.env.NODE_ENV !== 'production'
const app = next({})
const handle = app.getRequestHandler()
const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

app.prepare().then(() => {
    let httpsServer = createServer(options, (req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port, address)
    
    connectDB();
    fetchTrafficDataFromDB();
    scheduleExecution();

    const httpServer = http.createServer((req, res) => {
        res.writeHead(301, { Location: `https://${address}:${port}${req.url}` });
        res.end();
    });

    httpServer.listen(httpPort, () => {
        console.log(`HTTP server is running on http://${address}:${httpPort} and redirecting to HTTPS`);
    });
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
});

